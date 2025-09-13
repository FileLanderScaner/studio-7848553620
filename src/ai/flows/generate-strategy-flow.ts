'use server';
/**
 * @fileOverview A flow to generate a weekly content strategy based on a topic.
 *
 * - generateWeeklyStrategy - A function that generates the strategy.
 * - GenerateWeeklyStrategyInput - The input type for the function.
 * - GenerateWeeklyStrategyOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateWeeklyStrategyInputSchema = z.object({
  topic: z.string().describe('The general topic for the content strategy.'),
});
export type GenerateWeeklyStrategyInput = z.infer<typeof GenerateWeeklyStrategyInputSchema>;

const DailyPlanSchema = z.object({
    day: z.string().describe("The day of the week (e.g., 'Lunes')."),
    idea: z.string().describe("The content idea or title for the day."),
    format: z.enum(['Texto', 'Imagen', 'Video', 'Reel', 'Historia']).describe("The suggested format for the content (e.g., 'Imagen', 'Video')."),
});

const GenerateWeeklyStrategyOutputSchema = z.object({
  strategy: z.array(DailyPlanSchema).describe('An array of 7 daily content plans.'),
});
export type GenerateWeeklyStrategyOutput = z.infer<typeof GenerateWeeklyStrategyOutputSchema>;


export async function generateWeeklyStrategy(input: GenerateWeeklyStrategyInput): Promise<GenerateWeeklyStrategyOutput> {
  return generateWeeklyStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyStrategyPrompt',
  input: { schema: GenerateWeeklyStrategyInputSchema },
  output: { schema: GenerateWeeklyStrategyOutputSchema },
  prompt: `You are an expert social media content strategist.
Given a topic, your task is to generate a diverse and engaging 7-day content plan.
For each day of the week, from Lunes (Monday) to Domingo (Sunday), provide a specific content idea and a suitable format (e.g., Imagen, Video, Texto, Reel, Historia).
The ideas should be varied and cover different angles of the main topic.

Topic: {{{topic}}}
`,
});

const generateWeeklyStrategyFlow = ai.defineFlow(
  {
    name: 'generateWeeklyStrategyFlow',
    inputSchema: GenerateWeeklyStrategyInputSchema,
    outputSchema: GenerateWeeklyStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
