import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from "@genkit-ai/firebase";

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({
        // Other Google AI plugin configuration
    }),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});
