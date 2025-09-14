'use server';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { flow } from 'genkit';

// This is a trick to make sure the secret is deployed.
defineSecret('GOOGLE_GENAI_API_KEY');

// Initialize Genkit and our flows.
// Note that we're not exporting the flows from here, just ensuring they are initialized.
import './flows/ai-powered-content-suggestions';
import './flows/generate-content-flow';
import './flows/generate-strategy-flow';

import { suggestImprovementsFlow } from './flows/ai-powered-content-suggestions';
import { generateContentFlow } from './flows/generate-content-flow';
import { generateWeeklyStrategyFlow } from './flows/generate-strategy-flow';

// Helper function to wrap a Genkit flow in a Firebase Callable Function
function asCallable<I, O>(f: (input: I) => Promise<O>) {
  return onCall<I>(async (request): Promise<O> => {
    // TODO: Add auth check
    // if (!request.auth) {
    //   throw new HttpsError(
    //     'unauthenticated',
    //     'You must be logged in to call this function'
    //   );
    // }
    try {
      return await f(request.data);
    } catch (e) {
      console.error(e);
      if (e instanceof HttpsError) {
        throw e;
      }
      throw new HttpsError('internal', 'An unexpected error occurred.');
    }
  });
}

export const suggestImprovements = asCallable(suggestImprovementsFlow);
export const generateContent = asCallable(generateContentFlow);
export const generateWeeklyStrategy = asCallable(generateWeeklyStrategyFlow);

// A simple flow to test if Genkit is working.
export const helloWorld = onCall(async () => {
    const testFlow = flow(
      { name: 'testFlow' },
      async () => 'Hello from Genkit on Firebase!');
    return await testFlow();
});
