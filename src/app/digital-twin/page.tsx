import { Combine } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const metadata: Metadata = {
  title: 'Digital Twin | Agrisage',
};

export default function DigitalTwinPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Combine className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Farm Digital Twin
          </h1>
          <p className="mt-2 text-muted-foreground">
            A real-time, virtual replica of your farm for advanced monitoring and simulation.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Karnal Wheat Farm - Plot A</CardTitle>
              <CardDescription>Last synced: Just now</CardDescription>
            </div>
            <Badge variant="secondary">Status: Growing</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-video w-full">
              <Image src="https://picsum.photos/800/450" alt="Farm digital twin view" fill className="rounded-md object-cover" data-ai-hint="digital farm" />
               <div className="absolute bottom-2 right-2 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
                Live View
              </div>
            </div>
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold">Soil Moisture</h3>
                    <Progress value={75} className="mt-2 h-3" />
                    <p className="mt-1 text-sm text-muted-foreground">75% (Optimal)</p>
                </div>
                 <div>
                    <h3 className="font-semibold">Nutrient Levels (NPK)</h3>
                    <Progress value={60} className="mt-2 h-3" />
                    <p className="mt-1 text-sm text-muted-foreground">60% (Slightly Low)</p>
                </div>
                <div>
                    <h3 className="font-semibold">Estimated Yield</h3>
                    <p className="text-2xl font-bold text-primary">12.5 Quintals / Bigha</p>
                </div>
                 <div>
                    <h3 className="font-semibold">Health Status</h3>
                     <p className="text-green-600 dark:text-green-400">Excellent - No pests or diseases detected.</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
