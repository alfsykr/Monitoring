"use client";

import { Bell, Sun, Moon, Thermometer } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Empty space for layout balance */}
      <div className="flex-1"></div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Bell className="w-4 h-4" />
        </Button>

        <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Thermometer className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}