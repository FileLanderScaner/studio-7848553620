'use client';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = getAuth(app);

// Function to get the current user's ID token
async function getIdToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        const token = await user.getIdToken();
        resolve(token);
      } else {
        resolve(null);
      }
    });
  });
}

const BASE_URL = 'https://us-central1-studio-7848553620-773f9.cloudfunctions.net';

export async function runGenkitFlow<I, O>(
  flowName: string,
  payload: I
): Promise<O> {
  const token = await getIdToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${BASE_URL}/${flowName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ data: payload }), // Genkit flows expect the payload inside a 'data' object
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flow ${flowName} failed: ${errorText}`);
  }

  const result = await response.json();
  // Genkit wraps the response in a top-level 'result' object
  // and the flow's return value is inside another 'result' object.
  // So we need to access result.result.
  if (result.result) {
    return result.result as O;
  }
  
  // For flows that might not wrap the result (older versions or different configs)
  return result as O;
}
