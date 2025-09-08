import { Bug } from 'lucide-react';
import { PestDiseaseForm } from '@/components/forms/pest-disease-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pest & Disease Control | Agrisage',
};

export default function PestDiseasePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Bug className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Pest & Disease Control
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload an image of your crop to diagnose issues and get treatment advice.
          </p>
        </div>
      </div>
      <PestDiseaseForm />
    </div>
  );
}
