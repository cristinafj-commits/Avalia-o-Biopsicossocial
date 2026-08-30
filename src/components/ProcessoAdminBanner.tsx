import React, { useState } from 'react';
import { 
  FileText, 
  Paperclip, 
  Download, 
  ExternalLink, 
  Building2, 
  User, 
  Calendar, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { ProcessoAdministrativoData, ServidorData } from '../types';

interface ProcessoAdminBannerProps {
  processo: ProcessoAdministrativoData;
  servidor: ServidorData;
  perfilAtual?: string;
}

export const ProcessoAdminBanner: React.FC<ProcessoAdminBannerProps> = ({
  processo,
  servidor,
  perfilAtual
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        <div className="flex items-start sm:items-center space-x-3 min-w-0">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded font-mono">
                {processo?.numeroProcesso || 'PA-2026/0000'}
              </span>
              <span className="text-xs text-slate-400">
                Abertura: {processo?.dataSolicitacao ? new Date(processo.dataSolicitacao).toLocaleDateString('pt-BR') : 'Data não informada'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
              {servidor.nome || 'Servidor(a) Avaliado(a)'} &bull; Matrícula: {servidor.matricula || '---'}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              Motivo: {processo?.motivoSolicitacao || 'Avaliação Biopsicossocial PCD'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {processo?.anexoDataUrl && processo?.anexoNome && (
            <a
              href={processo.anexoDataUrl}
              download={processo.anexoNome}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-2xs"
              title="Baixar cópia do processo administrativo anexado"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cópia do Processo ({processo.anexoTamanho || 'PDF'})</span>
              <span className="sm:hidden">Anexo</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            {showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes do Processo'}
          </button>
        </div>

      </div>

      {/* DETALHES EXPANDIDOS DO PROCESSO ADMINISTRATIVO E DADOS DO SERVIDOR */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl">
          <div className="space-y-1.5">
            <h4 className="font-bold text-indigo-300 uppercase tracking-wide text-[11px]">
              Dados do Processo Administrativo
            </h4>
            <div><strong>Órgão Solicitante:</strong> {processo?.orgaoSolicitante}</div>
            <div><strong>Gestor(a) Responsável:</strong> {processo?.gestorResponsavel} ({processo?.matriculaGestor})</div>
            <div><strong>Despacho / Observações:</strong> {processo?.observacoesRH || 'Sem observações adicionais.'}</div>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-indigo-300 uppercase tracking-wide text-[11px]">
              Dados Funcionais do Servidor
            </h4>
            <div><strong>Cargo:</strong> {servidor.cargo} &bull; <strong>Lotação:</strong> {servidor.setorLotacao || 'Não informada'}</div>
            <div><strong>CPF:</strong> {servidor.cpf} &bull; <strong>RG:</strong> {servidor.rg}</div>
            <div><strong>Data Admissão:</strong> {servidor.dataAdmissao} &bull; <strong>Telefone:</strong> {servidor.telefone || '---'}</div>
          </div>
        </div>
      )}
    </div>
  );
};
