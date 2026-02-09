'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Descreva o que você precisa...',
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize do textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = () => {
    const trimmedContent = content.trim();
    if (trimmedContent && !disabled) {
      onSend(trimmedContent);
      setContent('');
      // Reset altura do textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter envia, Shift+Enter nova linha
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className="
              flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500
              transition-shadow
            "
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !content.trim()}
            className="
              bg-primary hover:bg-primary-hover text-white rounded-xl px-4 py-3
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors
              flex items-center justify-center
            "
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </p>
      </div>
    </div>
  );
}

// Ícone de enviar em SVG
function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
