"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MetricCard } from '@/components/metric-card';
import { CPUMonitoringTable } from '@/components/cpu-monitoring-table';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Thermometer, 
  Activity,
  Database
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

  useEffect(() => {
    // Set initial data after component mounts
    const initialData = generateIndividualCPUData();
    setCpuData(initialData);
    
    // Try to fetch real AIDA64 data
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
        } else {
          // Use mock data but calculate proper metrics
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
        }
      } catch (error) {
        console.error('Failed to fetch temperature data:', error);
        // Keep using mock data with proper calculations
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
      }
    };

    fetchTemperatureData();
    
    const interval = setInterval(() => {
      fetchTemperatureData();
    }, 5000); // Update every 5 seconds

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
                status="Normal"
                statusColor="orange"
                icon={Thermometer}
                iconColor="orange"
              />
              
              <MetricCard
                title="Max Temperature"
                value={`${metrics.maxTemp}°C`}
                status="Current"
                statusColor="red"
                icon={Activity}
                iconColor="red"
              />
              
              <MetricCard
                title="Data Source"
                value={isConnected ? "Live" : "Mock"}
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
            <CPUMonitoringTable />

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}