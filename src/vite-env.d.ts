/// <reference types="vite/client" />

interface GPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GPTClient {
  complete: (prompt: string) => Promise<GPTResponse>;
}

interface Window {
  gpt: GPTClient;
}