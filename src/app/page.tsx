import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Leaf,
  IndianRupee,
  Thermometer,
  Sprout,
  Handshake,
  Combine,
  Network,
  Bug,
} from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    title: 'Smart Fertilizer',
    description: 'Get AI-powered fertilizer recommendations for your crops.',
    href: '/fertilizer',
    icon: Leaf,
    image: {
      src: 'https://picsum.photos/600/400',
      hint: 'indian farmer fertilizer',
    },
  },
  {
    title: 'Price Prediction',
    description: 'Forecast crop prices to maximize your profits.',
    href: '/price-prediction',
    icon: IndianRupee,
    image: {
      src: 'https://picsum.photos/600/401',
      hint: 'indian vegetable market',
    },
  },
  {
    title: 'Environmental Insights',
    description: 'Monitor environmental stress and pollution impact.',
    href: '/environment',
    icon: Thermometer,
    image: {
      src: 'https://picsum.photos/601/400',
      hint: 'satellite farm india',
    },
  },
  {
    title: 'Crop Suggestions',
    description: 'Find optimal crops for your microclimate and soil.',
    href: '/crop-recommendation',
    icon: Sprout,
    image: {
      src: 'https://picsum.photos/600/402',
      hint: 'rice paddy india',
    },
  },
  {
    title: 'AgriMarket',
    description: 'A secure platform for contract farming and direct market access.',
    href: '/agrimarket',
    icon: Handshake,
    image: {
      src: 'https://picsum.photos/601/401',
      hint: 'indian farmers handshake',
    },
  },
  {
    title: 'Digital Twin',
    description: 'Create a digital replica of your farm for advanced monitoring.',
    href: '/digital-twin',
    icon: Combine,
    image: {
      src: 'https://picsum.photos/601/402',
      hint: 'tea plantation india',
    },
  },
   {
    title: 'IoT Connect',
    description: 'Connect and manage your IoT devices for real-time farm data.',
    href: '/iot-connect',
    icon: Network,
    image: {
      src: 'https://picsum.photos/602/402',
      hint: 'smart farm sensors',
    },
  },
  {
    title: 'Pest & Disease Control',
    description: 'Diagnose crop issues and get AI-driven treatment advice.',
    href: '/pest-disease',
    icon: Bug,
    image: {
      src: 'https://picsum.photos/602/403',
      hint: 'wheat crop disease',
    },
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Welcome to Agrisage
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your AI-powered partner for sustainable and intelligent agriculture.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map(feature => (
          <Card key={feature.href} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={feature.image.src}
                alt={feature.title}
                fill
                className="object-cover"
                data-ai-hint={feature.image.hint}
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full">
                <Link href={feature.href}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
