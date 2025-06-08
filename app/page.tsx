"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MetricCard } from '@/components/metric-card';
import { TemperatureChart } from '@/components/temperature-chart';
import { TemperatureScale } from '@/components/temperature-scale';
import { CPUMonitoringTable } from '@/components/cpu-monitoring-table';
import { Footer } from '@/components/footer';
import { 
  Cpu, 
  Thermometer, 
  Monitor, 
  AlertTriangle 
} from 'lucide-react';

export default function HomePage() {
  const [metrics, setMetrics] = useState({
    cpuCount: 7,
    roomTemp: 24.5,
    totalComputers: 1,
    maxCpuTemp: 78.2,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuCount: prev.cpuCount,
        roomTemp: 24.5 + (Math.random() - 0.5) * 2, // Room temp with slight variation
        totalComputers: prev.totalComputers,
        maxCpuTemp: 75 + Math.random() * 10, // CPU temp between 75-85°C
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="p-6">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Monitoring Suhu & CPU</h1>
              <p className="text-muted-foreground mt-2">
                Real-time monitoring dashboard for CPU temperature and room environment
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="CPU yang Dimonitor"
                value={metrics.cpuCount}
                status="PRTG"
                statusColor="blue"
                icon={Cpu}
                iconColor="blue"
              />
              
              <MetricCard
                title="Suhu Ruangan Lab"
                value={`${metrics.roomTemp.toFixed(1)}°C`}
                status="Normal"
                statusColor="orange"
                icon={Thermometer}
                iconColor="orange"
              />
              
              <MetricCard
                title="Total Komputer"
                value={metrics.totalComputers}
                status="Aktif"
                statusColor="green"
                icon={Monitor}
                iconColor="green"
              />
              
              <MetricCard
                title="Suhu Tertinggi CPU"
                value={`${metrics.maxCpuTemp.toFixed(1)}°C`}
                status="CPU-03"
                statusColor="red"
                icon={AlertTriangle}
                iconColor="red"
              />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <TemperatureChart />
              <TemperatureScale />
            </div>

            {/* CPU Monitoring Table */}
            <div className="grid grid-cols-1 gap-6">
              <CPUMonitoringTable />
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}