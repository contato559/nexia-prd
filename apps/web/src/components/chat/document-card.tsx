'use client';

import { DocTypeIcon } from '@/components/icons';

interface DocumentCardProps {
  id: string;
  name: string;
  type: 'docx' | 'pdf';
  url: string;
  onDownload?: (url: string) => void;
}

const typeLabels: Record<string, string> = {
  docx: 'Word',
  pdf: 'PDF',
};

export function DocumentCard({ name, type, url, onDownload }: DocumentCardProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-secondary border border-border rounded-lg p-4 inline-flex items-center gap-3 mt-3">
      <DocTypeIcon type={type} className="w-6 h-6 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{typeLabels[type] || type.toUpperCase()}</p>
      </div>
      <button
        onClick={handleDownload}
        className="bg-primary hover:bg-primary-hover text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
        aria-label={`Baixar ${name}`}
      >
        Baixar
      </button>
    </div>
  );
}
