import { describe, it, expect } from 'vitest';
import { AIService } from '../services/ai.service.js';

describe('AIService', () => {
  const aiService = new AIService();

  describe('generateTitleFromContent', () => {
    it('should return content as is if less than 50 chars', () => {
      const content = 'Título curto';
      const result = aiService.generateTitleFromContent(content);
      expect(result).toBe('Título curto');
    });

    it('should truncate content at 50 chars with ellipsis', () => {
      const content =
        'Este é um título muito longo que precisa ser truncado para caber no campo de título da conversa';
      const result = aiService.generateTitleFromContent(content);
      expect(result.length).toBe(50);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should clean up extra whitespace', () => {
      const content = '  Título   com   espaços   extras  ';
      const result = aiService.generateTitleFromContent(content);
      expect(result).toBe('Título com espaços extras');
    });

    it('should handle newlines', () => {
      const content = 'Título\ncom\nquebras\nde linha';
      const result = aiService.generateTitleFromContent(content);
      expect(result).toBe('Título com quebras de linha');
    });
  });

  describe('formatMessagesForAI', () => {
    it('should format messages correctly', () => {
      const messages = [
        {
          id: '1',
          role: 'user',
          content: 'Olá',
          conversationId: 'conv1',
          createdAt: new Date(),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Olá! Como posso ajudar?',
          conversationId: 'conv1',
          createdAt: new Date(),
        },
      ];

      const result = aiService.formatMessagesForAI(messages);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ role: 'user', content: 'Olá' });
      expect(result[1]).toEqual({
        role: 'assistant',
        content: 'Olá! Como posso ajudar?',
      });
    });
  });
});
