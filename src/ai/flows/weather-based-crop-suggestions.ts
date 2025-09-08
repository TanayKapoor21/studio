'use server';
/**
 * @fileOverview AI-driven suggestions for optimal crops based on microclimate conditions and adaptation strategies for changing weather and pollution levels.
 *
 * - weatherBasedCropSuggestions - A function that provides crop suggestions based on weather.
 * - WeatherBasedCropSuggestionsInput - The input type for the weatherBasedCropSuggestions function.
 * - WeatherBasedCropSuggestionsOutput - The return type for the weatherBasedCropSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherBasedCropSuggestionsInputSchema = z.object({
  microclimate: z.string().describe('The microclimate conditions of the farm.'),
  weatherForecast: z.string().describe('The weather forecast for the upcoming season.'),
  pollutionLevels: z.string().describe('The current pollution levels in the area.'),
  soilType: z.string().describe('The type of soil available on the farm.'),
  region: z.string().describe('The region where the farm is located'),
});
export type WeatherBasedCropSuggestionsInput = z.infer<typeof WeatherBasedCropSuggestionsInputSchema>;

const WeatherBasedCropSuggestionsOutputSchema = z.object({
  suggestedCrops: z.array(z.string()).describe('A list of suggested crops based on the input parameters.'),
  adaptationStrategies: z.string().describe('Adaptation strategies for changing weather and pollution levels.'),
  roiEstimation: z.string().describe('The estimated ROI for suggested crops in given conditions'),
});
export type WeatherBasedCropSuggestionsOutput = z.infer<typeof WeatherBasedCropSuggestionsOutputSchema>;

export async function weatherBasedCropSuggestions(input: WeatherBasedCropSuggestionsInput): Promise<WeatherBasedCropSuggestionsOutput> {
  return weatherBasedCropSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherBasedCropSuggestionsPrompt',
  input: {schema: WeatherBasedCropSuggestionsInputSchema},
  output: {schema: WeatherBasedCropSuggestionsOutputSchema},
  prompt: `You are an expert agricultural advisor for the Karnal region in Haryana, India. Based on the provided microclimate conditions, weather forecast, pollution levels, soil type, and region, suggest the most suitable crops for the farmer and provide adaptation strategies for changing weather and pollution levels.

Microclimate Conditions: {{{microclimate}}}
Weather Forecast: {{{weatherForecast}}}
Pollution Levels: {{{pollutionLevels}}}
Soil Type: {{{soilType}}}
Region: {{{region}}}

Consider factors such as market demand, profitability, and sustainability when making your suggestions. Also, consider inter-cropping and seasonal recommendations.

Format your response as a JSON object with the following keys:
- suggestedCrops: A list of suggested crops.
- adaptationStrategies: Adaptation strategies for changing weather and pollution levels.
- roiEstimation: The estimated ROI for suggested crops in given conditions
`,
});

const weatherBasedCropSuggestionsFlow = ai.defineFlow(
  {
    name: 'weatherBasedCropSuggestionsFlow',
    inputSchema: WeatherBasedCropSuggestionsInputSchema,
    outputSchema: WeatherBasedCropSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
