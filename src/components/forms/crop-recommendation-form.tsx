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
import { runCropSuggestion } from '@/lib/actions';
import type { WeatherBasedCropSuggestionsOutput } from '@/ai/flows/weather-based-crop-suggestions';
import { Loader2, Zap } from 'lucide-react';

const formSchema = z.object({
  microclimate: z.string().min(10, 'Please describe the microclimate.'),
  weatherForecast: z.string().min(10, 'Please provide a weather forecast.'),
  pollutionLevels: z.string().min(5, 'Please describe pollution levels.'),
  soilType: z.string().min(3, 'Soil type is required.'),
  region: z.string().min(2, 'Region is required.'),
});

const LOCAL_STORAGE_KEY = 'agrisage_settings';

export function CropRecommendationForm() {
  const [result, setResult] =
    useState<WeatherBasedCropSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      microclimate: 'Sunny, moderate wind, near a small river',
      weatherForecast: 'Expecting delayed monsoon, higher summer temperatures',
      pollutionLevels: 'AQI ~120, some industrial haze',
      soilType: 'Alluvial soil',
      region: '',
    },
  });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const { defaultRegion } = JSON.parse(savedSettings);
        if (defaultRegion) form.setValue('region', defaultRegion);
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await runCropSuggestion(values);

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
          <CardTitle>Local Conditions</CardTitle>
          <CardDescription>
            Provide your farm&apos;s conditions to get crop suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Karnal, Haryana" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Alluvial, Loamy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="microclimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Microclimate</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your local farm climate..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherForecast"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Forecast</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Seasonal forecast..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pollutionLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pollution Levels</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Low, AQI: 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suggesting...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Suggest Crops
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Crop & Strategy Suggestions</CardTitle>
          <CardDescription>
            AI-powered suggestions will appear here.
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
                  Suggested Crops
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  {result.suggestedCrops.map((crop, index) => (
                    <li key={index}>{crop}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Adaptation Strategies
                </h3>
                <p className="text-muted-foreground">
                  {result.adaptationStrategies}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Estimated ROI
                </h3>
                <p className="rounded-md bg-muted p-4 text-muted-foreground">
                  {result.roiEstimation}
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
                Your AI-generated suggestions will be displayed here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
