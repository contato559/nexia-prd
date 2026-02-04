import { describe, it, expect, afterAll } from 'vitest';
import { DocumentService } from '../services/document.service.js';
import * as fs from 'fs';
import * as path from 'path';

describe('DocumentService', () => {
  const documentService = new DocumentService();
  const generatedFiles: string[] = [];

  afterAll(() => {
    // Limpar arquivos gerados durante os testes
    for (const file of generatedFiles) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }
  });

  describe('generateDocx', () => {
    it('should generate a DOCX file', async () => {
      const content = `# Título do Documento

Este é um parágrafo de teste com **texto em negrito** e *texto em itálico*.

## Seção 1

- Item de lista 1
- Item de lista 2
- Item de lista 3

### Subseção 1.1

Outro parágrafo com conteúdo de teste.
`;

      const filePath = await documentService.generateDocx(content, 'test-docx-service');
      generatedFiles.push(filePath);

      expect(fs.existsSync(filePath)).toBe(true);
      expect(filePath.endsWith('.docx')).toBe(true);

      // Verificar tamanho do arquivo
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  describe('generatePdf', () => {
    it('should generate a PDF file', async () => {
      const content = `# Título do PDF

Este é um parágrafo de teste.

## Seção 1

- Item 1
- Item 2

Parágrafo final.
`;

      const filePath = await documentService.generatePdf(content, 'test-pdf-service');
      generatedFiles.push(filePath);

      expect(fs.existsSync(filePath)).toBe(true);
      expect(filePath.endsWith('.pdf')).toBe(true);

      // Verificar tamanho do arquivo
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  describe('getFilePath', () => {
    it('should return file path for existing file', async () => {
      const content = '# Test';
      const filePath = await documentService.generateDocx(content, 'test-getfilepath');
      generatedFiles.push(filePath);

      const filename = path.basename(filePath);
      const result = documentService.getFilePath(filename);

      expect(result).toBe(filePath);
    });

    it('should return null for non-existing file', () => {
      const result = documentService.getFilePath('non-existing-file.docx');
      expect(result).toBeNull();
    });
  });
});
