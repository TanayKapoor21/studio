import { IndianRupee } from 'lucide-react';
import { PricePredictionForm } from '@/components/forms/price-prediction-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Price Prediction | Agrisage',
};

export default function PricePredictionPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <IndianRupee className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Crop Price Prediction
          </h1>
          <p className="mt-2 text-muted-foreground">
            Forecast market prices for your crops to optimize selling strategy.
          </p>
        </div>
      </div>
      <PricePredictionForm />
    </div>
  );
}
