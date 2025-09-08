"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runFertilizerRecommendation } from '@/lib/actions';
import type { FertilizerRecommendationOutput } from '@/ai/flows/smart-fertilizer-recommendations';
import { Loader2, Zap } from 'lucide-react';

const formSchema = z.object({
  soilHealthParameters: z
    .string()
    .min(10, 'Please provide more details about soil health.'),
  cropType: z.string().min(2, 'Crop type is required.'),
  weatherData: z
    .string()
    .min(10, 'Please provide some weather data or forecast.'),
  region: z.string().min(2, 'Region is required.'),
});

const LOCAL_STORAGE_KEY = 'agrisage_settings';

export function FertilizerForm() {
  const [result, setResult] = useState<FertilizerRecommendationOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilHealthParameters:
        'pH: 6.5, Nitrogen: 50ppm, Phosphorus: 20ppm, Potassium: 100ppm',
      cropType: '',
      weatherData: 'Temp: 25°C, Rainfall: 5mm/week, Humidity: 60%',
      region: '',
    },
  });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const { defaultRegion, defaultCrop } = JSON.parse(savedSettings);
        if (defaultRegion) form.setValue('region', defaultRegion);
        if (defaultCrop) form.setValue('cropType', defaultCrop);
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await runFertilizerRecommendation(values);

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
          <CardTitle>Farm Details</CardTitle>
          <CardDescription>
            Fill in the details below to generate a recommendation.
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
                      <Input placeholder="e.g., Wheat, Rice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilHealthParameters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Health Parameters</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., pH: 6.5, Nitrogen: low..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include pH, N, P, K levels if known.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Temp: 25°C, Rainfall: 5mm..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Current and forecasted weather conditions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Karnal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Recommendation
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI Recommendation</CardTitle>
          <CardDescription>
            The generated recommendation will appear here.
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
                  Fertilizer Plan
                </h3>
                <p className="rounded-md bg-muted p-4 text-muted-foreground">
                  {result.recommendation}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Sustainability Score
                </h3>
                <p className="text-3xl font-bold text-primary">
                  {result.sustainabilityScore}{' '}
                  <span className="text-lg font-medium text-muted-foreground">
                    / 100
                  </span>
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Carbon Footprint Estimate
                </h3>
                <p className="text-muted-foreground">
                  {result.carbonFootprintEstimate}
                </p>
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card-foreground/5 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/50">
                <Zap className="h-8 w-8 text-accent-foreground" />
              </div>
              <p className="text-muted-foreground">
                Your AI-generated results will be displayed here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
