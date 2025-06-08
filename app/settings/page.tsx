"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Database, 
  Bell,
  Palette,
  Shield,
  Wifi,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // AIDA64 Settings
    aida64Path: 'C:\\Program Files (x86)\\AIDA64 Business\\aida64.exe',
    refreshInterval: '3',
    enableSharedMemory: true,
    
    // Monitoring Settings
    temperatureUnit: 'celsius',
    alertThreshold: '80',
    enableAlerts: true,
    
    // Display Settings
    theme: 'dark',
    autoRefresh: true,
    showAnimations: true,
    
    // Network Settings
    apiEndpoint: 'http://localhost:3000/api',
    enableRemoteAccess: false,
    
    // Notification Settings
    emailNotifications: true,
    soundAlerts: false,
    desktopNotifications: true,
  });

  const handleSave = () => {
    // Here you would save settings to localStorage or send to API
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      aida64Path: 'C:\\Program Files (x86)\\AIDA64 Business\\aida64.exe',
      refreshInterval: '3',
      enableSharedMemory: true,
      temperatureUnit: 'celsius',
      alertThreshold: '80',
      enableAlerts: true,
      theme: 'dark',
      autoRefresh: true,
      showAnimations: true,
      apiEndpoint: 'http://localhost:3000/api',
      enableRemoteAccess: false,
      emailNotifications: true,
      soundAlerts: false,
      desktopNotifications: true,
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
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Configure monitoring parameters and system preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AIDA64 Configuration */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    AIDA64 Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aida64-path">AIDA64 Installation Path</Label>
                    <Input
                      id="aida64-path"
                      value={settings.aida64Path}
                      onChange={(e) => setSettings({...settings, aida64Path: e.target.value})}
                      placeholder="C:\Program Files (x86)\AIDA64 Business\aida64.exe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                    <Select value={settings.refreshInterval} onValueChange={(value) => setSettings({...settings, refreshInterval: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 second</SelectItem>
                        <SelectItem value="3">3 seconds</SelectItem>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Shared Memory</Label>
                      <p className="text-sm text-muted-foreground">
                        Use AIDA64 shared memory for real-time data
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSharedMemory}
                      onCheckedChange={(checked) => setSettings({...settings, enableSharedMemory: checked})}
                    />
                  </div>

                  <div className="pt-2">
                    <Badge variant={settings.enableSharedMemory ? "default" : "secondary"}>
                      {settings.enableSharedMemory ? "Connected" : "Mock Mode"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Monitoring Settings */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    Monitoring Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Temperature Unit</Label>
                    <Select value={settings.temperatureUnit} onValueChange={(value) => setSettings({...settings, temperatureUnit: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="celsius">Celsius (°C)</SelectItem>
                        <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alert-threshold">Alert Threshold (°C)</Label>
                    <Input
                      id="alert-threshold"
                      type="number"
                      value={settings.alertThreshold}
                      onChange={(e) => setSettings({...settings, alertThreshold: e.target.value})}
                      placeholder="80"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Temperature Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when temperature exceeds threshold
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableAlerts}
                      onCheckedChange={(checked) => setSettings({...settings, enableAlerts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Refresh</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically update data in real-time
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoRefresh}
                      onCheckedChange={(checked) => setSettings({...settings, autoRefresh: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Display Settings */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch
                      checked={settings.showAnimations}
                      onCheckedChange={(checked) => setSettings({...settings, showAnimations: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound when alerts trigger
                      </p>
                    </div>
                    <Switch
                      checked={settings.soundAlerts}
                      onCheckedChange={(checked) => setSettings({...settings, soundAlerts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Desktop Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show browser notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.desktopNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, desktopNotifications: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Network Settings */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    Network & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-endpoint">API Endpoint</Label>
                      <Input
                        id="api-endpoint"
                        value={settings.apiEndpoint}
                        onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                        placeholder="http://localhost:3000/api"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Remote Access</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow external connections to this dashboard
                        </p>
                      </div>
                      <Switch
                        checked={settings.enableRemoteAccess}
                        onCheckedChange={(checked) => setSettings({...settings, enableRemoteAccess: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" onClick={handleReset}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}