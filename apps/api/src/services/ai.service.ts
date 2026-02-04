import { getAIClient } from '../lib/ai-client.js';
import type { Message } from '@prisma/client';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

export class AIService {
  private model = 'claude-sonnet-4-20250514';

  async streamResponse(
    systemPrompt: string,
    messages: AIMessage[],
    callbacks: StreamCallbacks
  ): Promise<void> {
    const client = getAIClient();

    let fullResponse = '';

    try {
      const stream = await client.messages.stream({
        model: this.model,
        max_tokens: 8192,
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const token = event.delta.text;
          fullResponse += token;
          callbacks.onToken(token);
        }
      }

      callbacks.onComplete(fullResponse);
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  formatMessagesForAI(messages: Message[]): AIMessage[] {
    return messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));
  }

  generateTitleFromContent(content: string): string {
    const cleaned = content.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= 50) {
      return cleaned;
    }
    return cleaned.substring(0, 47) + '...';
  }
}

export const aiService = new AIService();
