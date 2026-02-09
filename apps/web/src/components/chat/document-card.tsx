'use client';

interface DocumentCardProps {
  id: string;
  name: string;
  type: 'docx' | 'pdf';
  url: string;
  onDownload?: (url: string) => void;
}

const typeIcons: Record<string, string> = {
  docx: '📄',
  pdf: '📕',
};

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
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 inline-flex items-center gap-3 mt-3">
      <span className="text-2xl">{typeIcons[type] || '📄'}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-500">{typeLabels[type] || type.toUpperCase()}</p>
      </div>
      <button
        onClick={handleDownload}
        className="bg-primary hover:bg-primary-hover text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
      >
        Baixar
      </button>
    </div>
  );
}
