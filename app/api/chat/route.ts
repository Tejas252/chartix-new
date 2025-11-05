import { getGenerativeModel } from "@/lib/models";
import { extractDataFromFileBuffer, getFirstFiveRowsAsString } from "@/lib/utils/file-utils";
import { SYSTEM_PROMPT } from "@/prompts/system";
import conversationRepository from "@/server/models/conversations/conversations.query";
import { convertToModelMessages, generateText, UIMessage, validateUIMessages } from "ai";
import { NextRequest, NextResponse } from "next/server";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { nanoid } from "nanoid";
import { markDownToJson } from "@/lib/utils/json-parser";
import { processDataToChartFormat } from "@/server/services/generationStep";
import { downloadFileFromStorage } from "@/lib/supabase/storage";
import { authorizeUser, requireUser } from "@/lib/auth";
import chartRepository from "@/server/models/charts/charts.query";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request body
    let requestBody: { messages: UIMessage[], conversationId: string };
    authorizeUser()
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("🚀 ~ POST ~ Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { messages, conversationId } = requestBody;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json(
        { error: 'Valid conversation ID is required' },
        { status: 400 }
      );
    }

    // 2. Get the conversation and associated file
    let con;
    try {
      con = await conversationRepository.getConversationById(conversationId);
      console.log("🚀 ~ POST ~ con:", con);
    } catch (dbError) {
      console.error("🚀 ~ POST ~ Database error fetching conversation:", dbError);
      return NextResponse.json(
        { error: 'Database error while fetching conversation' },
        { status: 500 }
      );
    }

    if (!con) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    if (!con.files) {
      return NextResponse.json(
        { error: 'No files associated with this conversation' },
        { status: 400 }
      );
    }

    const { url } = con.files;

    if (!url) {
      return NextResponse.json(
        { error: 'File URL is missing in conversation' },
        { status: 400 }
      );
    }

    // 3. Download the file content from storage
    let fileBuffer;
    try {
      fileBuffer = await downloadFileFromStorage(url);
    } catch (downloadError) {
      console.error("🚀 ~ POST ~ Error downloading file:", downloadError);
      return NextResponse.json(
        { error: 'Failed to download file from storage' },
        { status: 500 }
      );
    }

    if (!fileBuffer) {
      return NextResponse.json(
        { error: 'Failed to download file from storage - no data returned' },
        { status: 500 }
      );
    }

    // 4. Extract and process data from the file
    let data;
    try {
      data = extractDataFromFileBuffer(fileBuffer);
      if (!data || !Array.isArray(data) || data.length === 0) {
        return NextResponse.json(
          { error: 'File contains no valid data' },
          { status: 400 }
        );
      }
    } catch (extractError) {
      console.error("🚀 ~ POST ~ Error extracting data from file:", extractError);
      return NextResponse.json(
        { error: 'Error processing the uploaded file' },
        { status: 500 }
      );
    }

    const fiveRowsData = getFirstFiveRowsAsString(data);
    console.log("🚀 ~ POST ~ fiveRowsData:", fiveRowsData);

    // 5. Get the last user message and enhance it
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.parts) {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    const lastUserMessageText = lastMessage.parts
      .map((p) => p.type === "text" && p.text)
      ?.filter(Boolean)
      .join(" ");

    if (!lastUserMessageText) {
      return NextResponse.json(
        { error: 'Last message has no text content to process' },
        { status: 400 }
      );
    }

    const enhancedUserMessage = `Based on the following data, ${lastUserMessageText}:\n\nTable Data:\n${fiveRowsData}`;
    const finalLastMessage = {...lastMessage, parts: [{ type: "text", text: enhancedUserMessage }],userParts:[{type:"text",text:lastUserMessageText}] }

    await conversationRepository.addMessage({
      conversationId,
      role:"USER",
      content:finalLastMessage,
    })

    const allMessages = await conversationRepository.getMessages(conversationId)

    // 6. Convert database messages to UIMessage format
    const dbMessagesAsUIMessages: UIMessage[] = allMessages.messages.slice(0, -1).map((msg) => {
      // If content is already a UIMessage, use it directly
      if (msg.content && typeof msg.content === 'object' && 'parts' in msg.content) {
        return msg.content as UIMessage;
      }
      // Otherwise, convert based on role and content
      const contentText = typeof msg.content === 'string' 
        ? msg.content 
        : (msg.content as any)?.text || JSON.stringify(msg.content);
      
      const roleMap: Record<string, 'user' | 'assistant' | 'system'> = {
        'USER': 'user',
        'ASSISTANT': 'assistant',
        'SYSTEM': 'system',
      };
      
      return {
        id: msg.id,
        role: roleMap[msg.role] || 'user',
        parts: [{ type: "text", text: contentText }],
      } as UIMessage;
    });

    // 7. Create enhanced messages array
    const enhancedMessages: UIMessage[] = [
      ...dbMessagesAsUIMessages,
      { ...lastMessage, parts: [{ type: "text", text: enhancedUserMessage }] } // Enhanced last message
    ];

    // 8. Validate enhanced messages
    let validatedMessages: UIMessage[] = [];
    try {
      validatedMessages = await validateUIMessages({
        messages: enhancedMessages
      });
    } catch (validationError) {
      console.warn("🚀 ~ POST ~ Message validation error (continuing with original messages):", validationError);
      // Continue with original enhanced messages if validation fails
      validatedMessages = enhancedMessages;
    }

    console.log("MESSAGES: ",validatedMessages)

    // 9. Get generative model
    let model;
    try {
      model = getGenerativeModel();
    } catch (modelError) {
      console.error("🚀 ~ POST ~ Error getting generative model:", modelError);
      return NextResponse.json(
        { error: 'Failed to initialize AI model' },
        { status: 500 }
      );
    }

    // --- STREAMING IMPLEMENTATION WITH ENHANCED ERROR HANDLING ---
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const streamId = nanoid();

        try {
          // Send transient status notification
          writer.write({
            type: "data-notification",
            data: { message: "Generating insights...", level: "info" },
            transient: true,
          });

          // 6. Generate AI response using generateText
          let result;
          try {
            result = await generateText({
              model: model,
              system: SYSTEM_PROMPT,
              messages: convertToModelMessages(validatedMessages),
              
            });
          } catch (aiError) {
            console.error("🚀 ~ POST ~ Error generating AI text:", aiError);
            writer.write({
              type: "data-notification",
              data: { message: "Error generating response", level: "error" },
              transient: true,
            });
            return;
          }

          console.log("OUTPUT: ",result.content)
          
          // Store AI response in database
          try {
            const assistantMessage: UIMessage = {
              id: nanoid(),
              role: 'assistant',
              parts: [{ type: "text", text: result.text }],
            };
            
            await conversationRepository.addMessage({
              conversationId,
              role: "ASSISTANT",
              content: assistantMessage,
            });

          } catch (dbError) { 
            console.error("🚀 ~ POST ~ Error storing AI response:", dbError);
            // Continue even if DB storage fails
          }

          // 7. Process AI response to extract JSON data
          let parsedJson;
          try {
            parsedJson = markDownToJson(result.text);
            console.log("PARSED JSON: ")
            console.dir(parsedJson, { depth: null });
          } catch (jsonError) {
            console.error("🚀 ~ POST ~ Error parsing JSON from AI response:", jsonError);
            writer.write({
              type: "data-notification",
              data: { message: "Error parsing AI response", level: "error" },
              transient: true,
            });
            parsedJson = { steps: [], columns: [] }; // Fallback
          }
          if(parsedJson?.["text-response"]){
            writer.write({ type: "text-start", id: streamId });
            writer.write({
              type: "data-notification",
              data: { message: "User query is not related to data", level: "info" },
              transient: true,
            });
            writer.write({
              type: "text-delta",
              id: streamId,
              delta: parsedJson?.["text-response"],
            });
            writer.write({
              type: "data-notification",
              data: { message: "Response completed", level: "info" },
              transient: true,
            });
            writer.write({ type: "text-end", id: streamId });
            return;
          }else{
            // Format the data for chart processing
            let formattedData: Record<string, any[]> = {};
            try {
              if (data && data.length > 0) {
                data[0].forEach((column, index) => {
                  formattedData[column] = data?.slice(1)?.map((row) => row?.[index]) || [];
                });
              }
            } catch (formatError) {
              console.error("🚀 ~ POST ~ Error formatting data:", formatError);
              writer.write({
                type: "data-notification",
                data: { message: "Error formatting chart data", level: "error" },
                transient: true,
              });
            }
  
            // Process data to chart format
            let transformedData;
            try {
              transformedData = processDataToChartFormat(
                formattedData,
                parsedJson?.steps ? parsedJson?.steps : parsedJson,
                parsedJson?.columns ? parsedJson?.columns : [],
              );
            } catch (processError) {
              console.error("🚀 ~ POST ~ Error processing chart data:", processError);
              writer.write({
                type: "data-notification",
                data: { message: "Error processing chart data", level: "error" },
                transient: true,
              });
              transformedData = { transformed: [], normalized: { columns: [], rows: [] } }; // Fallback
            }
            const chartSlug = `${slugify(parsedJson?.title ?? "AI generated chart", { lower: true, strict: true })}-${nanoid()}`;
            const chart = await chartRepository.createChart({
              title: parsedJson?.title ?? "AI generated chart",
              config: {
                type: "line",
              },
              slug: chartSlug,
              messageId: allMessages.messages[allMessages.messages.length - 1]?.id,
              userId: con.conversations.userId,
              teamId: con.conversations.teamId,
              visibility: "PRIVATE",
              conversationId,
              fileId: con.files?.id,
              generationSteps: parsedJson?.steps ? parsedJson?.steps : parsedJson,
              dataSpec: transformedData,
              library: "RECHARTS",
            });
  
            // Stream text content progressively
            writer.write({ type: "text-start", id: streamId });
            
            if (parsedJson?.steps && Array.isArray(parsedJson.steps)) {
              for (const step of parsedJson.steps) {
                if (step?.humanReadableFormat) {
                  for (const txt of step.humanReadableFormat.split(" ")) {
                    writer.write({
                      type: "text-delta",
                      id: streamId,
                      delta: `${txt} `,
                    });
                  }
                  writer.write({
                    type: "text-delta",
                    id: streamId,
                    delta: `\n`,
                  });
                }
              }
            } else {
              // Fallback: send the raw AI response if no steps are available
              const words = result.text.split(" ");
              for (const word of words) {
                writer.write({
                  type: "text-delta",
                  id: streamId,
                  delta: `${word} `,
                });
              }
            }
            
            writer.write({ type: "text-end", id: streamId });
  
            // Stream metadata (custom chart data)
            if (transformedData) {
              writer.write({
                type: "data-chart",
                id: "chart-data-1",                
                data: {...transformedData,title: parsedJson?.title,id:chart?.id,config:chart?.config},
              });
            }
  
            // Final notification
            writer.write({
              type: "data-notification",
              data: { message: "Response completed", level: "info" },
              transient: true,
            });
          }

        } catch (streamError) {
          console.error("🚀 ~ POST ~ Error in stream execution:", streamError);
          writer.write({
            type: "data-notification",
            data: { message: "An error occurred during response generation", level: "error" },
            transient: true,
          });
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error: any) {
    console.error("🚀 ~ POST ~ Unhandled error:", error);
    return NextResponse.json(
      { 
        error: error?.message || 'An unexpected error occurred',
        // Only include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
      }, 
      { status: 500 }
    );
  }
}