import { Leaf } from 'lucide-react';
import { FertilizerForm } from '@/components/forms/fertilizer-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Fertilizer Recommendation | AgriVision',
};

export default function FertilizerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Leaf className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Smart Fertilizer Recommendation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Input your farm&apos;s data to receive AI-powered fertilizer
            advice.
          </p>
        </div>
      </div>
      <FertilizerForm />
    </div>
  );
}
