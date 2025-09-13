'use server';
/**
 * @fileOverview A flow to generate content based on a topic and details.
 *
 * - generateContent - A function that generates content.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateContentInputSchema = z.object({
  topic: z.string().describe('The topic or keyword for the content.'),
  details: z.string().describe('Additional details like tone, target audience, etc.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  generatedText: z.string().describe('The generated text content.'),
});
export type GenerateContentOutput = {
    type: 'text' | 'image' | 'video',
    data: string
};


export async function generateContent(input: GenerateContentInput): Promise<{ generatedText: string }> {
  return generateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentPrompt',
  input: { schema: GenerateContentInputSchema },
  output: { schema: GenerateContentOutputSchema },
  prompt: `You are an expert content creator for social media.
Generate a post about the following topic: {{{topic}}}.
Take into account the following details: {{{details}}}.
The output should be just the text for the post.
`,
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
