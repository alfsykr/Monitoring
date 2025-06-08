import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const temperatureRanges = [
  { range: '0°C - 20°C', status: 'Very Cold', color: 'bg-blue-500' },
  { range: '21°C - 35°C', status: 'Cold', color: 'bg-blue-400' },
  { range: '36°C - 50°C', status: 'Cool', color: 'bg-cyan-500' },
  { range: '51°C - 60°C', status: 'Normal', color: 'bg-green-500' },
  { range: '61°C - 70°C', status: 'Warning', color: 'bg-yellow-500' },
  { range: '>70°C', status: 'Critical', color: 'bg-red-500' },
];

export function TemperatureScale() {
  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Temperature Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm font-medium">
            <div>Range</div>
            <div>Status</div>
          </div>
          <div className="space-y-3">
            {temperatureRanges.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-center">
                <div className="text-sm text-muted-foreground">{item.range}</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}