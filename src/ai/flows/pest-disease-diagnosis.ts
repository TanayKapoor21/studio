'use server';

/**
 * @fileOverview AI-driven pest and disease diagnosis for crops.
 *
 * - getPestDiseaseDiagnosis - A function that provides diagnosis and treatment recommendations for crop issues.
 * - PestDiseaseDiagnosisInput - The input type for the getPestDiseaseDiagnosis function.
 * - PestDiseaseDiagnosisOutput - The return type for the getPestDiseaseDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PestDiseaseDiagnosisInputSchema = z.object({
  cropImage: z
    .string()
    .describe(
      "An image of the affected crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: z.string().describe('The type of crop being diagnosed.'),
  symptoms: z.string().describe('A description of the observed symptoms.'),
});

export type PestDiseaseDiagnosisInput = z.infer<
  typeof PestDiseaseDiagnosisInputSchema
>;

const PestDiseaseDiagnosisOutputSchema = z.object({
  diagnosis: z
    .string()
    .describe(
      'The likely pest or disease affecting the crop, e.g., "Powdery Mildew".'
    ),
  confidenceScore: z
    .number()
    .describe('The confidence level of the diagnosis (0-100).'),
  treatmentRecommendations: z
    .string()
    .describe(
      'Suggested organic and chemical treatment options and preventive measures.'
    ),
  preventiveMeasures: z
    .string()
    .describe('Preventive measures to avoid future occurrences.'),
});

export type PestDiseaseDiagnosisOutput = z.infer<
  typeof PestDiseaseDiagnosisOutputSchema
>;

export async function getPestDiseaseDiagnosis(
  input: PestDiseaseDiagnosisInput
): Promise<PestDiseaseDiagnosisOutput> {
  return pestDiseaseDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pestDiseaseDiagnosisPrompt',
  input: {schema: PestDiseaseDiagnosisInputSchema},
  output: {schema: PestDiseaseDiagnosisOutputSchema},
  prompt: `You are an expert plant pathologist. Analyze the provided image and symptoms to diagnose the crop issue.

  Crop Type: {{{cropType}}}
  Symptoms: {{{symptoms}}}
  Crop Image: {{media url=cropImage}}

  Based on the analysis, provide the following:
  - A clear diagnosis of the pest or disease.
  - A confidence score for your diagnosis.
  - Detailed treatment recommendations (both organic and chemical).
  - Preventive measures to protect the rest of the crop.`,
});

const pestDiseaseDiagnosisFlow = ai.defineFlow(
  {
    name: 'pestDiseaseDiagnosisFlow',
    inputSchema: PestDiseaseDiagnosisInputSchema,
    outputSchema: PestDiseaseDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
