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
import {runPestDiseaseDiagnosis} from '@/lib/actions';
import type {PestDiseaseDiagnosisOutput} from '@/ai/flows/pest-disease-diagnosis';
import {Loader2, Zap, Upload} from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  cropImage: z.string().min(1, 'Please upload a crop image.'),
  cropType: z.string().min(2, 'Crop type is required.'),
  symptoms: z.string().min(10, 'Please describe the symptoms.'),
});

const LOCAL_STORAGE_KEY = 'agrisage_settings';

export function PestDiseaseForm() {
  const [result, setResult] =
    useState<PestDiseaseDiagnosisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropImage: '',
      cropType: '',
      symptoms: '',
    },
  });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const { defaultCrop } = JSON.parse(savedSettings);
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
        form.setValue('cropImage', dataUri);
        setPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const response = await runPestDiseaseDiagnosis(values);

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
          <CardTitle>Crop Analysis</CardTitle>
          <CardDescription>
            Provide an image and details to diagnose the problem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cropImage"
                render={() => (
                  <FormItem>
                    <FormLabel>Crop Image</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-pest"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Affected Crop Image
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      A clear image of the pest or disease on the crop.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {preview && (
                <div className="relative mt-4 h-48 w-full">
                  <Image
                    src={preview}
                    alt="Crop image preview"
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
                      <Input placeholder="e.g., Wheat, Tomato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symptoms"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Observed Symptoms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Yellow spots on leaves, wilting..." {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Diagnosing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Diagnose Problem
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Diagnosis & Treatment</CardTitle>
          <CardDescription>
            AI-powered diagnosis will appear here.
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
                  Diagnosis
                </h3>
                 <p className="text-lg font-bold text-primary">
                  {result.diagnosis}
                </p>
              </div>
               <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Confidence Score
                </h3>
                <p className="text-3xl font-bold text-primary">
                  {result.confidenceScore}{' '}
                  <span className="text-lg font-medium text-muted-foreground">
                    %
                  </span>
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Treatment Recommendations
                </h3>
                <p className="rounded-md bg-muted p-4 text-muted-foreground whitespace-pre-wrap">
                  {result.treatmentRecommendations}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Preventive Measures
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {result.preventiveMeasures}
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
                Your AI-generated diagnosis will be displayed here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
