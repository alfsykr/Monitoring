import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to get data from AIDA64 CSV first
    const aida64Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/aida64`);
    const aida64Data = await aida64Response.json();

    let temperatures = [];
    let dataSource = 'Mock Data';

    if (aida64Data.success && aida64Data.temperatures) {
      temperatures = aida64Data.temperatures;
      dataSource = 'AIDA64 CSV Log';
    } else {
      // Fallback to mock data
      temperatures = aida64Data.mockData?.temperatures || getMockTemperatures();
      dataSource = 'Mock Data';
    }

    // Calculate summary statistics
    const tempValues = temperatures.map(t => t.value);
    const summary = {
      maxTemp: Math.max(...tempValues),
      minTemp: Math.min(...tempValues),
      avgTemp: tempValues.reduce((sum, t) => sum + t, 0) / tempValues.length,
      criticalCount: temperatures.filter(t => t.value > 80).length,
      warningCount: temperatures.filter(t => t.value > 70 && t.value <= 80).length,
    };

    const response = {
      success: true,
      connected: aida64Data.success,
      timestamp: new Date().toISOString(),
      dataSource,
      data: {
        temperatures,
        summary
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Temperature API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch temperature data',
        message: error instanceof Error ? error.message : 'Unknown error',
        dataSource: 'Mock Data',
        data: {
          temperatures: getMockTemperatures(),
          summary: {
            maxTemp: 75,
            minTemp: 45,
            avgTemp: 65,
            criticalCount: 0,
            warningCount: 2
          }
        }
      },
      { status: 500 }
    );
  }
}

function getMockTemperatures() {
  const baseTemp = 65;
  const variation = Math.random() * 20 - 10;
  
  return [
    {
      name: 'CPU',
      value: Math.round((baseTemp + variation) * 10) / 10,
      unit: '°C'
    },
    {
      name: 'CPU Package',
      value: Math.round((baseTemp + variation + Math.random() * 5 - 2.5) * 10) / 10,
      unit: '°C'
    },
    {
      name: 'CPU IA Cores',
      value: Math.round((baseTemp + variation + Math.random() * 5 - 2.5) * 10) / 10,
      unit: '°C'
    },
    {
      name: 'CPU GT Cores',
      value: Math.round((baseTemp + variation + Math.random() * 5 - 2.5) * 10) / 10,
      unit: '°C'
    },
    {
      name: 'HDD1',
      value: Math.round((35 + Math.random() * 10) * 10) / 10,
      unit: '°C'
    }
  ];
}

// Handle POST requests for configuration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle configuration changes
    if (body.action === 'toggle_mode') {
      // This would toggle between real and mock mode
      return NextResponse.json({
        success: true,
        message: 'Mode toggled successfully'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}