import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  status: string;
  statusColor: 'blue' | 'orange' | 'green' | 'red';
  icon: LucideIcon;
  iconColor: 'blue' | 'orange' | 'green' | 'red';
}

const statusColorMap = {
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  green: 'bg-green-500/10 text-green-500 border-green-500/20',
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const iconColorMap = {
  blue: 'text-blue-500',
  orange: 'text-orange-500',
  green: 'text-green-500',
  red: 'text-red-500',
};

export function MetricCard({
  title,
  value,
  status,
  statusColor,
  icon: Icon,
  iconColor,
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            iconColor === 'blue' && 'bg-blue-500/10',
            iconColor === 'orange' && 'bg-orange-500/10',
            iconColor === 'green' && 'bg-green-500/10',
            iconColor === 'red' && 'bg-red-500/10'
          )}>
            <Icon className={cn("w-5 h-5", iconColorMap[iconColor])} />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <Badge variant="secondary" className={cn("text-xs", statusColorMap[statusColor])}>
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}