"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runPricePrediction } from '@/lib/actions';
import type { PricePredictionAndRecommendationsOutput } from '@/ai/flows/price-prediction-and-recommendations';
import { Loader2, Zap } from 'lucide-react';

const formSchema = z.object({
  cropType: z.string().min(2, 'Crop type is required.'),
  location: z.string().min(2, 'Location is required.'),
});

const LOCAL_STORAGE_KEY = 'agrisage_settings';

export function PricePredictionForm() {
  const [result, setResult] =
    useState<PricePredictionAndRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: '',
      location: '',
    },
  });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const { defaultLocation, defaultCrop } = JSON.parse(savedSettings);
        if (defaultLocation) form.setValue('location', defaultLocation);
        if (defaultCrop) form.setValue('cropType', defaultCrop);
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await runPricePrediction(values);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Market Details</CardTitle>
          <CardDescription>
            Enter the crop and location to forecast prices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wheat, Basmati Rice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Karnal, Haryana" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Forecasting...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Forecast Price
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Price Forecast & Recommendations</CardTitle>
          <CardDescription>
            The generated forecast will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {result && (
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Price Forecast
                </h3>
                <p className="rounded-md bg-muted p-4 text-muted-foreground">
                  {result.priceForecast}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Selling Recommendations
                </h3>
                <p className="text-muted-foreground">{result.recommendations}</p>
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card-foreground/5 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/50">
                <Zap className="h-8 w-8 text-accent-foreground" />
              </div>
              <p className="text-muted-foreground">
                Your AI-generated forecast will be displayed here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
