'use server';

/**
 * @fileOverview Environmental monitoring insights flow that leverages AI to filter and present relevant environmental data to farmers.
 *
 * - environmentalMonitoringInsights - A function that orchestrates the retrieval, filtering, and presentation of environmental insights.
 * - EnvironmentalMonitoringInsightsInput - The input type for the environmentalMonitoringInsights function.
 * - EnvironmentalMonitoringInsightsOutput - The return type for the environmentalMonitoringInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnvironmentalMonitoringInsightsInputSchema = z.object({
  remoteSensingData: z
    .string()
    .describe('Remote sensing data as a string.'),
  cropType: z.string().describe('The type of crop being monitored.'),
  location: z.string().describe('The location of the farm.'),
});

export type EnvironmentalMonitoringInsightsInput = z.infer<
  typeof EnvironmentalMonitoringInsightsInputSchema
>;

const EnvironmentalMonitoringInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-filtered environmental insights.'),
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
  prompt: `You are an AI assistant helping farmers understand environmental impacts on their crops.

  Given the remote sensing data, crop type, and location, filter the data to provide only the most relevant insights.

  Remote Sensing Data: {{{remoteSensingData}}}
  Crop Type: {{{cropType}}}
  Location: {{{location}}}

  Insights:`, // Instruction to generate insights.
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
