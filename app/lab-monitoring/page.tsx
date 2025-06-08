"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MetricCard } from '@/components/metric-card';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  Thermometer, 
  Droplets, 
  Wind,
  Gauge
} from 'lucide-react';

// Generate SHT20 sensor data for lab monitoring
const generateSHT20Data = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours().toString().padStart(2, '0') + ':00';
    
    // Generate realistic lab environment data from SHT20
    const temperature = 24 + Math.sin((i / 24) * 2 * Math.PI) * 3 + Math.random() * 2 - 1;
    const humidity = 45 + Math.sin((i / 24) * 2 * Math.PI) * 10 + Math.random() * 5 - 2.5;
    
    data.push({
      time: hour,
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
    });
  }
  
  return data;
};

// Generate 10-minute interval monitoring data
const generateMonitoringTable = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60 * 1000);
    const timeStr = time.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    const temperature = 23 + Math.random() * 4; // 23-27°C
    const humidity = 45 + Math.random() * 15; // 45-60%
    const roundedTemp = Math.round(temperature * 10) / 10;
    const roundedHum = Math.round(humidity * 10) / 10;
    
    // AC Action logic: if temperature > 25°C, turn on AC
    const acAction = roundedTemp > 25 ? 'AC ON - Cooling' : 'AC OFF - Standby';
    const status = roundedTemp > 26 ? 'Warning' : roundedTemp > 25 ? 'Caution' : 'Normal';
    
    data.push({
      id: i,
      time: timeStr,
      temperature: roundedTemp,
      humidity: roundedHum,
      acAction,
      status
    });
  }
  
  return data.reverse();
};

export default function LabMonitoringPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [monitoringData, setMonitoringData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    currentTemp: 24.5,
    currentHumidity: 48.2,
    airflow: 18.5,
    acStatus: 'Active'
  });

  useEffect(() => {
    // Set initial data after component mounts
    setChartData(generateSHT20Data());
    setMonitoringData(generateMonitoringTable());
    
    const interval = setInterval(() => {
      const newChartData = generateSHT20Data();
      const newMonitoringData = generateMonitoringTable();
      
      setChartData(newChartData);
      setMonitoringData(newMonitoringData);
      
      // Update metrics from latest data
      const latestData = newChartData[newChartData.length - 1];
      setMetrics({
        currentTemp: latestData.temperature,
        currentHumidity: latestData.humidity,
        airflow: 15 + Math.random() * 10, // 15-25 m/s
        acStatus: latestData.temperature > 25 ? 'Cooling' : 'Standby'
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Caution':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Warning':
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
              <h1 className="text-3xl font-bold tracking-tight">Lab Monitoring</h1>
              <p className="text-muted-foreground mt-2">
                Real-time monitoring of laboratory environment using SHT20 sensor via Modbus
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Current Temperature"
                value={`${metrics.currentTemp}°C`}
                status="SHT20"
                statusColor="orange"
                icon={Thermometer}
                iconColor="orange"
              />
              
              <MetricCard
                title="Current Humidity"
                value={`${metrics.currentHumidity}%`}
                status="SHT20"
                statusColor="blue"
                icon={Droplets}
                iconColor="blue"
              />
              
              <MetricCard
                title="Airflow Rate"
                value={`${metrics.airflow.toFixed(1)} m/s`}
                status="Good"
                statusColor="green"
                icon={Wind}
                iconColor="green"
              />
              
              <MetricCard
                title="AC System"
                value={metrics.acStatus}
                status="Auto"
                statusColor="green"
                icon={Gauge}
                iconColor="green"
              />
            </div>

            {/* Environment Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">24-Hour Temperature Trend (SHT20)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          className="text-xs fill-muted-foreground"
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          className="text-xs fill-muted-foreground"
                          domain={['dataMin - 2', 'dataMax + 2']}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="temperature"
                          stroke="#F97316"
                          fillOpacity={1}
                          fill="url(#tempGradient)"
                          strokeWidth={2}
                          name="Temperature (°C)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">24-Hour Humidity Trend (SHT20)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          className="text-xs fill-muted-foreground"
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          className="text-xs fill-muted-foreground"
                          domain={['dataMin - 5', 'dataMax + 5']}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="humidity"
                          stroke="#3B82F6"
                          fillOpacity={1}
                          fill="url(#humGradient)"
                          strokeWidth={2}
                          name="Humidity (%)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 10-Minute Monitoring Table */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Lab Environment Monitoring (10-Minute Intervals)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead>Temperature (°C)</TableHead>
                      <TableHead>Humidity (%)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AC Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monitoringData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.time}</TableCell>
                        <TableCell className="font-mono">
                          {record.temperature}°C
                        </TableCell>
                        <TableCell className="font-mono">
                          {record.humidity}%
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getStatusColor(record.status)}`}
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.acAction}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}