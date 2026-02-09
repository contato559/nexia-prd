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
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border p-4 bg-background">
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
              flex-1 resize-none rounded-lg border border-border px-4 py-3
              text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-secondary disabled:text-muted-foreground
              transition-shadow
            "
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !content.trim()}
            className="
              bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-3
              disabled:bg-muted disabled:cursor-not-allowed
              transition-colors
              flex items-center justify-center
            "
            aria-label="Enviar mensagem"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </p>
      </div>
    </div>
  );
}

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
