import { NextRequest, NextResponse } from 'next/server';
import chartRepository from '@/server/models/charts/charts.query';
import { authorizeUser } from '@/lib/auth';
import { ChartType } from '@/types/chart';

// Define the expected request body type
interface UpdateChartRequestBody {
  chartId: string;
  width?: number;
  height?: number;
  type?: ChartType;
}

export async function PUT(request: NextRequest) {
  try {
    // Authorize the user
    authorizeUser();

    // Parse the request body
    let requestBody: UpdateChartRequestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { chartId, width, height, type } = requestBody;

    // Validate required fields
    if (!chartId || typeof chartId !== 'string') {
      return NextResponse.json(
        { error: 'Chart ID is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate width and height if provided
    if (width !== undefined && (typeof width !== 'number' || width <= 0)) {
      return NextResponse.json(
        { error: 'Width must be a positive number if provided' },
        { status: 400 }
      );
    }

    if (height !== undefined && (typeof height !== 'number' || height <= 0)) {
      return NextResponse.json(
        { error: 'Height must be a positive number if provided' },
        { status: 400 }
      );
    }

    // Validate chart type if provided
    if (type !== undefined) {
      const validChartTypes: ChartType[] = ["bar", "line", "pie", "scatter", "heatmap", "funnel", "candlestick", "combo"];
      if (!validChartTypes.includes(type)) {
        return NextResponse.json(
          { error: `Invalid chart type. Valid types are: ${validChartTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Get the existing chart to check if it exists and get current config
    const existingChart = await chartRepository.getChartById(chartId);
    
    if (!existingChart) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    // Prepare the config update
    const currentConfig = existingChart.charts.config || {};
    const updatedConfig = {
      ...currentConfig,
      width,
      height,
      type
    };

    // Remove undefined values (fixed for type safety)
    for (const key of Object.keys(updatedConfig) as Array<keyof typeof updatedConfig>) {
      if (updatedConfig[key] === undefined) {
        delete updatedConfig[key];
      }
    }

    // Update the chart in the database
    const updatedChart = await chartRepository.updateChart(chartId, {
      config: {...currentConfig , ...updatedConfig}
    });

    if (!updatedChart) {
      return NextResponse.json(
        { error: 'Failed to update chart' },
        { status: 500 }
      );
    }

    // Return the updated chart
    return NextResponse.json(
      { 
        success: true, 
        message: 'Chart updated successfully',
        chart: {
          id: updatedChart.id,
          config: updatedChart.config
        }
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating chart:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'An unexpected error occurred while updating chart',
        ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
      }, 
      { status: 500 }
    );
  }
}