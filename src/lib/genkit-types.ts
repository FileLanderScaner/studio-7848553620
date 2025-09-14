import { z } from 'zod';

// Types for ai-powered-content-suggestions
const SuggestImprovementsInputSchema = z.object({
  contentDraft: z.string().describe('The content draft to improve.'),
});
export type SuggestImprovementsInput = z.infer<typeof SuggestImprovementsInputSchema>;

const SuggestImprovementsOutputSchema = z.object({
  improvedContent: z.string().describe('The improved content with suggestions applied.'),
  explanation: z.string().describe('Explanation of the improvements suggested.'),
});
export type SuggestImprovementsOutput = z.infer<typeof SuggestImprovementsOutputSchema>;


// Types for generate-content-flow
const GenerateContentInputSchema = z.object({
  topic: z.string().describe('The topic or keyword for the content.'),
  contentType: z.enum(['text', 'image', 'video']),
  details: z.string().describe('Additional details like tone, target audience, etc.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

export type GenerateContentOutput = {
    type: 'text' | 'image' | 'video',
    data: string
};


// Types for generate-strategy-flow
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
