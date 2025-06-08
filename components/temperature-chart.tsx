"use client";

import { useState, useEffect } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Mock data generator for 24-hour temperature
const generateTemperatureData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours().toString().padStart(2, '0') + ':00';
    
    // Generate realistic CPU temperature data (45-85°C)
    const baseTemp = 65;
    const variation = Math.sin((i / 24) * 2 * Math.PI) * 10 + Math.random() * 8 - 4;
    const cpuTemp = Math.max(45, Math.min(85, baseTemp + variation));
    
    // Generate room temperature data (20-30°C)
    const roomTemp = 24 + Math.sin((i / 24) * 2 * Math.PI) * 3 + Math.random() * 2 - 1;
    
    data.push({
      time: hour,
      cpu: Math.round(cpuTemp * 10) / 10,
      room: Math.round(roomTemp * 10) / 10,
    });
  }
  
  return data;
};

export function TemperatureChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Set initial data after component mounts
    setData(generateTemperatureData());
    
    const interval = setInterval(() => {
      setData(generateTemperatureData());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-2 border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">24-Hour Temperature Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="roomGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="cpu"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#cpuGradient)"
                strokeWidth={2}
                name="CPU Temperature (°C)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}