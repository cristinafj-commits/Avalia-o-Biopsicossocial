import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  FileText, 
  UploadCloud, 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Download, 
  Trash2, 
  Edit3, 
  User, 
  Stethoscope, 
  Users, 
  Search, 
  Filter,
  CheckSquare,
  Sparkles,
  Paperclip,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { AvaliacaoCompleta, ProcessoAdministrativoData, ServidorData } from '../types';
import { CRIAR_NOVA_AVALIACAO_RH } from '../data/initialData';
import { calcularAvaliacaoBiopsicossocial } from '../utils/fuzzyCalculator';
import { ManagementRequestsReportModal } from './ManagementRequestsReportModal';

interface RHManagementDashboardProps {
  records: AvaliacaoCompleta[];
  currentEval: AvaliacaoCompleta;
  onSelectRecord: (id: string) => void;
  onCreateRecord: (newRecord: AvaliacaoCompleta) => void;
  onUpdateRecord: (record: AvaliacaoCompleta) => void;
  onDeleteRecord: (id: string) => void;
  onViewConsolidado: (recordId: string) => void;
  onSwitchToMedico: (recordId: string) => void;
  onSwitchToSocial: (recordId: string) => void;
}

export const RHManagementDashboard: React.FC<RHManagementDashboardProps> = ({
  records,
  currentEval,
  onSelectRecord,
  onCreateRecord,
  onUpdateRecord,
  onDeleteRecord,
  onViewConsolidado,
  onSwitchToMedico,
  onSwitchToSocial
}) => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isManagementReportOpen, setIsManagementReportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendentes' | 'prontos' | 'homologados'>('all');
  const [selectedProcessoModal, setSelectedProcessoModal] = useState<AvaliacaoCompleta | null>(null);

  // Form State for new process
  const [formData, setFormData] = useState<{
    processo: ProcessoAdministrativoData;
    servidor: ServidorData;
  }>({
    processo: {
      numeroProcesso: `PA-${new Date().getFullYear()}/00${Math.floor(100 + Math.random() * 900)}`,
      dataSolicitacao: new Date().toISOString().split('T')[0],
      motivoSolicitacao: 'Avaliação Biopsicossocial para Enquadramento Funcional (IF-BRA)',
      orgaoSolicitante: 'Câmara Municipal de Curitiba - Diretoria de Gestão de Pessoas (DGEP)',
      gestorResponsavel: 'Mariana Duarte Souza (Gestão de Pessoas)',
      matriculaGestor: 'GP-4402',
      observacoesRH: 'Solicitação autuada para comprovação de enquadramento funcional e adaptação de posto de trabalho.',
      anexoNome: '',
      anexoTamanho: '',
      anexoDataUrl: '',
      anexoTipo: ''
    },
    servidor: {
      nome: '',
      rg: '',
      cpf: '',
      idade: '',
      sexo: 'Masculino',
      matricula: '',
      cargo: '',
      setorLotacao: '',
      dataAdmissao: '',
      telefone: '',
      email: ''
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeFormatted = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setFormData(prev => ({
        ...prev,
        processo: {
          ...prev.processo,
          anexoNome: file.name,
          anexoTamanho: sizeFormatted,
          anexoDataUrl: dataUrl,
          anexoTipo: file.type || 'application/pdf'
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.servidor.nome.trim()) {
      alert('Por favor, informe o nome completo do servidor.');
      return;
    }
    if (!formData.processo.numeroProcesso.trim()) {
      alert('Por favor, informe o número do processo administrativo.');
      return;
    }

    const newEval = CRIAR_NOVA_AVALIACAO_RH(formData.servidor, formData.processo);
    onCreateRecord(newEval);
    setIsNewModalOpen(false);
    
    // Reset form
    setFormData({
      processo: {
        numeroProcesso: `PA-${new Date().getFullYear()}/00${Math.floor(100 + Math.random() * 900)}`,
        dataSolicitacao: new Date().toISOString().split('T')[0],
        motivoSolicitacao: 'Avaliação Biopsicossocial para Enquadramento Funcional (IF-BRA)',
        orgaoSolicitante: 'Câmara Municipal de Curitiba - Diretoria de Gestão de Pessoas (DGEP)',
        gestorResponsavel: 'Mariana Duarte Souza (Gestão de Pessoas)',
        matriculaGestor: 'GP-4402',
        observacoesRH: 'Solicitação autuada para comprovação de enquadramento funcional e adaptação de posto de trabalho.',
        anexoNome: '',
        anexoTamanho: '',
        anexoDataUrl: '',
        anexoTipo: ''
      },
      servidor: {
        nome: '',
        rg: '',
        cpf: '',
        idade: '',
        sexo: 'Masculino',
        matricula: '',
        cargo: '',
        setorLotacao: '',
        dataAdmissao: '',
        telefone: '',
        email: ''
      }
    });
  };

  // Filter records
  const filteredRecords = records.filter(rec => {
    const sName = rec.servidor.nome?.toLowerCase() || '';
    const sCpf = rec.servidor.cpf || '';
    const sMat = rec.servidor.matricula || '';
    const pNum = rec.processoAdministrativo?.numeroProcesso?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();

    const matchesSearch = sName.includes(term) || sCpf.includes(term) || sMat.includes(term) || pNum.includes(term);

    const isMedAssinado = rec.medico?.statusPreenchimento === 'assinado' || Boolean(rec.medico?.assinaturaDigital?.assinado);
    const isSocAssinado = rec.assistenteSocial?.statusPreenchimento === 'assinado' || Boolean(rec.assistenteSocial?.assinaturaDigital?.assinado);
    const isPronto = isMedAssinado && isSocAssinado;
    const isHomologado = Boolean(rec.homologadoRH);

    if (statusFilter === 'pendentes') return matchesSearch && !isPronto && !isHomologado;
    if (statusFilter === 'prontos') return matchesSearch && isPronto && !isHomologado;
    if (statusFilter === 'homologados') return matchesSearch && isHomologado;
    return matchesSearch;
  });

  // Calculate statistics
  const totalCount = records.length;
  const prontosCount = records.filter(r => 
    (r.medico?.statusPreenchimento === 'assinado' || r.medico?.assinaturaDigital?.assinado) &&
    (r.assistenteSocial?.statusPreenchimento === 'assinado' || r.assistenteSocial?.assinaturaDigital?.assinado) &&
    !r.homologadoRH
  ).length;
  const pendentesCount = records.filter(r => 
    !(
      (r.medico?.statusPreenchimento === 'assinado' || r.medico?.assinaturaDigital?.assinado) &&
      (r.assistenteSocial?.statusPreenchimento === 'assinado' || r.assistenteSocial?.assinaturaDigital?.assinado)
    ) && !r.homologadoRH
  ).length;
  const homologadosCount = records.filter(r => r.homologadoRH).length;

  const handleToggleHomologacao = (rec: AvaliacaoCompleta) => {
    const updated: AvaliacaoCompleta = {
      ...rec,
      homologadoRH: !rec.homologadoRH,
      dataHomologacao: !rec.homologadoRH ? new Date().toISOString() : undefined,
      responsavelHomologacao: !rec.homologadoRH ? 'Diretoria de Gestão de Pessoas - Perícias' : undefined,
      statusGeral: !rec.homologadoRH ? 'homologado' : 'pronto_para_emissao',
      dataAtualizacao: new Date().toISOString()
    };
    onUpdateRecord(updated);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. PAINEL DE BOAS-VINDAS & INDICADORES */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Perfil de Acesso: Gestão de Pessoas / Processos</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Painel de Gestão de Processos e Laudos Biopsicossociais
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Cadastre novas solicitações com a cópia do processo administrativo e dados funcionais do servidor. Os processos serão distribuídos para as filas de avaliação do <strong>Médico Perito</strong> e da <strong>Assistente Social</strong> para assinatura e posterior consolidação.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsManagementReportOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition shadow-sm flex items-center space-x-2 cursor-pointer"
              title="Emitir relatório gerencial com datas de emissão e resultados das solicitações"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Relatório de Solicitações & Resultados</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Solicitação de Avaliação</span>
            </button>
          </div>
        </div>

        {/* STATS METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <span className="text-xs text-slate-400 font-medium">Total de Processos</span>
            <div className="text-xl font-extrabold text-white mt-0.5">{totalCount}</div>
            <span className="text-[10px] text-slate-400">Autuados no sistema</span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5">
            <span className="text-xs text-amber-300 font-medium">Pendentes Perícia</span>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5">{pendentesCount}</div>
            <span className="text-[10px] text-amber-300/80">Médico e/ou Social</span>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5">
            <span className="text-xs text-emerald-300 font-medium">Prontos p/ Emissão</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{prontosCount}</div>
            <span className="text-[10px] text-emerald-300/80">Com as 2 assinaturas</span>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3.5">
            <span className="text-xs text-indigo-300 font-medium">Homologados</span>
            <div className="text-xl font-extrabold text-indigo-400 mt-0.5">{homologadosCount}</div>
            <span className="text-[10px] text-indigo-300/80">Laudo emitido e arquivado</span>
          </div>
        </div>
      </div>

      {/* 2. FILTROS E BUSCA DE PROCESSOS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por servidor, CPF, matrícula ou processo..."
            className="w-full text-xs rounded-xl border border-slate-300 bg-slate-50/70 pl-9.5 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({records.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pendentes')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              statusFilter === 'pendentes' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Pendentes Perícia ({pendentesCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('prontos')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              statusFilter === 'prontos' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Prontos p/ Emissão ({prontosCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('homologados')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              statusFilter === 'homologados' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
            }`}
          >
            Homologados ({homologadosCount})
          </button>
        </div>
      </div>

      {/* 3. LISTA DE PROCESSOS E SOLICITAÇÕES DE AVALIAÇÃO */}
      <div className="space-y-3.5">
        {filteredRecords.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Nenhum processo administrativo localizado</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tente alterar os termos de busca ou clique em "Nova Solicitação de Avaliação" para criar um novo processo.
            </p>
          </div>
        ) : (
          filteredRecords.map(rec => {
            const isMedAssinado = rec.medico?.statusPreenchimento === 'assinado' || Boolean(rec.medico?.assinaturaDigital?.assinado);
            const isSocAssinado = rec.assistenteSocial?.statusPreenchimento === 'assinado' || Boolean(rec.assistenteSocial?.assinaturaDigital?.assinado);
            const isBothSigned = isMedAssinado && isSocAssinado;
            const calc = calcularAvaliacaoBiopsicossocial(rec);

            const hasAttachment = Boolean(rec.processoAdministrativo?.anexoNome || rec.processoAdministrativo?.anexoDataUrl);

            return (
              <div 
                key={rec.id}
                className={`bg-white border rounded-2xl p-5 transition shadow-sm hover:shadow-md ${
                  rec.id === currentEval.id ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Informações Principais do Servidor e Processo */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100 font-mono">
                        {rec.processoAdministrativo?.numeroProcesso || 'PA Não informado'}
                      </span>
                      
                      {rec.homologadoRH ? (
                        <span className="text-[11px] font-bold bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Homologado</span>
                        </span>
                      ) : isBothSigned ? (
                        <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pronto para Emissão (2 Assinaturas)</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Em Perícia Técnica</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500">
                        Autuado em: {rec.processoAdministrativo?.dataSolicitacao ? new Date(rec.processoAdministrativo.dataSolicitacao).toLocaleDateString('pt-BR') : 'Data não informada'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {rec.servidor.nome || 'Servidor sem nome cadastrado'}
                      </h3>
                      {rec.servidor.matricula && (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Mat: {rec.servidor.matricula}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                      <div><strong>Cargo:</strong> {rec.servidor.cargo || 'Não informado'}</div>
                      <div><strong>CPF:</strong> {rec.servidor.cpf || 'Não informado'}</div>
                      <div><strong>Lotação:</strong> {rec.servidor.setorLotacao || 'Não informada'}</div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 italic">
                      Motivo: {rec.processoAdministrativo?.motivoSolicitacao || 'Avaliação Biopsicossocial PCD'}
                    </p>
                  </div>

                  {/* Status das Perícias (Médico & Social) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    
                    {/* Status Médico */}
                    <div className={`p-2.5 rounded-lg border text-xs min-w-[140px] ${
                      isMedAssinado 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center space-x-1">
                          <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Perícia Médica</span>
                        </span>
                        {isMedAssinado ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      <div className="text-[11px] mt-1">
                        {isMedAssinado ? (
                          <span className="text-emerald-800 font-semibold">Assinado ({rec.medico.crm || 'CRM'})</span>
                        ) : (
                          <span className="text-amber-700 font-medium">Pendente avaliação</span>
                        )}
                      </div>
                    </div>

                    {/* Status Social */}
                    <div className={`p-2.5 rounded-lg border text-xs min-w-[140px] ${
                      isSocAssinado 
                        ? 'bg-sky-50 border-sky-300 text-sky-900' 
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-sky-600" />
                          <span>Serviço Social</span>
                        </span>
                        {isSocAssinado ? <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      <div className="text-[11px] mt-1">
                        {isSocAssinado ? (
                          <span className="text-sky-800 font-semibold">Assinado ({rec.assistenteSocial.cress || 'CRESS'})</span>
                        ) : (
                          <span className="text-amber-700 font-medium">Pendente avaliação</span>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

                {/* BARRA DE AÇÕES DO GESTOR DE RH */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  
                  <div className="flex items-center space-x-2">
                    {/* Botão de Ver Processo Administrativo e Cópia Anexa */}
                    <button
                      type="button"
                      onClick={() => setSelectedProcessoModal(rec)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ver Autos do Processo {hasAttachment ? '(Cópia Anexa)' : ''}</span>
                    </button>

                    {/* Resultado / Enquadramento Preview */}
                    <div className="text-xs text-slate-600 flex items-center space-x-1">
                      <span className="font-semibold text-slate-500">Resultado Atual:</span>
                      <span className="font-bold text-slate-800">
                        {calc.pontuacaoFuzzySoma} pts ({calc.grauDeficienciaFuzzySoma})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Botão de Emissão de Laudo Consolidado Oficial */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectRecord(rec.id);
                        onViewConsolidado(rec.id);
                      }}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                        isBothSigned 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>{isBothSigned ? 'Emitir Laudo Consolidado Oficial' : 'Visualizar Prévia do Laudo'}</span>
                    </button>

                    {/* Homologação */}
                    {isBothSigned && (
                      <button
                        type="button"
                        onClick={() => handleToggleHomologacao(rec)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 cursor-pointer ${
                          rec.homologadoRH 
                            ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                        <span>{rec.homologadoRH ? 'Homologado ✅' : 'Homologar'}</span>
                      </button>
                    )}

                    {/* Excluir */}
                    {records.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Deseja excluir a solicitação do servidor "${rec.servidor.nome}" (Processo ${rec.processoAdministrativo.numeroProcesso})?`)) {
                            onDeleteRecord(rec.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Excluir Processo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. MODAL: CADASTRAR NOVA SOLICITAÇÃO (GESTOR DE RH) */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Autuar Nova Solicitação de Avaliação Biopsicossocial
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preencha os dados do processo administrativo, anexe cópia digital e cadastre os dados funcionais do servidor.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
              
              {/* SEÇÃO A: PROCESSO ADMINISTRATIVO */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    1. Dados do Processo Administrativo
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número do Processo Administrativo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.processo.numeroProcesso}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        processo: { ...prev.processo, numeroProcesso: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="Ex.: PA-2026/00148"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data de Abertura / Solicitação <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.processo.dataSolicitacao}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        processo: { ...prev.processo, dataSolicitacao: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Órgão / Secretaria Solicitante
                    </label>
                    <input
                      type="text"
                      value={formData.processo.orgaoSolicitante}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        processo: { ...prev.processo, orgaoSolicitante: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex.: Diretoria de Gestão de Pessoas - DGEP"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Motivo / Finalidade da Avaliação <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.processo.motivoSolicitacao}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        processo: { ...prev.processo, motivoSolicitacao: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex.: Enquadramento Funcional PCD / Readaptação / Concurso"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gestor(a) Responsável
                    </label>
                    <input
                      type="text"
                      value={formData.processo.gestorResponsavel}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        processo: { ...prev.processo, gestorResponsavel: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nome do Gestor Responsável"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Matrícula do Gestor
                    </label>
                    <input
                      type="text"
                      value={formData.processo.matriculaGestor}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        processo: { ...prev.processo, matriculaGestor: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex.: GP-4402"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Despacho Inicial / Observações
                  </label>
                  <textarea
                    rows={2}
                    value={formData.processo.observacoesRH}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      processo: { ...prev.processo, observacoesRH: e.target.value }
                    }))}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Instruções para os peritos médico e assistente social..."
                  />
                </div>

                {/* UPLOAD DO PROCESSO ADMINISTRATIVO */}
                <div className="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="w-8 h-8 text-indigo-600" />
                    <div className="text-xs text-slate-700 font-semibold">
                      Anexar Cópia Digital do Processo Administrativo (PDF / Imagem)
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Inclua a cópia integral do processo, laudos prévios e documentos apresentados pelo servidor.
                    </p>
                    
                    <input
                      type="file"
                      id="file-upload-processo"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    <label
                      htmlFor="file-upload-processo"
                      className="bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-2 rounded-xl border border-indigo-300 shadow-2xs transition cursor-pointer"
                    >
                      {formData.processo.anexoNome ? 'Substituir Arquivo' : 'Selecionar Arquivo do Processo'}
                    </label>

                    {formData.processo.anexoNome && (
                      <div className="flex items-center space-x-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mt-2">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{formData.processo.anexoNome} ({formData.processo.anexoTamanho})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEÇÃO B: DADOS DO SERVIDOR */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    2. Dados Funcionais do(a) Servidor(a) Avaliado(a)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.servidor.nome}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        servidor: { ...prev.servidor, nome: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex.: João da Silva Santos"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CPF <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.servidor.cpf}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        servidor: { ...prev.servidor, cpf: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Matrícula Funcional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.servidor.matricula}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        servidor: { ...prev.servidor, matricula: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex.: 89421-0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cargo Efetivo / Função
                    </label>
                    <input
                      type="text"
                      value={formData.servidor.cargo}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        servidor: { ...prev.servidor, cargo: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex.: Técnico Administrativo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Setor de Lotação
                    </label>
                    <input
                      type="text"
                      value={formData.servidor.setorLotacao}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        servidor: { ...prev.servidor, setorLotacao: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex.: Divisão de Protocolo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data de Admissão
                    </label>
                    <input
                      type="date"
                      value={formData.servidor.dataAdmissao}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        servidor: { ...prev.servidor, dataAdmissao: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefone / Celular
                    </label>
                    <input
                      type="text"
                      value={formData.servidor.telefone}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        servidor: { ...prev.servidor, telefone: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail do Servidor
                    </label>
                    <input
                      type="email"
                      value={formData.servidor.email}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        servidor: { ...prev.servidor, email: e.target.value }
                      }))}
                      className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                      placeholder="servidor@orgao.gov.br"
                    />
                  </div>
                </div>
              </div>

              {/* BOTOES DE ACAO DO MODAL */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center space-x-1.5"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Autuar e Encaminhar para Perícia Técnica</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 5. MODAL: VISUALIZADOR DOS AUTOS DO PROCESSO ADMINISTRATIVO */}
      {selectedProcessoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Processo {selectedProcessoModal.processoAdministrativo?.numeroProcesso}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Servidor: {selectedProcessoModal.servidor.nome} (Matrícula: {selectedProcessoModal.servidor.matricula})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProcessoModal(null)}
                className="text-slate-400 hover:text-slate-700 p-2 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Data de Abertura:</strong> {selectedProcessoModal.processoAdministrativo?.dataSolicitacao}</div>
                <div><strong>Órgão:</strong> {selectedProcessoModal.processoAdministrativo?.orgaoSolicitante}</div>
                <div><strong>Gestor:</strong> {selectedProcessoModal.processoAdministrativo?.gestorResponsavel}</div>
                <div><strong>Matrícula Gestor:</strong> {selectedProcessoModal.processoAdministrativo?.matriculaGestor}</div>
              </div>

              <div>
                <strong>Motivo / Finalidade:</strong>
                <p className="mt-0.5 text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                  {selectedProcessoModal.processoAdministrativo?.motivoSolicitacao}
                </p>
              </div>

              <div>
                <strong>Despacho / Observações:</strong>
                <p className="mt-0.5 text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                  {selectedProcessoModal.processoAdministrativo?.observacoesRH || 'Sem despacho registrado.'}
                </p>
              </div>
            </div>

            {/* SEÇÃO DO ANEXO */}
            <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Cópia do Processo Administrativo Anexa
                  </span>
                </div>
                {selectedProcessoModal.processoAdministrativo?.anexoNome && (
                  <span className="text-[11px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">
                    {selectedProcessoModal.processoAdministrativo.anexoTamanho}
                  </span>
                )}
              </div>

              <div className="mt-2 text-xs text-slate-600">
                {selectedProcessoModal.processoAdministrativo?.anexoNome ? (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 mt-1">
                    <span className="font-semibold text-indigo-900 truncate max-w-[280px]">
                      {selectedProcessoModal.processoAdministrativo.anexoNome}
                    </span>
                    {selectedProcessoModal.processoAdministrativo.anexoDataUrl ? (
                      <a
                        href={selectedProcessoModal.processoAdministrativo.anexoDataUrl}
                        download={selectedProcessoModal.processoAdministrativo.anexoNome}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Cópia</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Arquivo registrado no processo físico</span>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200 text-center">
                    Nenhum arquivo digital anexado a este processo. Consulte os autos físicos do processo administrativo.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedProcessoModal(null)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Fechar Visualizador
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE RELATÓRIO GERENCIAL DE SOLICITAÇÕES E RESULTADOS */}
      <ManagementRequestsReportModal
        isOpen={isManagementReportOpen}
        onClose={() => setIsManagementReportOpen(false)}
        records={records}
      />

    </div>
  );
};
