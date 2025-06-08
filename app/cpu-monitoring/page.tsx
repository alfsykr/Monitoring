"use client";

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MetricCard } from '@/components/metric-card';
import { CPUMonitoringTable } from '@/components/cpu-monitoring-table';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Thermometer, 
  Activity,
  Database,
  Upload,
  FileText
} from 'lucide-react';

// Generate individual CPU data based on AIDA64 configuration
const generateIndividualCPUData = () => {
  const cpus = ['CPU', 'CPU Package', 'CPU IA Cores', 'CPU GT Cores', 'HDD1'];
  
  return cpus.map((cpu, index) => {
    const baseTemp = cpu.includes('HDD') ? 35 : 65;
    const temp = baseTemp + Math.random() * 15 - 7.5;
    const roundedTemp = Math.round(temp * 10) / 10;
    const cores = cpu.includes('Package') ? 8 : cpu.includes('IA') ? 4 : cpu.includes('GT') ? 4 : cpu.includes('HDD') ? 0 : 1;
    const usage = cpu.includes('HDD') ? 0 : Math.floor(Math.random() * 100);
    
    return {
      id: cpu.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: cpu,
      temperature: roundedTemp,
      cores,
      usage,
      status: roundedTemp > 80 ? 'Critical' : roundedTemp > 70 ? 'Warning' : 'Normal'
    };
  });
};

export default function CPUMonitoringPage() {
  const [cpuData, setCpuData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalCPUs: 5, // Fixed value as requested
    avgTemp: 0,
    maxTemp: 0,
    dataSource: 'Mock Data'
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // AIDA64 CSV Parser Function
  const processAidaData = (csvContent: string) => {
    setIsProcessing(true);
    
    try {
      // Parse CSV dengan Papa Parse
      const result = Papa.parse(csvContent, {
        header: false,
        skipEmptyLines: true,
        dynamicTyping: true
      });

      const rows = result.data;
      
      // Cari baris header yang berisi "Date,Time,UpTime,CPU"
      let headerIndex = -1;
      let dataStartIndex = -1;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as any[];
        if (row && row.length > 0 && typeof row[0] === 'string') {
          if (row[0].includes('Date') || row.join(',').includes('Date,Time,UpTime,CPU')) {
            headerIndex = i;
            dataStartIndex = i + 2; // Skip header dan baris unit (°C)
            break;
          }
        }
      }

      if (headerIndex === -1) {
        throw new Error('Header tidak ditemukan dalam file');
      }

      // Get column headers
      const headers = rows[headerIndex] as string[];
      const tempColumns = headers.slice(3); // Skip Date, Time, UpTime

      // Ambil semua data temperatur dari semua kolom
      const allTemperatureData: number[] = [];
      const sensorData: any[] = [];
      
      for (let i = dataStartIndex; i < rows.length; i++) {
        const row = rows[i] as any[];
        if (row && row.length >= 4) {
          // Process each temperature column
          tempColumns.forEach((sensorName, colIndex) => {
            const tempValue = row[3 + colIndex];
            if (typeof tempValue === 'number' && tempValue > 0) {
              allTemperatureData.push(tempValue);
              
              // Find or create sensor data
              let sensor = sensorData.find(s => s.name === sensorName);
              if (!sensor) {
                sensor = {
                  id: sensorName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                  name: sensorName,
                  temperatures: [],
                  cores: sensorName.includes('Package') ? 8 : sensorName.includes('IA') ? 4 : sensorName.includes('GT') ? 4 : sensorName.includes('HDD') ? 0 : 1,
                  usage: sensorName.includes('HDD') ? 0 : Math.floor(Math.random() * 100)
                };
                sensorData.push(sensor);
              }
              sensor.temperatures.push(tempValue);
            }
          });
        }
      }

      if (allTemperatureData.length === 0) {
        throw new Error('Tidak ada data temperatur yang valid ditemukan');
      }

      // Calculate per-sensor averages and status
      const processedCpuData = sensorData.map(sensor => {
        const avgTemp = sensor.temperatures.reduce((sum: number, temp: number) => sum + temp, 0) / sensor.temperatures.length;
        const maxTemp = Math.max(...sensor.temperatures);
        const roundedAvgTemp = Math.round(avgTemp * 10) / 10;
        
        return {
          ...sensor,
          temperature: roundedAvgTemp,
          maxTemp: Math.round(maxTemp * 10) / 10,
          status: roundedAvgTemp > 80 ? 'Critical' : roundedAvgTemp > 70 ? 'Warning' : 'Normal'
        };
      });

      // Calculate overall statistics
      const totalTemp = allTemperatureData.reduce((sum, temp) => sum + temp, 0);
      const avgTemp = Math.round((totalTemp / allTemperatureData.length) * 10) / 10;
      const maxTemp = Math.max(...allTemperatureData);

      // Update state
      setCpuData(processedCpuData);
      setMetrics({
        totalCPUs: 5, // Fixed value as requested
        avgTemp,
        maxTemp,
        dataSource: 'AIDA64 CSV'
      });
      setIsConnected(true);

    } catch (error) {
      console.error('Error processing data:', error);
      alert(`Error: ${(error as Error).message}`);
      // Fallback to mock data
      const mockData = generateIndividualCPUData();
      setCpuData(mockData);
      
      const tempValues = mockData.map(cpu => cpu.temperature);
      const avgTemp = tempValues.reduce((sum, t) => sum + t, 0) / tempValues.length;
      const maxTemp = Math.max(...tempValues);
      
      setMetrics({
        totalCPUs: 5,
        avgTemp: Math.round(avgTemp * 10) / 10,
        maxTemp: Math.round(maxTemp * 10) / 10,
        dataSource: 'Mock Data'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      processAidaData(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleSampleData = () => {
    const sampleData = `Version,AIDA64 v7.65.7400
CPU Type,2C+8c Intel Core i5-1335U, 4300 MHz (43 x 100)
Motherboard Name,Acer Aspire A514-56P
Video Adapter,Intel Raptor Lake-U 80/96EU - Integrated Graphics Controller
Log Started,6/5/2025 4:35:19 PM
Date,Time,UpTime,CPU,CPU Package,CPU IA Cores,CPU GT Cores,HDD1
,,,°C,°C,°C,°C,°C
* Processes stopped: dllhost.exe
6/5/2025,4:36:36 PM,05:04:42,48,46,46,46,36
6/5/2025,4:36:37 PM,05:04:43,54,47,47,47,36
6/5/2025,4:36:39 PM,05:04:44,55,48,48,47,36
6/5/2025,4:36:40 PM,05:04:46,48,47,46,47,36
6/5/2025,4:36:41 PM,05:04:47,52,49,49,48,36
6/5/2025,4:36:42 PM,05:04:48,58,52,52,49,37
6/5/2025,4:36:43 PM,05:04:49,61,54,54,51,37`;
    
    processAidaData(sampleData);
  };

  useEffect(() => {
    // Initialize with mock data
    const initialData = generateIndividualCPUData();
    setCpuData(initialData);
    
    const tempValues = initialData.map(cpu => cpu.temperature);
    const avgTemp = tempValues.reduce((sum, t) => sum + t, 0) / tempValues.length;
    const maxTemp = Math.max(...tempValues);
    
    setMetrics({
      totalCPUs: 5,
      avgTemp: Math.round(avgTemp * 10) / 10,
      maxTemp: Math.round(maxTemp * 10) / 10,
      dataSource: 'Mock Data'
    });

    // Try to fetch real data from API (your existing logic)
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch('/api/temperature');
        const data = await response.json();
        
        if (data.success && data.data.temperatures) {
          const realCpuData = data.data.temperatures.map((temp: any, index: number) => ({
            id: temp.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: temp.name,
            temperature: temp.value,
            cores: temp.name.includes('Package') ? 8 : temp.name.includes('IA') ? 4 : temp.name.includes('GT') ? 4 : temp.name.includes('HDD') ? 0 : 1,
            usage: temp.name.includes('HDD') ? 0 : Math.floor(Math.random() * 100),
            status: temp.value > 80 ? 'Critical' : temp.value > 70 ? 'Warning' : 'Normal'
          }));
          
          setCpuData(realCpuData);
          setIsConnected(data.connected);
          
          // Calculate metrics from real data
          const tempValues = data.data.temperatures.map((t: any) => t.value);
          const avgTemp = tempValues.reduce((sum: number, t: number) => sum + t, 0) / tempValues.length;
          const maxTemp = Math.max(...tempValues);
          
          setMetrics({
            totalCPUs: 5, // Fixed value as requested
            avgTemp: Math.round(avgTemp * 10) / 10,
            maxTemp: Math.round(maxTemp * 10) / 10,
            dataSource: data.dataSource
          });
        }
      } catch (error) {
        console.error('Failed to fetch temperature data:', error);
      }
    };

    fetchTemperatureData();
    const interval = setInterval(fetchTemperatureData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">CPU Monitoring</h1>
              <p className="text-muted-foreground mt-2">
                Real-time monitoring of individual CPU performance and temperature via AIDA64 CSV Logging
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {metrics.dataSource}
                </Badge>
              </div>
            </div>

            {/* File Upload Section */}
            <Card className="mb-8 border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload AIDA64 CSV File
                </h2>
                
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                    <FileText className="w-4 h-4" />
                    Choose CSV File
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <Button
                    onClick={handleSampleData}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    Use Sample Data
                  </Button>
                  
                  {isProcessing && (
                    <span className="text-blue-600 font-medium">Processing...</span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Upload your AIDA64 CSV log file to get real temperature data, or use sample data for testing.
                </p>
              </CardContent>
            </Card>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total CPU Sensors"
                value={metrics.totalCPUs}
                status="AIDA64"
                statusColor="blue"
                icon={Cpu}
                iconColor="blue"
              />
              
              <MetricCard
                title="Average Temperature"
                value={`${metrics.avgTemp}°C`}
                status={metrics.avgTemp > 70 ? "Warning" : "Normal"}
                statusColor={metrics.avgTemp > 80 ? "red" : metrics.avgTemp > 70 ? "orange" : "green"}
                icon={Thermometer}
                iconColor={metrics.avgTemp > 80 ? "red" : metrics.avgTemp > 70 ? "orange" : "green"}
              />
              
              <MetricCard
                title="Max Temperature"
                value={`${metrics.maxTemp}°C`}
                status={metrics.maxTemp > 80 ? "Critical" : metrics.maxTemp > 70 ? "Warning" : "Normal"}
                statusColor={metrics.maxTemp > 80 ? "red" : metrics.maxTemp > 70 ? "orange" : "green"}
                icon={Activity}
                iconColor={metrics.maxTemp > 80 ? "red" : metrics.maxTemp > 70 ? "orange" : "green"}
              />
              
              <MetricCard
                title="Data Source"
                value={isConnected ? "Live" : "Static"}
                status={isConnected ? "Connected" : "Offline"}
                statusColor={isConnected ? "green" : "red"}
                icon={Database}
                iconColor={isConnected ? "green" : "red"}
              />
            </div>

            {/* Individual CPU Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {cpuData.map((cpu) => (
                <Card key={cpu.id} className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center justify-between">
                      {cpu.name}
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(cpu.status)}`}
                      >
                        {cpu.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Temperature</span>
                        <span className="font-mono font-medium">{cpu.temperature}°C</span>
                      </div>
                      {cpu.cores > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cores</span>
                          <span className="font-medium">{cpu.cores}</span>
                        </div>
                      )}
                      {cpu.usage > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Usage</span>
                          <span className="font-medium">{cpu.usage}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed CPU Table */}
            <CPUMonitoringTable cpuData={cpuData} />

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}