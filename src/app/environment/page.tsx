import { Thermometer } from 'lucide-react';
import { EnvironmentForm } from '@/components/forms/environment-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Environmental Monitoring | Agrisage',
};

export default function EnvironmentPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Thermometer className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Environmental Monitoring
          </h1>
          <p className="mt-2 text-muted-foreground">
            Analyze remote sensing data for environmental insights like thermal
            stress and pollution.
          </p>
        </div>
      </div>
      <EnvironmentForm />
    </div>
  );
}
