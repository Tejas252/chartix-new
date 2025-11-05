import { NextRequest, NextResponse } from 'next/server';
import chartRepository from '@/server/models/charts/charts.query';
import { authorizeUser } from '@/lib/auth';
import { UniversalChartFormat } from '@/types/chart';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    // Authorize the user
    authorizeUser();

    const { conversationId } = await params;

    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json(
        { error: 'Valid conversation ID is required' },
        { status: 400 }
      );
    }

    // Get charts for the conversation, sorted by latest (createdAt DESC)
    // We only need the first (latest) chart
    const { charts } = await chartRepository.getChartsByConversation(conversationId, 1, 0);

    if (!charts || charts.length === 0) {
      return NextResponse.json(
        { message: 'No charts found for this conversation' },
        { status: 404 }
      );
    }

    // Return the first (latest) chart
    const latestChart = charts[0];
    
    // Extract the normalized data from the chart's dataSpec
    const normalizedData = latestChart?.dataSpec?.normalized;
    
    // Format the response according to the required UniversalChartFormat
    // Ensure fallback to empty arrays if data is missing
    const chartData: UniversalChartFormat = {
      columns: normalizedData?.columns || [],
      rows: normalizedData?.rows || []
    };

    return NextResponse.json({ 
      id: latestChart?.id,
      data: chartData,
      title: latestChart?.title,
      config: latestChart?.config
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching chart from conversation:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'An unexpected error occurred while fetching chart',
        ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
      }, 
      { status: 500 }
    );
  }
}