'use server';
/**
 * @fileOverview AI-driven fertilizer recommendation flow for farmers.
 *
 * - getFertilizerRecommendation - A function that provides fertilizer recommendations.
 * - FertilizerRecommendationInput - The input type for the getFertilizerRecommendation function.
 * - FertilizerRecommendationOutput - The return type for the getFertilizerRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerRecommendationInputSchema = z.object({
  soilHealthParameters: z.string().describe('Soil health parameters including pH, nitrogen, phosphorus, and potassium levels.'),
  cropType: z.string().describe('The type of crop being grown.'),
  weatherData: z.string().describe('Current and historical weather data including temperature, rainfall, and humidity.'),
  region: z.string().describe('The region where the farming is taking place, e.g. Karnal.'),
});
export type FertilizerRecommendationInput = z.infer<typeof FertilizerRecommendationInputSchema>;

const FertilizerRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('The recommended fertilizer and application instructions.'),
  sustainabilityScore: z.number().describe('A score indicating the sustainability of the recommendation (0-100).'),
  carbonFootprintEstimate: z.string().describe('An estimate of the carbon footprint associated with the fertilizer usage.'),
});
export type FertilizerRecommendationOutput = z.infer<typeof FertilizerRecommendationOutputSchema>;

export async function getFertilizerRecommendation(input: FertilizerRecommendationInput): Promise<FertilizerRecommendationOutput> {
  return getFertilizerRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fertilizerRecommendationPrompt',
  input: {schema: FertilizerRecommendationInputSchema},
  output: {schema: FertilizerRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor specializing in fertilizer recommendations for farmers in the Karnal region.

  Based on the soil health parameters, crop type, and weather data provided, you will provide a custom fertilizer recommendation.
  Also calculate a sustainability score (0-100) of the recommendation considering environmental impact and resource efficiency.
  Additionally, provide an estimate of the carbon footprint associated with the recommended fertilizer usage.

  Soil Health Parameters: {{{soilHealthParameters}}}
  Crop Type: {{{cropType}}}
  Weather Data: {{{weatherData}}}
  Region: {{{region}}}

  Format your response as follows:
  Recommendation: [fertilizer recommendation]
  Sustainability Score: [sustainability score]
  Carbon Footprint Estimate: [carbon footprint estimate]
  `,
});

const getFertilizerRecommendationFlow = ai.defineFlow(
  {
    name: 'getFertilizerRecommendationFlow',
    inputSchema: FertilizerRecommendationInputSchema,
    outputSchema: FertilizerRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
