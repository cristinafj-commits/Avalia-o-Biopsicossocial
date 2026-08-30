import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { AvaliacaoCompleta } from '../types';
import { calcularAvaliacaoBiopsicossocial } from '../utils/fuzzyCalculator';
import { CmcOfficialLogo } from './CmcOfficialLogo';

interface ManagementRequestsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: AvaliacaoCompleta[];
}

export const ManagementRequestsReportModal: React.FC<ManagementRequestsReportModalProps> = ({
  isOpen,
  onClose,
  records
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendentes' | 'prontos' | 'homologados'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  // Process and enrich data
  const enrichedRecords = records.map(rec => {
    const isMedSigned = rec.medico?.statusPreenchimento === 'assinado' || Boolean(rec.medico?.assinaturaDigital?.assinado);
    const isSocSigned = rec.assistenteSocial?.statusPreenchimento === 'assinado' || Boolean(rec.assistenteSocial?.assinaturaDigital?.assinado);
    const isBothSigned = isMedSigned && isSocSigned;
    const calc = calcularAvaliacaoBiopsicossocial(rec);

    // Datas
    const dataAbertura = rec.processoAdministrativo?.dataSolicitacao || rec.dataCriacao?.split('T')[0] || '---';
    
    // Data de emissão/conclusão = data da última assinatura se ambos assinaram
    let dataEmissao = '---';
    if (isBothSigned) {
      const dtMed = rec.medico?.assinaturaDigital?.dataHoraAssinatura || rec.medico?.dataAvaliacao;
      const dtSoc = rec.assistenteSocial?.assinaturaDigital?.dataHoraAssinatura || rec.assistenteSocial?.dataAvaliacao;
      if (dtMed && dtSoc) {
        const d1 = new Date(dtMed);
        const d2 = new Date(dtSoc);
        dataEmissao = (d1 > d2 ? d1 : d2).toLocaleDateString('pt-BR');
      } else {
        dataEmissao = rec.dataAtualizacao ? new Date(rec.dataAtualizacao).toLocaleDateString('pt-BR') : 'Concluído';
      }
    }

    return {
      raw: rec,
      numeroPA: rec.processoAdministrativo?.numeroProcesso || 'PA Não informado',
      nomeServidor: rec.servidor?.nome || 'Servidor não informado',
      cpf: rec.servidor?.cpf || '---',
      matricula: rec.servidor?.matricula || '---',
      cargo: rec.servidor?.cargo || '---',
      setor: rec.servidor?.setorLotacao || '---',
      dataAbertura,
      dataEmissao,
      isMedSigned,
      medicoNome: rec.medico?.nome || '---',
      medicoDoc: rec.medico?.crm || '---',
      medicoData: rec.medico?.dataAvaliacao || '---',
      isSocSigned,
      socialNome: rec.assistenteSocial?.nome || '---',
      socialDoc: rec.assistenteSocial?.cress || '---',
      socialData: rec.assistenteSocial?.dataAvaliacao || '---',
      isBothSigned,
      pontosMedico: calc.pontuacaoFuzzyMedico,
      pontosSocial: calc.pontuacaoFuzzySocial,
      pontosTotal: calc.pontuacaoFuzzySoma,
      resultadoEnquadramento: isBothSigned ? calc.grauDeficienciaFuzzySoma : 'Em avaliação pericial',
      homologado: Boolean(rec.homologadoRH),
      dataHomologacao: rec.dataHomologacao ? new Date(rec.dataHomologacao).toLocaleDateString('pt-BR') : '---',
      qtdRetificacoes: rec.retificacoes?.length || 0
    };
  });

  // Filter records
  const filtered = enrichedRecords.filter(item => {
    // Search
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      item.numeroPA.toLowerCase().includes(term) ||
      item.nomeServidor.toLowerCase().includes(term) ||
      item.cpf.toLowerCase().includes(term) ||
      item.matricula.toLowerCase().includes(term) ||
      item.cargo.toLowerCase().includes(term) ||
      item.setor.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    // Status filter
    if (filterStatus === 'pendentes' && item.isBothSigned) return false;
    if (filterStatus === 'prontos' && (!item.isBothSigned || item.homologado)) return false;
    if (filterStatus === 'homologados' && !item.homologado) return false;

    // Date range filter
    if (startDate && item.dataAbertura < startDate) return false;
    if (endDate && item.dataAbertura > endDate) return false;

    return true;
  });

  // Summary Metrics
  const totalFiltrados = filtered.length;
  const concluidosCount = filtered.filter(f => f.isBothSigned).length;
  const pendentesCount = filtered.filter(f => !f.isBothSigned).length;
  const homologadosCount = filtered.filter(f => f.homologado).length;

  const pcdLeveCount = filtered.filter(f => f.isBothSigned && f.resultadoEnquadramento.toLowerCase().includes('leve')).length;
  const pcdModCount = filtered.filter(f => f.isBothSigned && f.resultadoEnquadramento.toLowerCase().includes('moderada')).length;
  const pcdGraveCount = filtered.filter(f => f.isBothSigned && f.resultadoEnquadramento.toLowerCase().includes('grave')).length;
  const naoPcdCount = filtered.filter(f => f.isBothSigned && f.resultadoEnquadramento.toLowerCase().includes('não')).length;

  // Export to Excel for Management Reporting
  const handleExportManagementExcel = () => {
    const headers = [
      'Nº Processo Administrativo',
      'Data Solicitação / Abertura',
      'Nome do Servidor',
      'CPF',
      'Matrícula',
      'Cargo',
      'Setor / Lotação',
      'Status Geral',
      'Data Emissão / Conclusão',
      'Perícia Médica',
      'Médico Perito (Nome / CRM)',
      'Data Perícia Médica',
      'Pontos IF-BRA Médico (2900)',
      'Avaliação Social',
      'Assistente Social (Nome / CRESS)',
      'Data Avaliação Social',
      'Pontos IF-BRA Social (2900)',
      'Pontuação Consolidada Fuzzy (5800)',
      'Resultado / Enquadramento Final',
      'Homologação DGEP',
      'Data Homologação',
      'Qtd. Retificações Justificadas'
    ];

    const rows = filtered.map(item => [
      item.numeroPA,
      item.dataAbertura,
      item.nomeServidor,
      item.cpf,
      item.matricula,
      item.cargo,
      item.setor,
      item.homologado ? 'Homologado' : item.isBothSigned ? 'Pronto para Emissão' : 'Pendente Perícia',
      item.dataEmissao,
      item.isMedSigned ? 'Concluída / Assinada' : 'Pendente',
      item.isMedSigned ? `${item.medicoNome} (${item.medicoDoc})` : 'Pendente',
      item.medicoData,
      item.isBothSigned ? item.pontosMedico : '---',
      item.isSocSigned ? 'Concluída / Assinada' : 'Pendente',
      item.isSocSigned ? `${item.socialNome} (${item.socialDoc})` : 'Pendente',
      item.socialData,
      item.isBothSigned ? item.pontosSocial : '---',
      item.isBothSigned ? item.pontosTotal : '---',
      item.resultadoEnquadramento,
      item.homologado ? 'Sim' : 'Não',
      item.dataHomologacao,
      item.qtdRetificacoes
    ]);

    const summaryData = [
      ['RELATÓRIO GERENCIAL DE SOLICITAÇÕES E RESULTADOS DE LAUDOS BIOPSICOSSOCIAIS (IF-BRA)'],
      ['Órgão:', 'Câmara Municipal de Curitiba - Diretoria de Gestão de Pessoas (DGEP) - Divisão de Saúde Ocupacional'],
      ['Data de Geração do Relatório:', new Date().toLocaleString('pt-BR')],
      ['Total de Processos Listados:', totalFiltrados],
      ['Concluídos / Emitidos:', concluidosCount, 'Pendentes de Perícia:', pendentesCount, 'Homologados:', homologadosCount],
      ['Distribuição de Resultados:'],
      ['PCD Leve:', pcdLeveCount, 'PCD Moderada:', pcdModCount, 'PCD Grave:', pcdGraveCount, 'Não Enquadrado:', naoPcdCount],
      [],
      headers,
      ...rows
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Auto-fit column widths approx
    ws['!cols'] = [
      { wch: 18 }, { wch: 14 }, { wch: 30 }, { wch: 16 }, { wch: 12 }, { wch: 22 }, { wch: 22 },
      { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 26 }, { wch: 14 }, { wch: 14 },
      { wch: 16 }, { wch: 26 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 24 },
      { wch: 14 }, { wch: 14 }, { wch: 12 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Relatório Gerencial DGEP');
    const fileName = `Relatorio_Gerencial_Solicitacoes_DGEP_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <CmcOfficialLogo height={36} color="black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  DGEP &bull; Divisão de Saúde Ocupacional
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Relatório Gerencial de Solicitações e Resultados
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportManagementExcel}
              className="text-xs font-bold px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="Exportar dados consolidados das solicitações para planilha Excel"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Planilha Gerencial (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              className="text-xs font-bold px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="Imprimir relatório gerencial em PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Relatório</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* STATS RESUMO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
              <span className="text-xs text-slate-500 font-medium">Total de Solicitações</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{totalFiltrados}</div>
              <span className="text-[10px] text-slate-400">Filtradas na visualização</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
              <span className="text-xs text-emerald-700 font-medium">Concluídas / Emitidas</span>
              <div className="text-xl font-black text-emerald-800 mt-0.5">{concluidosCount}</div>
              <span className="text-[10px] text-emerald-600">Com as 2 assinaturas</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
              <span className="text-xs text-amber-700 font-medium">Em Perícia Técnica</span>
              <div className="text-xl font-black text-amber-800 mt-0.5">{pendentesCount}</div>
              <span className="text-[10px] text-amber-600">Pendente Médico ou Social</span>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5">
              <span className="text-xs text-indigo-700 font-medium">Homologados DGEP</span>
              <div className="text-xl font-black text-indigo-800 mt-0.5">{homologadosCount}</div>
              <span className="text-[10px] text-indigo-600">Processos finalizados</span>
            </div>
          </div>

          {/* QUADRO DE RESULTADOS DOS LAUDOS CONCLUÍDOS */}
          {concluidosCount > 0 && (
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Distribuição dos Enquadramentos Biopsicossociais Emitidos:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white/10 px-3 py-1 rounded-lg">PCD Leve: <strong>{pcdLeveCount}</strong></span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">PCD Moderada: <strong>{pcdModCount}</strong></span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">PCD Grave: <strong>{pcdGraveCount}</strong></span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">Não Enquadrado: <strong>{naoPcdCount}</strong></span>
              </div>
            </div>
          )}

          {/* BARRA DE FILTROS */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por servidor, PA, cargo..."
                className="w-full text-xs rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs">
                <span className="text-slate-500 text-[11px]">De:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="text-xs border-0 p-0 text-slate-800 focus:ring-0"
                />
                <span className="text-slate-500 text-[11px] ml-1">Até:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="text-xs border-0 p-0 text-slate-800 focus:ring-0"
                />
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('pendentes')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterStatus === 'pendentes' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Pendentes
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('prontos')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterStatus === 'prontos' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Prontos
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('homologados')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterStatus === 'homologados' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Homologados
                </button>
              </div>
            </div>
          </div>

          {/* TABELA GERENCIAL */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Processo / Servidor</th>
                    <th className="py-3 px-3">Cargo / Setor</th>
                    <th className="py-3 px-3">Data Solicitação</th>
                    <th className="py-3 px-3">Data Emissão</th>
                    <th className="py-3 px-3 text-center">Perícia Médica</th>
                    <th className="py-3 px-3 text-center">Serviço Social</th>
                    <th className="py-3 px-3 text-center">Pontos IF-BRA</th>
                    <th className="py-3 px-3">Resultado Enquadramento</th>
                    <th className="py-3 px-3 text-center">Homologação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                        Nenhum registro localizado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        {/* Processo e Servidor */}
                        <td className="py-2.5 px-3.5">
                          <div className="font-mono font-bold text-indigo-700 text-[11px]">
                            {item.numeroPA}
                          </div>
                          <div className="font-semibold text-slate-900">
                            {item.nomeServidor}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Mat: {item.matricula} &bull; CPF: {item.cpf}
                          </div>
                        </td>

                        {/* Cargo e Setor */}
                        <td className="py-2.5 px-3 text-slate-700">
                          <div className="font-medium text-slate-800">{item.cargo}</div>
                          <div className="text-[10px] text-slate-500">{item.setor}</div>
                        </td>

                        {/* Data Solicitação */}
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                          {item.dataAbertura}
                        </td>

                        {/* Data Emissão */}
                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap font-medium">
                          {item.dataEmissao}
                        </td>

                        {/* Status Médico */}
                        <td className="py-2.5 px-3 text-center">
                          {item.isMedSigned ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Assinado ({item.medicoDoc})
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                              Pendente ⏳
                            </span>
                          )}
                        </td>

                        {/* Status Social */}
                        <td className="py-2.5 px-3 text-center">
                          {item.isSocSigned ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                              Assinado ({item.socialDoc})
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                              Pendente ⏳
                            </span>
                          )}
                        </td>

                        {/* Pontos IF-BRA */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          {item.isBothSigned ? (
                            <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {item.pontosTotal} pts
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal text-[11px]">---</span>
                          )}
                        </td>

                        {/* Resultado Enquadramento */}
                        <td className="py-2.5 px-3">
                          {item.isBothSigned ? (
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.resultadoEnquadramento.toLowerCase().includes('grave')
                                ? 'bg-red-100 text-red-900'
                                : item.resultadoEnquadramento.toLowerCase().includes('moderada')
                                ? 'bg-amber-100 text-amber-900'
                                : item.resultadoEnquadramento.toLowerCase().includes('leve')
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {item.resultadoEnquadramento}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Aguardando laudos
                            </span>
                          )}
                        </td>

                        {/* Homologação */}
                        <td className="py-2.5 px-3 text-center">
                          {item.homologado ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Sim</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Não</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Exibindo <strong>{filtered.length}</strong> de <strong>{records.length}</strong> solicitações autuadas.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition cursor-pointer"
          >
            Fechar Relatório
          </button>
        </div>

      </div>

      {/* ÁREA DE IMPRESSÃO OFICIAL DO RELATÓRIO GERENCIAL */}
      <div className="hidden print:block font-sans text-black p-8 max-w-5xl mx-auto space-y-6">
        <div className="text-center border-b-2 border-black pb-4">
          <div className="flex justify-center mb-3">
            <CmcOfficialLogo height={46} color="black" />
          </div>
          <h1 className="text-base font-bold uppercase tracking-wider">CÂMARA MUNICIPAL DE CURITIBA</h1>
          <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wide mt-0.5">
            DIRETORIA DE GESTÃO DE PESSOAS (DGEP) &bull; DIVISÃO DE SAÚDE OCUPACIONAL
          </h2>
          <h3 className="text-sm uppercase tracking-wide mt-1.5 font-bold border-t border-slate-300 pt-1 inline-block px-4">
            Relatório de Gestão e Acompanhamento de Processos Biopsicossociais (IF-BRA)
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Data de Emissão do Relatório: {new Date().toLocaleString('pt-BR')} &bull; Total de Processos: {filtered.length}
          </p>
        </div>

        <table className="w-full text-left text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-slate-100 border-b border-black">
              <th className="p-1.5 border border-black">Nº Processo</th>
              <th className="p-1.5 border border-black">Servidor</th>
              <th className="p-1.5 border border-black">Cargo / Lotação</th>
              <th className="p-1.5 border border-black">Data Solicit.</th>
              <th className="p-1.5 border border-black">Data Emissão</th>
              <th className="p-1.5 border border-black text-center">Médico</th>
              <th className="p-1.5 border border-black text-center">Social</th>
              <th className="p-1.5 border border-black text-center">Pontos</th>
              <th className="p-1.5 border border-black">Resultado Enquadramento</th>
              <th className="p-1.5 border border-black text-center">Homologado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={idx} className="border-b border-black">
                <td className="p-1.5 border border-black font-mono font-bold">{item.numeroPA}</td>
                <td className="p-1.5 border border-black">{item.nomeServidor}</td>
                <td className="p-1.5 border border-black">{item.cargo} - {item.setor}</td>
                <td className="p-1.5 border border-black">{item.dataAbertura}</td>
                <td className="p-1.5 border border-black">{item.dataEmissao}</td>
                <td className="p-1.5 border border-black text-center">{item.isMedSigned ? `OK (${item.medicoDoc})` : 'Pendente'}</td>
                <td className="p-1.5 border border-black text-center">{item.isSocSigned ? `OK (${item.socialDoc})` : 'Pendente'}</td>
                <td className="p-1.5 border border-black text-center font-bold">{item.isBothSigned ? `${item.pontosTotal} pts` : '---'}</td>
                <td className="p-1.5 border border-black font-semibold">{item.resultadoEnquadramento}</td>
                <td className="p-1.5 border border-black text-center">{item.homologado ? 'SIM' : 'NÃO'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="border-t border-black pt-2">
            <strong>Diretoria de Gestão de Pessoas (DGEP) &bull; Divisão de Saúde Ocupacional</strong>
            <p className="text-[10px]">Gestor Responsável / Homologação</p>
          </div>
          <div className="border-t border-black pt-2">
            <strong>Comissão Biopsicossocial &bull; Junta Médica e Serviço Social</strong>
            <p className="text-[10px]">Médico Perito &bull; Assistente Social</p>
          </div>
        </div>
      </div>

    </div>
  );
};
