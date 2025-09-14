'use server';
/**
 * @fileOverview A flow to generate content based on a topic and details.
 */

import { ai } from '../genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

const GenerateContentInputSchema = z.object({
  topic: z.string().describe('The topic or keyword for the content.'),
  contentType: z.enum(['text', 'image', 'video']),
  details: z.string().describe('Additional details like tone, target audience, etc.'),
});

export const generateContentFlow = ai.defineFlow(
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
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: `Generate an image for a social media post about: ${input.topic}. Additional details: ${input.details}`,
        });
        return { type: 'image', data: media.url! };
    }

    if (input.contentType === 'video') {
      const apiKey = process.env.GOOGLE_GENAI_API_KEY;
      if (!apiKey) {
        throw new Error('The GOOGLE_GENAI_API_KEY environment variable is not set. Please add it to your .env file for local development and configure it as a secret for production.');
      }

      let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: `Generate a video for a social media post about: ${input.topic}. Additional details: ${input.details}`,
        config: {
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
      });

      if (!operation) {
        throw new Error('Expected the model to return an operation');
      }

      // Wait until the operation completes.
      while (!operation.done) {
        operation = await ai.checkOperation(operation);
        // Sleep for 5 seconds before checking again.
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      if (operation.error) {
        throw new Error('failed to generate video: ' + operation.error.message);
      }
      
      const video = operation.output?.message?.content.find((p) => !!p.media);
      if (!video || !video.media) {
        throw new Error('Failed to find the generated video');
      }
      
      const media = video.media;

      const fetch = (await import('node-fetch')).default;
      // Add API key before fetching the video.
      const videoDownloadResponse = await fetch(
        `${media.url}&key=${apiKey}`
      );

      if (
        !videoDownloadResponse ||
        videoDownloadResponse.status !== 200 ||
        !videoDownloadResponse.body
      ) {
        throw new Error('Failed to fetch video');
      }
      const buffer = await videoDownloadResponse.buffer();
      const base64 = buffer.toString('base64');
      return { type: 'video', data: `data:video/mp4;base64,${base64}` };
    }

    // Fallback just in case
    return { type: 'text', data: 'Content type not supported.' };
  }
);
