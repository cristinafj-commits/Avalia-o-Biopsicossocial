import React, { useState } from 'react';
import { 
  X, 
  Search, 
  FolderOpen, 
  PlusCircle, 
  Trash2, 
  Copy, 
  Upload, 
  FileCheck2, 
  Download,
  Calendar,
  User
} from 'lucide-react';
import { AvaliacaoCompleta } from '../types';

interface RecordsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecords: AvaliacaoCompleta[];
  currentId: string;
  onSelectRecord: (id: string) => void;
  onNewRecord: () => void;
  onDeleteRecord: (id: string) => void;
  onImportJson: (jsonString: string) => void;
}

export const RecordsManagerModal: React.FC<RecordsManagerModalProps> = ({
  isOpen,
  onClose,
  savedRecords,
  currentId,
  onSelectRecord,
  onNewRecord,
  onDeleteRecord,
  onImportJson,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  if (!isOpen) return null;

  const filtered = savedRecords.filter(r => 
    r.servidor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.servidor.cpf.includes(searchTerm) ||
    r.servidor.matricula.includes(searchTerm)
  );

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    try {
      onImportJson(importText);
      setImportText('');
      setShowImportArea(false);
      onClose();
    } catch (e: any) {
      alert('Erro ao importar JSON: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gerenciador de Avaliações Salvas
              </h3>
              <p className="text-xs text-slate-500">
                {savedRecords.length} avaliação(ões) no banco de dados local
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, CPF ou matrícula..."
              className="w-full text-xs rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setShowImportArea(!showImportArea)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl transition flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar JSON</span>
            </button>

            <button
              onClick={() => {
                onNewRecord();
                onClose();
              }}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nova Avaliação</span>
            </button>
          </div>
        </div>

        {/* Import Box */}
        {showImportArea && (
          <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 space-y-3">
            <label className="block text-xs font-bold text-indigo-950">
              Cole o JSON exportado da avaliação para restaurar:
            </label>
            <textarea
              rows={3}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              className="w-full text-xs font-mono rounded-xl border border-indigo-200 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='{"id": "EVAL-...", "servidor": { ... }}'
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowImportArea(false)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportSubmit}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
              >
                Confirmar Importação
              </button>
            </div>
          </div>
        )}

        {/* Records List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhuma avaliação encontrada com o termo "{searchTerm}".
            </div>
          ) : (
            filtered.map(record => {
              const isSelected = record.id === currentId;
              const dataFormatada = record.dataAtualizacao 
                ? new Date(record.dataAtualizacao).toLocaleDateString('pt-BR') 
                : 'Recente';

              return (
                <div
                  key={record.id}
                  className={`p-3.5 rounded-xl transition flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-indigo-50/70 border border-indigo-200 shadow-2xs' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      onSelectRecord(record.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {record.servidor.nome || 'Servidor Sem Nome'}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.2 rounded-full font-semibold">
                          Atual
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>CPF: {record.servidor.cpf || 'Não informado'}</span>
                      <span>Matrícula: {record.servidor.matricula || '—'}</span>
                      <span>Atualizado em: {dataFormatada}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => {
                        const jsonStr = JSON.stringify(record, null, 2);
                        navigator.clipboard.writeText(jsonStr);
                        alert('JSON copiado para a área de transferência!');
                      }}
                      title="Copiar JSON"
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Deseja realmente excluir a avaliação de "${record.servidor.nome || 'Servidor'}"?`)) {
                          onDeleteRecord(record.id);
                        }
                      }}
                      title="Excluir Avaliação"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-xl transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
