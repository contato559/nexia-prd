'use client';

interface Material {
  id: string;
  name: string;
  type: 'docx' | 'pdf';
  agent: string;
  createdAt: string;
}

const mockMaterials: Material[] = [
  { id: '1', name: 'PRD App de Delivery', type: 'pdf', agent: 'PRD Generator', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '2', name: 'Proposta Sistema ERP', type: 'docx', agent: 'Escopo Comercial', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '3', name: 'Arquitetura Microservicos', type: 'pdf', agent: 'Escopo Tecnico', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { id: '4', name: 'PRD Plataforma de Cursos', type: 'docx', agent: 'PRD Generator', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
];

const typeIcons: Record<string, string> = { docx: '📄', pdf: '📕' };
const typeLabels: Record<string, string> = { docx: 'Word', pdf: 'PDF' };

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function MaterialsView() {
  if (mockMaterials.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4 opacity-60">📂</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum material ainda</h2>
          <p className="text-sm text-gray-500">
            Seus documentos gerados aparecerao aqui. Inicie uma conversa com um agente para criar seu primeiro material.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Materiais</h2>
        <p className="text-sm text-gray-500 mb-6">Documentos gerados pelas suas conversas</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{typeIcons[material.type]}</span>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                  {typeLabels[material.type]}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1 truncate">{material.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{material.agent} &middot; {formatDate(material.createdAt)}</p>
              <button className="w-full py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                Baixar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
