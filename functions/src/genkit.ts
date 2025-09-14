import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from "@genkit-ai/firebase";

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});
