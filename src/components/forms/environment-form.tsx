'use client';

import {useState, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
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
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {runEnvironmentalMonitoring} from '@/lib/actions';
import type {EnvironmentalMonitoringInsightsOutput} from '@/ai/flows/environmental-monitoring-insights';
import {Loader2, Zap, Upload} from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  satelliteImage: z.string().min(1, 'Please upload a satellite image.'),
  cropType: z.string().min(2, 'Crop type is required.'),
  location: z.string().min(2, 'Location is required.'),
});

const LOCAL_STORAGE_KEY = 'agrisage_settings';

export function EnvironmentForm() {
  const [result, setResult] =
    useState<EnvironmentalMonitoringInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      satelliteImage: '',
      cropType: '',
      location: '',
    },
  });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const {defaultLocation, defaultCrop} = JSON.parse(savedSettings);
        if (defaultLocation) form.setValue('location', defaultLocation);
        if (defaultCrop) form.setValue('cropType', defaultCrop);
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
  }, [form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue('satelliteImage', dataUri);
        setPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await runEnvironmentalMonitoring(values);

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
          <CardTitle>Data Input</CardTitle>
          <CardDescription>
            Provide data to generate environmental insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="satelliteImage"
                render={() => (
                  <FormItem>
                    <FormLabel>Satellite Image</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image from Google Earth Engine
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a satellite image of your farm.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {preview && (
                <div className="relative mt-4 h-48 w-full">
                  <Image
                    src={preview}
                    alt="Satellite image preview"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="cropType"
                render={({field}) => (
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
                name="location"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Insights
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI-Filtered Insights</CardTitle>
          <CardDescription>
            Relevant environmental insights will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {result && (
            <div className="space-y-4 text-sm">
              <p className="rounded-md bg-muted p-4 text-muted-foreground">
                {result.insights}
              </p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card-foreground/5 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/50">
                <Zap className="h-8 w-8 text-accent-foreground" />
              </div>
              <p className="text-muted-foreground">
                Your AI-generated insights will be displayed here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
