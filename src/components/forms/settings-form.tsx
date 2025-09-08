"use client";

import { useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const settingsSchema = z.object({
  defaultLocation: z.string().optional(),
  defaultRegion: z.string().optional(),
  defaultCrop: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const LOCAL_STORAGE_KEY = 'agrisage_settings';

export function SettingsForm() {
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      defaultLocation: '',
      defaultRegion: '',
      defaultCrop: '',
    },
  });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        form.reset(parsedSettings);
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage', error);
    }
  }, [form]);

  function onSubmit(data: SettingsFormValues) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      toast({
        title: 'Settings saved!',
        description: 'Your default values have been updated.',
      });
    } catch (error) {
      console.error('Failed to save settings to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error saving settings',
        description:
          'Could not save your preferences. Please try again.',
      });
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Default Values</CardTitle>
        <CardDescription>
          Set default values to pre-fill forms across the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="defaultRegion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Karnal" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used in Fertilizer and Crop Recommendation forms.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaultLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Market Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Karnal, Haryana" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used in Price Prediction forms.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaultCrop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Crop Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wheat" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used in various recommendation forms.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
