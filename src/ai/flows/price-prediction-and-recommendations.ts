'use server';
/**
 * @fileOverview Provides price prediction and recommendations for crops.
 *
 * - getPricePredictionAndRecommendations - A function that provides price predictions and recommendations.
 * - PricePredictionAndRecommendationsInput - The input type for the getPricePredictionAndRecommendations function.
 * - PricePredictionAndRecommendationsOutput - The return type for the getPricePredictionAndRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PricePredictionAndRecommendationsInputSchema = z.object({
  cropType: z.string().describe('The type of crop to predict prices for.'),
  location: z.string().describe('The location where the crop is grown.'),
});
export type PricePredictionAndRecommendationsInput = z.infer<
  typeof PricePredictionAndRecommendationsInputSchema
>;

const PricePredictionAndRecommendationsOutputSchema = z.object({
  priceForecast: z
    .string()
    .describe('The predicted price for the crop in Rupees (₹).'),
  recommendations: z
    .string()
    .describe(
      'Recommendations for when to sell the crop for the best possible price.'
    ),
});
export type PricePredictionAndRecommendationsOutput = z.infer<
  typeof PricePredictionAndRecommendationsOutputSchema
>;

export async function getPricePredictionAndRecommendations(
  input: PricePredictionAndRecommendationsInput
): Promise<PricePredictionAndRecommendationsOutput> {
  return pricePredictionAndRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pricePredictionAndRecommendationsPrompt',
  input: {schema: PricePredictionAndRecommendationsInputSchema},
  output: {schema: PricePredictionAndRecommendationsOutputSchema},
  prompt: `You are an expert agricultural economist. Based on historical price trends, seasonal data, and weather patterns, provide a price forecast for {{cropType}} in {{location}} and recommendations for when to sell the crop for the best possible price. The price should be in Indian Rupees (₹).
`,
});

const pricePredictionAndRecommendationsFlow = ai.defineFlow(
  {
    name: 'pricePredictionAndRecommendationsFlow',
    inputSchema: PricePredictionAndRecommendationsInputSchema,
    outputSchema: PricePredictionAndRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
