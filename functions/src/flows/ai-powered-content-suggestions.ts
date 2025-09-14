'use server';
/**
 * @fileOverview An AI agent that suggests improvements to content drafts.
 *
 * - suggestImprovements - A function that takes a content draft and suggests improvements.
 * - SuggestImprovementsInput - The input type for the suggestImprovements function.
 * - SuggestImprovementsOutput - The return type for the suggestImprovements function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const SuggestImprovementsInputSchema = z.object({
  contentDraft: z.string().describe('The content draft to improve.'),
});

const SuggestImprovementsOutputSchema = z.object({
  improvedContent: z.string().describe('The improved content with suggestions applied.'),
  explanation: z.string().describe('Explanation of the improvements suggested.'),
});

const prompt = ai.definePrompt({
  name: 'suggestImprovementsPrompt',
  input: {schema: SuggestImprovementsInputSchema},
  output: {schema: SuggestImprovementsOutputSchema},
  prompt: `You are an AI-powered content improvement tool. Your goal is to take a content draft and suggest improvements to increase engagement with the post. Explain your reasoning for each improvement.

Content Draft: {{{contentDraft}}}

Improved Content:`,
});

export const suggestImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestImprovementsFlow',
    inputSchema: SuggestImprovementsInputSchema,
    outputSchema: SuggestImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
