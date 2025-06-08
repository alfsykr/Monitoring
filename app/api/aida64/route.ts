import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Lokasi file log AIDA64 di lokal (harus disesuaikan jika dipakai di server)
    const logPath = path.join('D:/1.data skripsi/Jurnal Revisi/Temp', 'aida64_log_log.csv');

    // Check if file exists
    if (!fs.existsSync(logPath)) {
      console.error('AIDA64 log file not found at:', logPath);
      return NextResponse.json(
        { 
          success: false, 
          error: 'File log AIDA64 tidak ditemukan',
          message: `File tidak ditemukan di: ${logPath}`,
          usingMockData: true,
          mockData: getMockAIDA64Data()
        },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(logPath, 'utf8');

    // Pisahkan per baris dan kolom
    const lines = fileContent.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error('File log tidak memiliki data yang cukup');
    }

    const headers = lines[0].split(',');
    const lastLine = lines[lines.length - 1];
    const values = lastLine.split(',');

    // Bangun objek suhu berdasarkan kolom
    const temperatureData = headers.reduce((acc, key, idx) => {
      acc[key.trim()] = values[idx]?.trim();
      return acc;
    }, {} as Record<string, string>);

    // Parse temperature values and create structured data
    const temperatures = [];
    for (const [key, value] of Object.entries(temperatureData)) {
      if (key.toLowerCase().includes('temp') || key.toLowerCase().includes('cpu') || key.toLowerCase().includes('hdd')) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          temperatures.push({
            name: key,
            value: numValue,
            unit: '°C'
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: temperatureData['Time'] || new Date().toISOString(),
      temperatures,
      rawData: temperatureData,
      source: 'AIDA64 CSV Log'
    });
  } catch (error) {
    console.error('Failed to read AIDA64 log file:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Gagal membaca file log AIDA64',
      message: error instanceof Error ? error.message : 'Unknown error',
      usingMockData: true,
      mockData: getMockAIDA64Data()
    }, { status: 500 });
  }
}

// Fallback mock data when AIDA64 file is not accessible
function getMockAIDA64Data() {
  const baseTemp = 65;
  const variation = Math.random() * 20 - 10;
  
  return {
    temperatures: [
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
    ],
    timestamp: new Date().toISOString(),
    source: 'Mock Data'
  };
}