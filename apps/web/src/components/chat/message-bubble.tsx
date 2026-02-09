'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { DocumentCard } from './document-card';

interface Document {
  id: string;
  name: string;
  type: 'docx' | 'pdf';
  url: string;
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  documents?: Document[];
}

export function MessageBubble({ role, content, isStreaming, documents }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[70%] px-4 py-3
          ${
            isUser
              ? 'bg-primary text-white rounded-2xl rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-code:text-pink-600 prose-code:bg-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content}
            </ReactMarkdown>
          </div>
        )}

        {/* Indicador de streaming */}
        {isStreaming && (
          <div className="flex items-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
          </div>
        )}

        {/* Documentos anexados */}
        {documents && documents.length > 0 && (
          <div className="mt-3 space-y-2">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                name={doc.name}
                type={doc.type}
                url={doc.url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para indicador de "digitando"
export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
