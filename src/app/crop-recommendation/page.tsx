import { Sprout } from 'lucide-react';
import { CropRecommendationForm } from '@/components/forms/crop-recommendation-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop Recommendation | AgriVision',
};

export default function CropRecommendationPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Sprout className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Weather-Based Crop Recommendation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Get suggestions for optimal crops based on your local microclimate
            and conditions.
          </p>
        </div>
      </div>
      <CropRecommendationForm />
    </div>
  );
}
