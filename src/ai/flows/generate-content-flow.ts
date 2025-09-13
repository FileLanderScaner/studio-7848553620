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
  contentType: z.enum(['text', 'image', 'video']),
  details: z.string().describe('Additional details like tone, target audience, etc.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

export type GenerateContentOutput = {
    type: 'text' | 'image' | 'video',
    data: string
};


export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: z.any(),
  },
  async (input) => {

    if (input.contentType === 'text') {
        const { output } = await ai.generate({
            prompt: `You are an expert content creator for social media.
Generate a post about the following topic: ${input.topic}.
Take into account the following details: ${input.details}.
The output should be just the text for the post.
`,
        });
        return { type: 'text', data: output!.text! };
    }

    if (input.contentType === 'image') {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-image-preview',
            prompt: `Generate an image for a social media post about: ${input.topic}. Additional details: ${input.details}`,
            config: {
                responseModalities: ['IMAGE'],
            },
        });
        return { type: 'image', data: media.url! };
    }

    // Placeholder for video
    return { type: 'video', data: 'https://picsum.photos/seed/video/600/400' };
  }
);
