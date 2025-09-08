import { Network, Wifi, BatteryFull, Thermometer, Droplets } from 'lucide-react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'IoT Connect | Agrisage',
};

const devices = [
    {
        name: 'Soil Sensor - Plot A',
        id: 'SS-PLOT-A-001',
        status: 'Online',
        signal: 92,
        battery: 88,
        data: [
            { label: 'Moisture', value: '74%', icon: Droplets },
            { label: 'Temperature', value: '28°C', icon: Thermometer },
        ]
    },
    {
        name: 'Weather Station',
        id: 'WS-MAIN-001',
        status: 'Online',
        signal: 98,
        battery: 100,
        data: [
            { label: 'Air Temp', value: '32°C', icon: Thermometer },
            { label: 'Humidity', value: '65%', icon: Droplets },
        ]
    },
    {
        name: 'Drone Camera - North Field',
        id: 'DR-NF-001',
        status: 'Offline',
        signal: 0,
        battery: 12,
        data: []
    }
]

export default function IotConnectPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Network className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                IoT Device Management
              </h1>
              <p className="mt-2 text-muted-foreground">
                Monitor and manage your connected farm devices.
              </p>
            </div>
         </div>
         <Button>Add New Device</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {devices.map(device => (
            <Card key={device.id}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle>{device.name}</CardTitle>
                        <Badge variant={device.status === 'Online' ? 'default' : 'destructive'} className={device.status === 'Online' ? 'bg-green-600' : ''}>
                            {device.status}
                        </Badge>
                    </div>
                    <CardDescription>ID: {device.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Wifi size={16} />
                            <span>Signal: {device.signal}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BatteryFull size={16} />
                            <span>Battery: {device.battery}%</span>
                        </div>
                    </div>
                    <Separator/>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Live Data</h4>
                         {device.data.length > 0 ? (
                            device.data.map(d => (
                                <div key={d.label} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1"><d.icon size={14}/> {d.label}</span>
                                    <span className="font-medium text-foreground">{d.value}</span>
                                </div>
                            ))
                         ) : (
                            <p className="text-sm text-muted-foreground">No data available. Device is offline.</p>
                         )}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
