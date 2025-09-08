'use client';

import { useState, useEffect } from 'react';
import { Network, Wifi, BatteryFull, Thermometer, Droplets, Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getIotDevices, type IotDevice } from '@/services/iot-service';

// Metadata can't be dynamic in a client component this way,
// but we'll keep it for static export purposes.
// export const metadata: Metadata = {
//   title: 'IoT Connect | Agrisage',
// };

export default function IotConnectPage() {
  const [devices, setDevices] = useState<IotDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const deviceData = await getIotDevices();
      setDevices(deviceData);
      setIsLoading(false);
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);


  const getIcon = (label: string) => {
    switch (label) {
      case 'Moisture':
      case 'Humidity':
        return Droplets;
      case 'Temperature':
      case 'Air Temp':
        return Thermometer;
      default:
        return Wifi;
    }
  }


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
      
      {isLoading ? (
         <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-4 text-muted-foreground">Connecting to devices...</span>
         </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {devices.map(device => {
            const Icon = getIcon(device.data[0]?.label);
            return (
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
                              device.data.map(d => {
                                const DataIcon = getIcon(d.label);
                                return (
                                  <div key={d.label} className="flex justify-between text-sm">
                                      <span className="text-muted-foreground flex items-center gap-1"><DataIcon size={14}/> {d.label}</span>
                                      <span className="font-medium text-foreground">{d.value}</span>
                                  </div>
                                )
                              })
                           ) : (
                              <p className="text-sm text-muted-foreground">No data available. Device is offline.</p>
                           )}
                      </div>
                  </CardContent>
              </Card>
          )})}
        </div>
      )}
    </div>
  );
}
