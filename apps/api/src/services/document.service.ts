// @ts-expect-error - docx module resolution issue with NodeNext
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../lib/prisma.js';
import type { DocumentType } from '../dtos/document.dto.js';

// Diretório para salvar os documentos gerados
const DOCUMENTS_DIR = path.join(process.cwd(), 'uploads', 'documents');

// Garantir que o diretório existe
if (!fs.existsSync(DOCUMENTS_DIR)) {
  fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
}

interface ParsedContent {
  type: 'heading' | 'paragraph' | 'list-item' | 'code';
  level?: number;
  text: string;
}

export class DocumentService {
  /**
   * Parseia o conteúdo markdown para estrutura intermediária
   */
  private parseMarkdownContent(content: string): ParsedContent[] {
    const lines = content.split('\n');
    const parsed: ParsedContent[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) continue;

      // Headings
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        parsed.push({
          type: 'heading',
          level: headingMatch[1].length,
          text: headingMatch[2],
        });
        continue;
      }

      // List items
      if (trimmedLine.match(/^[-*]\s+/)) {
        parsed.push({
          type: 'list-item',
          text: trimmedLine.replace(/^[-*]\s+/, ''),
        });
        continue;
      }

      // Numbered list items
      if (trimmedLine.match(/^\d+\.\s+/)) {
        parsed.push({
          type: 'list-item',
          text: trimmedLine.replace(/^\d+\.\s+/, ''),
        });
        continue;
      }

      // Code blocks (simplified)
      if (trimmedLine.startsWith('```')) {
        continue; // Skip code block markers
      }

      // Regular paragraph
      parsed.push({
        type: 'paragraph',
        text: trimmedLine,
      });
    }

    return parsed;
  }

  /**
   * Remove formatação markdown inline (bold, italic, etc.)
   */
  private cleanMarkdownFormatting(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
      .replace(/\*(.+?)\*/g, '$1') // Italic
      .replace(/__(.+?)__/g, '$1') // Bold
      .replace(/_(.+?)_/g, '$1') // Italic
      .replace(/`(.+?)`/g, '$1') // Inline code
      .replace(/\[(.+?)\]\(.+?\)/g, '$1'); // Links
  }

  /**
   * Gera documento DOCX a partir de conteúdo markdown
   */
  async generateDocx(content: string, filename: string): Promise<string> {
    const parsed = this.parseMarkdownContent(content);
    const children: unknown[] = [];

    for (const item of parsed) {
      const cleanText = this.cleanMarkdownFormatting(item.text);

      if (item.type === 'heading') {
        const headingLevel =
          item.level === 1
            ? HeadingLevel.HEADING_1
            : item.level === 2
              ? HeadingLevel.HEADING_2
              : item.level === 3
                ? HeadingLevel.HEADING_3
                : HeadingLevel.HEADING_4;

        children.push(
          new Paragraph({
            text: cleanText,
            heading: headingLevel,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (item.type === 'list-item') {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${cleanText}` })],
            spacing: { before: 60, after: 60 },
            indent: { left: 720 },
          })
        );
      } else {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: cleanText })],
            spacing: { before: 120, after: 120 },
          })
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(DOCUMENTS_DIR, `${filename}.docx`);

    fs.writeFileSync(filePath, buffer);

    return filePath;
  }

  /**
   * Gera documento PDF a partir de conteúdo markdown
   */
  async generatePdf(content: string, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(DOCUMENTS_DIR, `${filename}.pdf`);
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 72, bottom: 72, left: 72, right: 72 },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const parsed = this.parseMarkdownContent(content);

      for (const item of parsed) {
        const cleanText = this.cleanMarkdownFormatting(item.text);

        if (item.type === 'heading') {
          const fontSize =
            item.level === 1 ? 24 : item.level === 2 ? 20 : item.level === 3 ? 16 : 14;

          doc.moveDown(0.5);
          doc.font('Helvetica-Bold').fontSize(fontSize).text(cleanText);
          doc.moveDown(0.3);
        } else if (item.type === 'list-item') {
          doc.font('Helvetica').fontSize(12).text(`• ${cleanText}`, {
            indent: 20,
          });
        } else {
          doc.font('Helvetica').fontSize(12).text(cleanText, {
            align: 'justify',
          });
          doc.moveDown(0.3);
        }
      }

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  /**
   * Gera documento e salva no banco de dados
   */
  async generateAndSave(
    conversationId: string,
    name: string,
    content: string,
    type: DocumentType
  ): Promise<{
    id: string;
    name: string;
    type: string;
    url: string;
    conversationId: string;
    createdAt: Date;
  }> {
    // Verificar se a conversa existe
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new Error('Conversa não encontrada');
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const sanitizedName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    const filename = `${sanitizedName}-${timestamp}`;

    // Gerar o documento
    let filePath: string;
    if (type === 'docx') {
      filePath = await this.generateDocx(content, filename);
    } else {
      filePath = await this.generatePdf(content, filename);
    }

    // URL relativa para download
    const url = `/api/documents/download/${path.basename(filePath)}`;

    // Salvar no banco de dados
    const document = await prisma.document.create({
      data: {
        name,
        type,
        url,
        conversationId,
      },
    });

    return document;
  }

  /**
   * Lista documentos de uma conversa
   */
  async listByConversation(conversationId: string) {
    return prisma.document.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca documento por ID
   */
  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
    });
  }

  /**
   * Deleta documento
   */
  async delete(id: string) {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new Error('Documento não encontrado');
    }

    // Extrair nome do arquivo da URL
    const filename = path.basename(document.url);
    const filePath = path.join(DOCUMENTS_DIR, filename);

    // Deletar arquivo se existir
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Deletar do banco
    await prisma.document.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Retorna o caminho completo do arquivo para download
   */
  getFilePath(filename: string): string | null {
    const filePath = path.join(DOCUMENTS_DIR, filename);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return null;
  }
}

export const documentService = new DocumentService();
