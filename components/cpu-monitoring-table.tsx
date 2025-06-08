"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface CPUDevice {
  id: string;
  deviceName: string;
  currentTemp: number;
  status: string;
  maxTemp: number;
}

const generateCPUData = (): CPUDevice[] => {
  const devices = [
    'CPU',
    'CPU Package',
    'CPU IA Cores', 
    'CPU GT Cores',
    'HDD1',
  ];

  return devices.map((device, index) => {
    const baseTemp = device.includes('HDD') ? 35 : 65;
    const temp = baseTemp + Math.random() * 15 - 7.5;
    const roundedTemp = Math.round(temp * 10) / 10;
    const maxTemp = roundedTemp + Math.random() * 5; // Max temp is slightly higher than current
    
    let status = 'Normal';
    if (roundedTemp > 75) status = 'Warning';
    if (roundedTemp > 85) status = 'Critical';
    if (roundedTemp < 50) status = 'Cool';

    return {
      id: `${device.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}`,
      deviceName: device,
      currentTemp: roundedTemp,
      maxTemp: Math.round(maxTemp * 10) / 10,
      status,
    };
  });
};

interface CPUMonitoringTableProps {
  cpuData?: any[];
}

export function CPUMonitoringTable({ cpuData: externalCpuData }: CPUMonitoringTableProps) {
  const [cpuData, setCPUData] = useState<CPUDevice[]>([]);

  useEffect(() => {
    // If external data is provided, use it
    if (externalCpuData && externalCpuData.length > 0) {
      const formattedData = externalCpuData.map((cpu, index) => ({
        id: `${cpu.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}`,
        deviceName: cpu.name,
        currentTemp: cpu.temperature,
        maxTemp: cpu.maxTemp || (cpu.temperature + Math.random() * 5),
        status: cpu.status,
      }));
      setCPUData(formattedData);
      return;
    }

    // Use mock data if no external data provided
    setCPUData(generateCPUData());
    
    const interval = setInterval(() => {
      setCPUData(generateCPUData());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [externalCpuData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cool':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
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
    <Card className="col-span-1 lg:col-span-3 border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">CPU Temperature Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Device Name</TableHead>
              <TableHead>Current Temp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Max Temp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cpuData.map((device, index) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{device.deviceName}</TableCell>
                <TableCell className="font-mono">
                  {device.currentTemp}°C
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(device.status)}`}
                  >
                    {device.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">
                  {device.maxTemp}°C
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}