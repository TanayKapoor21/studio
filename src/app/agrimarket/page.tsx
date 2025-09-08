import { Handshake } from 'lucide-react';
import { AgriMarketForm } from '@/components/forms/agrimarket-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgriMarket | Agrisage',
};

export default function AgriMarketPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Handshake className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            AgriMarket: Contract Farming
          </h1>
          <p className="mt-2 text-muted-foreground">
            A secure platform for creating digital contracts and connecting with buyers.
          </p>
        </div>
      </div>
      <AgriMarketForm />
    </div>
  );
}
