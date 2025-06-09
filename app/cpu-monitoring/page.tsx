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
import { useAIDA64 } from '@/lib/aida64-context';
import { 
  Cpu, 
  Thermometer, 
  Activity,
  Database,
  Upload,
  FileText,
  RefreshCw
} from 'lucide-react';

export default function CPUMonitoringPage() {
  const {
    cpuData,
    metrics,
    isConnected,
    autoRefresh,
    lastUpdate,
    uploadedCsvContent,
    setAutoRefresh,
    setUploadedCsvContent,
    processAidaData,
  } = useAIDA64();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      setUploadedCsvContent(csvContent);
      processAidaData(csvContent);
      setAutoRefresh(true); // Enable auto-refresh when file is uploaded
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleSampleData = () => {
    setIsProcessing(true);
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
    
    setUploadedCsvContent(sampleData);
    processAidaData(sampleData);
    setAutoRefresh(true); // Enable auto-refresh when sample data is used
    setIsProcessing(false);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
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
                Real-time monitoring of individual CPU performance and temperature via AIDA64 CSV Upload
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {metrics.dataSource}
                </Badge>
                {autoRefresh && (
                  <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Auto-Refresh Active
                  </Badge>
                )}
                {uploadedCsvContent && (
                  <span className="text-sm text-muted-foreground">
                    Last Update: {formatTime(lastUpdate)}
                  </span>
                )}
              </div>
            </div>

            {/* File Upload Section */}
            <Card className="mb-8 border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload AIDA64 CSV File
                </h2>
                
                <div className="flex gap-4 items-center flex-wrap">
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

                  {uploadedCsvContent && (
                    <Button
                      onClick={toggleAutoRefresh}
                      variant={autoRefresh ? "default" : "outline"}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                      {autoRefresh ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
                    </Button>
                  )}
                  
                  {isProcessing && (
                    <span className="text-blue-600 font-medium">Processing...</span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Upload your AIDA64 CSV log file to get real temperature data, or use sample data for testing.
                  {uploadedCsvContent && " Auto-refresh will simulate live monitoring with data variations every 5 seconds."}
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
                value={isConnected ? "CSV Data" : "Mock Data"}
                status={isConnected ? "Uploaded" : "Default"}
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