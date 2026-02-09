'use client';

interface ChatHeaderProps {
  agentName: string;
  agentDescription: string;
  onExport?: () => void;
}

export function ChatHeader({ agentName, agentDescription, onExport }: ChatHeaderProps) {
  return (
    <header className="border-b border-gray-200 p-4 bg-white">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">{agentName}</h2>
          <p className="text-sm text-gray-500 truncate">{agentDescription}</p>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="
              flex items-center gap-2 px-4 py-2
              bg-primary text-white rounded-lg
              text-sm font-medium
              hover:bg-primary-hover
              transition-colors
            "
          >
            <ExportIcon className="w-4 h-4" />
            Exportar
          </button>
        )}
      </div>
    </header>
  );
}

// Ícone de exportar em SVG
function ExportIcon({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
