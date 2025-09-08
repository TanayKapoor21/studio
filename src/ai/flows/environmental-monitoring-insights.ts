'use server';

/**
 * @fileOverview Environmental monitoring insights flow that leverages AI to filter and present relevant environmental data to farmers.
 *
 * - environmentalMonitoringInsights - A function that orchestrates the retrieval, filtering, and presentation of environmental insights.
 * - EnvironmentalMonitoringInsightsInput - The input type for the environmentalMonitoringInsights function.
 * - EnvironmentalMonitoringInsightsOutput - The return type for the environmentalMonitoringInsightsOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnvironmentalMonitoringInsightsInputSchema = z.object({
  satelliteImage: z
    .string()
    .describe(
      "A satellite image of the farm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: z.string().describe('The type of crop being monitored.'),
  location: z.string().describe('The location of the farm.'),
});

export type EnvironmentalMonitoringInsightsInput = z.infer<
  typeof EnvironmentalMonitoringInsightsInputSchema
>;

const EnvironmentalMonitoringInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'AI-filtered environmental insights based on the satellite image, including thermal stress, pollution, and environmental impact.'
    ),
});

export type EnvironmentalMonitoringInsightsOutput = z.infer<
  typeof EnvironmentalMonitoringInsightsOutputSchema
>;

export async function environmentalMonitoringInsights(
  input: EnvironmentalMonitoringInsightsInput
): Promise<EnvironmentalMonitoringInsightsOutput> {
  return environmentalMonitoringInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'environmentalMonitoringInsightsPrompt',
  input: {schema: EnvironmentalMonitoringInsightsInputSchema},
  output: {schema: EnvironmentalMonitoringInsightsOutputSchema},
  prompt: `You are an AI assistant using remote sensing data for environmental monitoring. Analyze the provided satellite image from Google Earth Engine (represented by the media file).

  Based on the image, crop type, and location, generate insights about thermal stress, pollution, and the overall environmental impact on the crops.

  Crop Type: {{{cropType}}}
  Location: {{{location}}}
  Satellite Image: {{media url=satelliteImage}}

  Provide detailed insights below:`,
});

const environmentalMonitoringInsightsFlow = ai.defineFlow(
  {
    name: 'environmentalMonitoringInsightsFlow',
    inputSchema: EnvironmentalMonitoringInsightsInputSchema,
    outputSchema: EnvironmentalMonitoringInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
