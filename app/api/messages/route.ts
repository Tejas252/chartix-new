import { authorizeUser } from "@/lib/auth";
import { markDownToJson } from "@/lib/utils/json-parser";
import conversationRepository from "@/server/models/conversations/conversations.query";
import { UIMessage, UIMessagePart } from "ai";
import { NextRequest, NextResponse } from "next/server";

function parseAImessagesToUI(message: UIMessage) {
    const { parts } = message
    const textData = parts?.find((p) => p?.type === 'text')?.text as string
    console.log("🚀 ~ parseAImessagesToUI ~ textData:", textData)
    const parsedJson = markDownToJson(textData)
    return [{
        type: "text",
        text: parsedJson?.['text-response'] ? parsedJson?.['text-response'] : parsedJson.steps?.map((s: any) => s.humanReadableFormat)?.join("\n")
    }]
}


export const GET = async (req: NextRequest) => {
    try {
        const user = await authorizeUser()

        const conversationId = req.nextUrl.searchParams.get('conId')

        if (!conversationId) {
            throw new Error("conId is required")
        }

        const conversation = await conversationRepository.getConversationsByUser(conversationId, user.id)

        if (!conversation) {
            throw new Error("Conversation not found")
        }

        const messages = await conversationRepository.getMessages(conversationId)

        const finalMessages = messages?.messages?.map(({ id, role, content }) => {
            return {
                id,
                parts: role === "USER" ? (content as any)?.userParts : parseAImessagesToUI(content as UIMessage),
                role
            }
        })

        return NextResponse.json({ messages: finalMessages, total: messages?.total }, { status: 200 })


    } catch (error: any) {
        console.log("🚀 ~ GET ~ error:", error)
        return NextResponse.json({ success: false, message: error?.message }, { status: 500 })
    }
}