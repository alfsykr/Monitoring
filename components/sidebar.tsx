"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Cpu, 
  Thermometer, 
  // Settings, // Commented out - Settings page disabled for now
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: 'CPU Monitoring',
    href: '/cpu-monitoring',
    icon: Cpu,
    current: false,
  },
  {
    name: 'Lab Monitoring',
    href: '/lab-monitoring',
    icon: Thermometer,
    current: false,
  },
];

// Settings page temporarily disabled - keeping for future use
const settings = [
  // {
  //   name: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  //   current: false,
  // },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col h-screen bg-slate-900 transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Temperature and Humidity</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Monitoring
              </p>
            </div>
          )}
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 w-5 h-5",
                    collapsed ? "mx-auto" : "mr-3"
                  )}
                />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </div>

        {/* Settings section - commented out for now */}
        {settings.length > 0 && (
          <div className="mt-8 space-y-1">
            {!collapsed && (
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Settings
                </p>
              </div>
            )}
            {settings.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 w-5 h-5",
                      collapsed ? "mx-auto" : "mr-3"
                    )}
                  />
                  {!collapsed && item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}