import React, { useState } from 'react';
import { 
  Stethoscope, 
  Users, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Download, 
  Building2, 
  Calendar, 
  User, 
  FileCheck2,
  Filter,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AvaliacaoCompleta } from '../types';

interface ProfessionalQueueDashboardProps {
  role: 'medico' | 'social';
  records: AvaliacaoCompleta[];
  currentEvalId: string;
  onSelectAndOpenForm: (id: string) => void;
  onViewConsolidado: (id: string) => void;
}

export const ProfessionalQueueDashboard: React.FC<ProfessionalQueueDashboardProps> = ({
  role,
  records,
  currentEvalId,
  onSelectAndOpenForm,
  onViewConsolidado
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'em_andamento' | 'assinado' | 'pronto'>('all');

  const isMedico = role === 'medico';

  // Helper functions to determine status for this specific role
  const isMedSigned = (rec: AvaliacaoCompleta) => {
    return rec.medico?.statusPreenchimento === 'assinado' || Boolean(rec.medico?.assinaturaDigital?.assinado) || Boolean(rec.medico?.nome && rec.medico?.crm);
  };

  const isSocSigned = (rec: AvaliacaoCompleta) => {
    return rec.assistenteSocial?.statusPreenchimento === 'assinado' || Boolean(rec.assistenteSocial?.assinaturaDigital?.assinado) || Boolean(rec.assistenteSocial?.nome && rec.assistenteSocial?.cress);
  };

  const isRoleSigned = (rec: AvaliacaoCompleta) => {
    return isMedico ? isMedSigned(rec) : isSocSigned(rec);
  };

  const isRoleInProgress = (rec: AvaliacaoCompleta) => {
    if (isMedico) {
      if (isMedSigned(rec)) return false;
      return Boolean(
        rec.medico?.cidPrincipal || 
        (rec.atividadesMedico && Object.keys(rec.atividadesMedico).length > 0) ||
        (rec.funcoesCorporais && Object.values(rec.funcoesCorporais).some(Boolean))
      );
    } else {
      if (isSocSigned(rec)) return false;
      return Boolean(
        rec.assistenteSocial?.fatoresAmbientaisBarreiras || 
        (rec.atividadesSocial && Object.keys(rec.atividadesSocial).length > 0)
      );
    }
  };

  const isOtherRoleSigned = (rec: AvaliacaoCompleta) => {
    return isMedico ? isSocSigned(rec) : isMedSigned(rec);
  };

  // Metrics count
  const totalCount = records.length;
  const pendentesCount = records.filter(r => !isRoleSigned(r) && !isRoleInProgress(r)).length;
  const emAndamentoCount = records.filter(r => isRoleInProgress(r)).length;
  const assinadosCount = records.filter(r => isRoleSigned(r)).length;
  const prontosConsolidadosCount = records.filter(r => isRoleSigned(r) && isOtherRoleSigned(r)).length;

  // Filter records
  const filteredRecords = records.filter(rec => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      rec.servidor.nome.toLowerCase().includes(term) ||
      rec.servidor.cpf.toLowerCase().includes(term) ||
      rec.servidor.matricula.toLowerCase().includes(term) ||
      rec.servidor.cargo.toLowerCase().includes(term) ||
      (rec.processoAdministrativo?.numeroProcesso || '').toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (statusFilter === 'pendente') {
      return !isRoleSigned(rec) && !isRoleInProgress(rec);
    }
    if (statusFilter === 'em_andamento') {
      return isRoleInProgress(rec);
    }
    if (statusFilter === 'assinado') {
      return isRoleSigned(rec);
    }
    if (statusFilter === 'pronto') {
      return isRoleSigned(rec) && isOtherRoleSigned(rec);
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. CABEÇALHO DO MÓDULO PROFISSIONAL */}
      <div className={`rounded-2xl p-6 shadow-md text-white ${
        isMedico 
          ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/40' 
          : 'bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 border border-sky-800/40'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center space-x-1.5 border ${
                isMedico 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              }`}>
                {isMedico ? <Stethoscope className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                <span>{isMedico ? 'Módulo: Médico Perito' : 'Módulo: Assistente Social'}</span>
              </span>
              <span className="text-xs text-slate-300">&bull; Câmara de Curitiba &bull; Divisão de Perícias</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {isMedico ? 'Fila de Perícias Médicas Pendentes' : 'Fila de Avaliações Sociais Pendentes'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              {isMedico 
                ? 'Selecione um processo cadastrado pela Gestão de Pessoas para realizar o exame pericial, preenchimento das funções corporais (CIF) e avaliação IF-BRA Médica (41 Atividades).'
                : 'Selecione um processo cadastrado pela Gestão de Pessoas para realizar o estudo social, análise de barreiras ambientais e avaliação IF-BRA Social (41 Atividades).'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewConsolidado(currentEvalId)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 border border-white/15 cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Ver Laudo Atual</span>
            </button>
          </div>
        </div>

        {/* CARDS DE INDICADORES DA FILA */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          
          <div className="bg-black/20 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-300 font-medium">Total de Casos</div>
            <div className="text-2xl font-bold text-white mt-0.5">{totalCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Cadastrados no sistema</div>
          </div>

          <div className={`rounded-xl p-3 border ${
            pendentesCount > 0 
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-200' 
              : 'bg-black/20 border-white/5 text-slate-300'
          }`}>
            <div className="text-[11px] font-medium flex items-center justify-between">
              <span>Pendentes para Mim</span>
              {pendentesCount > 0 && <Clock className="w-3 h-3 text-amber-400 animate-pulse" />}
            </div>
            <div className="text-2xl font-bold text-white mt-0.5">{pendentesCount}</div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">Aguardando preenchimento</div>
          </div>

          <div className="bg-black/20 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-300 font-medium">Em Andamento</div>
            <div className="text-2xl font-bold text-white mt-0.5">{emAndamentoCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Rascunho salvo</div>
          </div>

          <div className={`rounded-xl p-3 border ${
            isMedico ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-sky-500/20 border-sky-500/40'
          }`}>
            <div className="text-[11px] text-slate-300 font-medium flex items-center justify-between">
              <span>{isMedico ? 'Perícias Médicas Assinadas' : 'Avaliações Sociais Assinadas'}</span>
              <CheckCircle2 className={`w-3 h-3 ${isMedico ? 'text-emerald-400' : 'text-sky-400'}`} />
            </div>
            <div className="text-2xl font-bold text-white mt-0.5">{assinadosCount}</div>
            <div className="text-[10px] text-slate-300 mt-0.5">{prontosConsolidadosCount} com laudo pronto</div>
          </div>

        </div>
      </div>

      {/* 2. BARRA DE BUSCA E FILTROS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Campo de Busca */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por servidor, CPF, matrícula ou Nº do PA..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Filtros de Status */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Filtrar:</span>
            </span>

            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('pendente')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'pendente'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>⏳ Pendentes ({pendentesCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('em_andamento')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                statusFilter === 'em_andamento'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              📝 Em Preenchimento ({emAndamentoCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('assinado')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'assinado'
                  ? (isMedico ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white')
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>✅ Assinados ({assinadosCount})</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. LISTA DE PROCESSOS E AVALIAÇÕES */}
      <div className="space-y-3.5">
        {filteredRecords.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Nenhuma solicitação encontrada</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Não encontramos nenhum processo correspondente aos filtros selecionados. Tente ajustar os termos de busca.
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const roleSigned = isRoleSigned(rec);
            const roleInProgress = isRoleInProgress(rec);
            const otherSigned = isOtherRoleSigned(rec);
            const isSelected = rec.id === currentEvalId;

            return (
              <div 
                key={rec.id}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                  isSelected 
                    ? (isMedico ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-sky-500 ring-2 ring-sky-500/20')
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  
                  {/* Informações Principais do Servidor e Processo */}
                  <div className="space-y-2.5 min-w-0 flex-1">
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-slate-900 text-white font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {rec.processoAdministrativo?.numeroProcesso || 'PA-2026/PENDENTE'}
                      </span>

                      {/* Status da Perícia Médica */}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                        isMedSigned(rec)
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : (rec.medico?.cidPrincipal || (rec.atividadesMedico && Object.keys(rec.atividadesMedico).length > 0))
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        <Stethoscope className="w-3 h-3" />
                        <span>
                          {isMedSigned(rec)
                            ? 'Médico: Assinado ✅'
                            : (rec.medico?.cidPrincipal || (rec.atividadesMedico && Object.keys(rec.atividadesMedico).length > 0))
                            ? 'Médico: Em Preenchimento'
                            : 'Médico: Pendente ⏳'}
                        </span>
                      </span>

                      {/* Status da Avaliação Social */}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                        isSocSigned(rec)
                          ? 'bg-sky-100 text-sky-900 border border-sky-200'
                          : (rec.assistenteSocial?.fatoresAmbientaisBarreiras || (rec.atividadesSocial && Object.keys(rec.atividadesSocial).length > 0))
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        <Users className="w-3 h-3" />
                        <span>
                          {isSocSigned(rec)
                            ? 'Social: Assinado ✅'
                            : (rec.assistenteSocial?.fatoresAmbientaisBarreiras || (rec.atividadesSocial && Object.keys(rec.atividadesSocial).length > 0))
                            ? 'Social: Em Preenchimento'
                            : 'Social: Pendente ⏳'}
                        </span>
                      </span>

                      {isSelected && (
                        <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Em Foco
                        </span>
                      )}
                    </div>

                    {/* Nome do Servidor */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {rec.servidor.nome || 'Servidor(a) não identificado(a)'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                        <div><strong>Cargo:</strong> {rec.servidor.cargo || 'Não informado'}</div>
                        <div><strong>Matrícula:</strong> {rec.servidor.matricula || '---'}</div>
                        <div><strong>CPF:</strong> {rec.servidor.cpf || '---'}</div>
                        {rec.servidor.setorLotacao && (
                          <div><strong>Lotação:</strong> {rec.servidor.setorLotacao}</div>
                        )}
                      </div>
                    </div>

                    {/* Dados do Processo / Despacho */}
                    <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700 space-y-1 border border-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div><strong>Finalidade:</strong> {rec.processoAdministrativo?.motivoSolicitacao || 'Avaliação Biopsicossocial'}</div>
                        <div className="text-[11px] text-slate-500">
                          Autuado em: {rec.processoAdministrativo?.dataSolicitacao || rec.dataCriacao.split('T')[0]}
                        </div>
                      </div>
                      
                      {rec.processoAdministrativo?.observacoesRH && (
                        <div className="text-slate-600 italic">
                          "{rec.processoAdministrativo.observacoesRH}"
                        </div>
                      )}

                      {rec.processoAdministrativo?.anexoNome && (
                        <div className="pt-1 flex items-center space-x-2">
                          <span className="text-[11px] font-bold text-slate-700">Documento anexado:</span>
                          <a
                            href={rec.processoAdministrativo.anexoDataUrl}
                            download={rec.processoAdministrativo.anexoNome}
                            className="inline-flex items-center space-x-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded hover:bg-indigo-100"
                          >
                            <Download className="w-3 h-3" />
                            <span>{rec.processoAdministrativo.anexoNome}</span>
                          </a>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Botões de Ação do Profissional */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-2 shrink-0">
                    
                    {/* BOTÃO PRINCIPAL DE PREENCHIMENTO */}
                    <button
                      type="button"
                      onClick={() => onSelectAndOpenForm(rec.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                        isMedico
                          ? (roleSigned 
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white' 
                              : roleInProgress 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse' 
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white')
                          : (roleSigned 
                              ? 'bg-sky-700 hover:bg-sky-800 text-white' 
                              : roleInProgress 
                              ? 'bg-sky-600 hover:bg-sky-700 text-white animate-pulse' 
                              : 'bg-sky-600 hover:bg-sky-500 text-white')
                      }`}
                    >
                      {isMedico ? <Stethoscope className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      <span>
                        {roleSigned 
                          ? (isMedico ? 'Revisar Perícia Médica' : 'Revisar Avaliação Social')
                          : roleInProgress 
                          ? (isMedico ? 'Continuar Perícia Médica' : 'Continuar Avaliação Social')
                          : (isMedico ? 'Iniciar Perícia Médica' : 'Iniciar Avaliação Social')}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* BOTÃO SECUNDÁRIO: VER LAUDO / RESUMO */}
                    <button
                      type="button"
                      onClick={() => onViewConsolidado(rec.id)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Visualizar Laudo</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
