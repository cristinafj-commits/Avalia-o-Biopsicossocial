import React, { useRef } from 'react';
import { 
  FileCheck2, 
  Printer, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  FileText,
  Copy,
  Check,
  Stethoscope,
  Users,
  PlusCircle
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { AvaliacaoCompleta } from '../types';
import { calcularAvaliacaoBiopsicossocial } from '../utils/fuzzyCalculator';
import { CmcOfficialLogo } from './CmcOfficialLogo';

interface ConsolidatedReportProps {
  evalData: AvaliacaoCompleta;
  onExportExcel?: () => void;
}

export const ConsolidatedReport: React.FC<ConsolidatedReportProps> = ({ evalData }) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const res = calcularAvaliacaoBiopsicossocial(evalData);

  const isMedicoSigned = evalData.medico?.statusPreenchimento === 'assinado' || Boolean(evalData.medico?.assinaturaDigital?.assinado);
  const isSocialSigned = evalData.assistenteSocial?.statusPreenchimento === 'assinado' || Boolean(evalData.assistenteSocial?.assinaturaDigital?.assinado);
  const bothSigned = isMedicoSigned && isSocialSigned;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(res.parecerBiopsicossocialFormatado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Recharts radar data (Comparing Medical, Social, and Combined %)
  const radarData = res.dominiosPontuacao.map(d => {
    const maxSingle = d.qtdAtividades * 100;
    const maxDouble = d.qtdAtividades * 200;
    const pctMedico = Math.round((d.totalAjustadoFuzzyMedico / maxSingle) * 100);
    const pctSocial = Math.round((d.totalAjustadoFuzzySocial / maxSingle) * 100);
    const pctSoma = Math.round((d.totalAjustadoFuzzySoma / maxDouble) * 100);

    return {
      domain: `D${d.codigoDomain}`,
      fullName: d.nomeDomain,
      Médico: pctMedico,
      Social: pctSocial,
      SomaUnificada: pctSoma,
    };
  });

  // Recharts bar chart data
  const barData = res.dominiosPontuacao.map(d => ({
    name: `D${d.codigoDomain}`,
    'Médico (pts)': d.totalAjustadoFuzzyMedico,
    'Social (pts)': d.totalAjustadoFuzzySocial,
    'Soma Dual (pts)': d.totalAjustadoFuzzySoma,
  }));

  const getGrauBadge = (grau: string) => {
    switch (grau) {
      case 'Grave':
        return 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-300';
      case 'Moderada':
        return 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-300';
      case 'Leve':
        return 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-300';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* ACTION BAR (Top) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl font-bold shadow-xs">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Laudo Biopsicossocial Consolidado (Avaliação Dual Unificada)
            </h2>
            <p className="text-xs text-slate-600">
              Pontuação IF-BRA aplicada por ambos os profissionais (Médico Perito + Assistente Social) e soma unificada.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {bothSigned ? (
            <>
              <button
                onClick={handleCopyText}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copied ? 'Copiado!' : 'Copiar Parecer Técnico'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Laudo Oficial (PDF)</span>
              </button>
            </>
          ) : (
            <div className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Emissão Bloqueada: Pendente Assinatura Dual</span>
            </div>
          )}
        </div>
      </div>

      {/* AVISO DE LAUDO BLOQUEADO PARA NÃO CONTAMINAÇÃO */}
      {!bothSigned && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex items-start space-x-3.5 text-amber-950">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-amber-900">
              Resultado Final e Emissão em Sigilo Técnico (Princípio da Não-Contaminação)
            </h3>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Em estrita conformidade com as diretrizes da avaliação biopsicossocial (Lei 13.146/2015), o resultado consolidado e a pontuação total da soma pericial só são formalmente emitidos após a conclusão e assinatura digital de <strong>ambos os profissionais</strong> (Médico Perito e Assistente Social).
            </p>
            <div className="text-xs font-semibold pt-1 flex flex-wrap gap-2 text-slate-700">
              <span className={`px-2.5 py-0.5 rounded-full border ${isMedicoSigned ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-white text-amber-900 border-amber-300'}`}>
                1. Perícia Médica: {isMedicoSigned ? 'Assinada ✅' : 'Pendente ⏳'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border ${isSocialSigned ? 'bg-sky-100 text-sky-900 border-sky-300' : 'bg-white text-amber-900 border-amber-300'}`}>
                2. Avaliação Social: {isSocialSigned ? 'Assinada ✅' : 'Pendente ⏳'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DADOS DO PROCESSO ADMINISTRATIVO E DO SERVIDOR */}
      {evalData.processoAdministrativo && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Processo Administrativo {evalData.processoAdministrativo.numeroProcesso}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {evalData.servidor.nome} (Matrícula: {evalData.servidor.matricula || '---'})
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {evalData.homologadoRH && (
                <span className="text-xs bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold px-3 py-1 rounded-lg flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>Homologado</span>
                </span>
              )}
              {evalData.processoAdministrativo.anexoNome && (
                <span className="text-xs bg-slate-100 text-slate-700 font-medium px-3 py-1 rounded-lg">
                  Anexo: {evalData.processoAdministrativo.anexoNome}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl">
            <div><strong>Órgão Solicitante:</strong> {evalData.processoAdministrativo.orgaoSolicitante}</div>
            <div><strong>Data da Solicitação:</strong> {evalData.processoAdministrativo.dataSolicitacao}</div>
            <div><strong>Gestor Responsável:</strong> {evalData.processoAdministrativo.gestorResponsavel} ({evalData.processoAdministrativo.matriculaGestor})</div>
            <div className="sm:col-span-3"><strong>Finalidade do Processo:</strong> {evalData.processoAdministrativo.motivoSolicitacao}</div>
          </div>
        </div>
      )}

      {/* STATUS DAS ASSINATURAS DOS PROFISSIONAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Assinatura Médica */}
        <div className={`p-4 rounded-2xl border ${
          evalData.medico?.statusPreenchimento === 'assinado' || evalData.medico?.assinaturaDigital?.assinado
            ? 'bg-emerald-50/50 border-emerald-300'
            : 'bg-amber-50/50 border-amber-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span className="text-slate-900">Perícia Médica Oficial</span>
            </div>
            {evalData.medico?.statusPreenchimento === 'assinado' || evalData.medico?.assinaturaDigital?.assinado ? (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Assinado Eletronicamente</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Pendente Assinatura
              </span>
            )}
          </div>
          
          <div className="text-xs text-slate-800 space-y-1">
            <div><strong>Médico Perito:</strong> {evalData.medico.nome || 'Não informado'} ({evalData.medico.crm || 'CRM'})</div>
            <div><strong>CID Principal:</strong> {evalData.medico.cidPrincipal || '---'}</div>
            {evalData.medico?.assinaturaDigital?.hashAutenticacao && (
              <div className="font-mono text-[10px] text-slate-500 truncate mt-1">
                Hash: {evalData.medico.assinaturaDigital.hashAutenticacao}
              </div>
            )}
          </div>
        </div>

        {/* Assinatura Social */}
        <div className={`p-4 rounded-2xl border ${
          evalData.assistenteSocial?.statusPreenchimento === 'assinado' || evalData.assistenteSocial?.assinaturaDigital?.assinado
            ? 'bg-sky-50/50 border-sky-300'
            : 'bg-amber-50/50 border-amber-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 font-bold text-xs">
              <Users className="w-4 h-4 text-sky-700" />
              <span className="text-slate-900">Serviço Social Pericial</span>
            </div>
            {evalData.assistenteSocial?.statusPreenchimento === 'assinado' || evalData.assistenteSocial?.assinaturaDigital?.assinado ? (
              <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Assinado Eletronicamente</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Pendente Assinatura
              </span>
            )}
          </div>
          
          <div className="text-xs text-slate-800 space-y-1">
            <div><strong>Assistente Social:</strong> {evalData.assistenteSocial.nome || 'Não informado'} ({evalData.assistenteSocial.cress || 'CRESS'})</div>
            <div><strong>Fatores Ambientais:</strong> {evalData.assistenteSocial.fatoresAmbientaisBarreiras ? 'Analisados' : 'Pendente'}</div>
            {evalData.assistenteSocial?.assinaturaDigital?.hashAutenticacao && (
              <div className="font-mono text-[10px] text-slate-500 truncate mt-1">
                Hash: {evalData.assistenteSocial.assinaturaDigital.hashAutenticacao}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* KPI METRICS CARDS (DUAL SCORES & SUM) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Enquadramento Final Unificado */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enquadramento Final
            </span>
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="my-3">
            <span className={`inline-block text-base sm:text-lg font-extrabold px-3.5 py-1.5 rounded-xl border ${getGrauBadge(res.grauDeficienciaFuzzySoma)}`}>
              Deficiência {res.grauDeficienciaFuzzySoma}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Soma Pericial Dual (Médico + Social)
          </p>
        </div>

        {/* Card 2: Pontuação do Médico Perito */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Médico Perito
            </span>
            <Stethoscope className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-emerald-600">
              {res.pontuacaoFuzzyMedico} <span className="text-sm font-normal text-slate-400">/ 2900 pts</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Grau Médico: <strong className="text-slate-800">{res.grauDeficienciaMedico}</strong>
          </p>
        </div>

        {/* Card 3: Pontuação da Assistente Social */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assistente Social
            </span>
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-sky-600">
              {res.pontuacaoFuzzySocial} <span className="text-sm font-normal text-slate-400">/ 2900 pts</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Grau Social: <strong className="text-slate-800">{res.grauDeficienciaSocial}</strong>
          </p>
        </div>

        {/* Card 4: Soma das Duas Pontuações */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">
              Soma das Duas Pontuações
            </span>
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black">
              {res.pontuacaoFuzzySoma} <span className="text-sm font-normal opacity-80">/ 5800 pts</span>
            </div>
          </div>
          <div className="text-[11px] bg-white/20 px-2.5 py-1 rounded-lg font-mono font-semibold">
            Equiv. Escala 41 itens: {res.pontuacaoNormalizada8200} / 8200 pts
          </div>
        </div>

      </div>

      {/* ANÁLISE DE IMPACTO DO MODELO FUZZY */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            Detalhamento da Avaliação Biopsicossocial e Modelo Fuzzy
          </h3>
        </div>

        <div className="space-y-2">
          {res.resumoImpactoFuzzy.map((msg, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start space-x-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{msg}</span>
            </div>
          ))}
        </div>

        {/* Tabela de Comparação de Domínios com Nota Médica, Nota Social e Soma */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-y border-slate-200">
                <th className="p-3 font-bold">Cód.</th>
                <th className="p-3 font-bold">Domínio IF-BRA</th>
                <th className="p-3 font-bold text-center">Qtd. Ativ.</th>
                <th className="p-3 font-bold text-center">Nota Médico</th>
                <th className="p-3 font-bold text-center">Nota Social</th>
                <th className="p-3 font-bold text-center bg-indigo-50/60 text-indigo-900">
                  SOMA DAS NOTAS (Médico + Social)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {res.dominiosPontuacao.map(dom => {
                const maxSingle = dom.qtdAtividades * 100;
                const maxDouble = dom.qtdAtividades * 200;

                return (
                  <tr key={dom.codigoDomain} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-500">D{dom.codigoDomain}</td>
                    <td className="p-3 font-medium text-slate-900">{dom.nomeDomain}</td>
                    <td className="p-3 text-center font-mono text-slate-600">{dom.qtdAtividades}</td>
                    
                    {/* Nota Médico */}
                    <td className="p-3 text-center font-mono font-semibold text-emerald-700">
                      {dom.totalAjustadoFuzzyMedico} / {maxSingle}
                    </td>

                    {/* Nota Social */}
                    <td className="p-3 text-center font-mono font-semibold text-sky-700">
                      {dom.totalAjustadoFuzzySocial} / {maxSingle}
                    </td>

                    {/* Soma das Notas */}
                    <td className="p-3 text-center font-mono font-extrabold text-indigo-950 bg-indigo-50/40">
                      {dom.totalAjustadoFuzzySoma} / {maxDouble}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* GRÁFICOS INTERATIVOS (RECHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Perfil de Funcionalidade (%) por Profissional
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Comparativo da porcentagem de independência funcional atribuída pelo Médico Perito vs Assistente Social.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="domain" stroke="#64748b" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 9 }} />
                <Radar name="Médico (%)" dataKey="Médico" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                <Radar name="Social (%)" dataKey="Social" stroke="#0284c7" fill="#0284c7" fillOpacity={0.25} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Pontuação Absoluta e Soma Unificada
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Pontuação por domínio: Médico Perito + Assistente Social = Soma Dual.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Médico (pts)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Social (pts)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Soma Dual (pts)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SÍNTESE DO PARECER CONCLUSIVO */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Síntese do Parecer Biopsicossocial Consolidado
            </h3>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-lg font-semibold">
            Parecer Oficial Formatado
          </span>
        </div>

        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-mono">
          {res.parecerBiopsicossocialFormatado}
        </pre>
      </section>

      {/* HISTÓRICO DE AUDITORIA DE RETIFICAÇÕES PERICIAIS */}
      {evalData.retificacoes && evalData.retificacoes.length > 0 && (
        <section className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-amber-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              Auditoria de Retificações Periciais Registradas ({evalData.retificacoes.length})
            </h3>
          </div>
          <div className="space-y-2">
            {evalData.retificacoes.map((ret, idx) => (
              <div key={ret.id || idx} className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950">
                <div className="flex justify-between items-center text-[11px] font-bold text-amber-900 mb-1">
                  <span>
                    #{idx + 1} - Retificação por {ret.nomeProfissional} ({ret.perfil === 'medico' ? 'Médico Perito' : 'Assistente Social'} &bull; {ret.documentoProfissional})
                  </span>
                  <span>{new Date(ret.dataHora).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-amber-100">
                  <strong>Justificativa Técnica:</strong> "{ret.justificativa}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AREA DE IMPRESSÃO OFICIAL (A4 PRINTABLE LAUDO) */}
      <div className="hidden print:block font-serif text-black p-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center border-b-2 border-black pb-4">
          <div className="flex justify-center mb-3">
            <CmcOfficialLogo height={48} color="black" />
          </div>
          <h1 className="text-base font-bold uppercase tracking-wider">CÂMARA MUNICIPAL DE CURITIBA</h1>
          <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wide mt-0.5">
            Diretoria de Gestão de Pessoas (DGEP) &bull; Divisão de Saúde Ocupacional
          </h2>
          <h3 className="text-sm font-bold uppercase mt-1.5 border-t border-slate-300 pt-1.5 inline-block px-4">
            LAUDO PERICIAL BIOPSICOSSOCIAL UNIFICADO &bull; IF-BRA
          </h3>
          <p className="text-[11px] italic mt-0.5 text-slate-700">
            Índice de Funcionalidade Brasileiro (Avaliação Dual: Médica + Social) &bull; Lei Brasileira de Inclusão (Lei nº 13.146/2015)
          </p>
        </div>

        {evalData.processoAdministrativo && (
          <div className="border p-3 text-xs bg-slate-50 space-y-1">
            <div className="flex justify-between font-bold">
              <span>PROCESSO ADMINISTRATIVO: {evalData.processoAdministrativo.numeroProcesso}</span>
              <span>Data de Abertura: {evalData.processoAdministrativo.dataSolicitacao}</span>
            </div>
            <div><strong>Órgão Solicitante:</strong> {evalData.processoAdministrativo.orgaoSolicitante}</div>
            <div><strong>Finalidade:</strong> {evalData.processoAdministrativo.motivoSolicitacao}</div>
            <div><strong>Gestor Responsável:</strong> {evalData.processoAdministrativo.gestorResponsavel} (Matrícula: {evalData.processoAdministrativo.matriculaGestor})</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs border p-3">
          <div><strong>Servidor(a):</strong> {evalData.servidor.nome}</div>
          <div><strong>CPF:</strong> {evalData.servidor.cpf}</div>
          <div><strong>RG:</strong> {evalData.servidor.rg}</div>
          <div><strong>Matrícula:</strong> {evalData.servidor.matricula}</div>
          <div><strong>Cargo:</strong> {evalData.servidor.cargo}</div>
          <div><strong>Data Admissão:</strong> {evalData.servidor.dataAdmissao}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs border p-3">
          <div><strong>Médico Perito:</strong> {evalData.medico.nome} ({evalData.medico.crm})</div>
          <div><strong>Assistente Social:</strong> {evalData.assistenteSocial.nome} ({evalData.assistenteSocial.cress})</div>
          <div><strong>CID Principal:</strong> {evalData.medico.cidPrincipal}</div>
          <div><strong>Data Avaliação:</strong> {evalData.medico.dataAvaliacao}</div>
        </div>

        <div className="border p-4 text-xs space-y-2">
          <h3 className="font-bold border-b pb-1">RESULTADO DA AVALIAÇÃO CONSOLIDADA DUAL</h3>
          <p><strong>Pontuação do Médico Perito:</strong> {res.pontuacaoFuzzyMedico} / 2900 pts (Grau Médico: {res.grauDeficienciaMedico})</p>
          <p><strong>Pontuação da Assistente Social:</strong> {res.pontuacaoFuzzySocial} / 2900 pts (Grau Social: {res.grauDeficienciaSocial})</p>
          <p className="text-sm font-bold mt-1 text-black">
            SOMA DAS DUAS PONTUAÇÕES: {res.pontuacaoFuzzySoma} / 5800 pts (Equiv. 8200 pts: {res.pontuacaoNormalizada8200} pts)
          </p>
          <p className="text-sm font-bold mt-2">
            ENQUADRAMENTO FINAL UNIFICADO: DEFICIÊNCIA {res.grauDeficienciaFuzzySoma.toUpperCase()}
          </p>
        </div>

        <div className="border p-4 text-xs space-y-2">
          <h3 className="font-bold border-b pb-1">HISTÓRIA CLÍNICA E CONTEXTO SOCIAL</h3>
          <p><strong>Síntese Médica:</strong> {evalData.medico.historiaClinica}</p>
          <p><strong>Síntese Social:</strong> {evalData.assistenteSocial.historicoSocial}</p>
          <p><strong>Barreiras Ambientais:</strong> {evalData.assistenteSocial.fatoresAmbientaisBarreiras}</p>
        </div>

        {evalData.retificacoes && evalData.retificacoes.length > 0 && (
          <div className="border p-4 text-xs space-y-2 bg-slate-50">
            <h3 className="font-bold border-b pb-1">REGISTRO DE RETIFICAÇÕES TÉCNICAS</h3>
            {evalData.retificacoes.map((ret, idx) => (
              <p key={idx} className="text-[11px]">
                <strong>{new Date(ret.dataHora).toLocaleDateString('pt-BR')} - {ret.nomeProfissional} ({ret.documentoProfissional}):</strong> "{ret.justificativa}"
              </p>
            ))}
          </div>
        )}

        {/* ASSINATURAS OFICIAIS */}
        <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="border-t border-black pt-2 space-y-1">
            <p className="font-bold">{evalData.medico.nome || 'Médico Perito'}</p>
            <p>Médico Perito Oficial ({evalData.medico.crm || 'CRM'})</p>
            {evalData.medico?.assinaturaDigital?.assinado && (
              <p className="text-[10px] italic text-slate-700">
                [Assinado Eletronicamente em {new Date(evalData.medico.assinaturaDigital.dataHoraAssinatura).toLocaleString('pt-BR')}]
                <br />{evalData.medico.assinaturaDigital.hashAutenticacao}
              </p>
            )}
          </div>

          <div className="border-t border-black pt-2 space-y-1">
            <p className="font-bold">{evalData.assistenteSocial.nome || 'Assistente Social'}</p>
            <p>Assistente Social Pericial ({evalData.assistenteSocial.cress || 'CRESS'})</p>
            {evalData.assistenteSocial?.assinaturaDigital?.assinado && (
              <p className="text-[10px] italic text-slate-700">
                [Assinado Eletronicamente em {new Date(evalData.assistenteSocial.assinaturaDigital.dataHoraAssinatura).toLocaleString('pt-BR')}]
                <br />{evalData.assistenteSocial.assinaturaDigital.hashAutenticacao}
              </p>
            )}
          </div>
        </div>

        {evalData.homologadoRH && (
          <div className="border-t-2 border-dashed border-black pt-4 text-center text-xs space-y-1">
            <p className="font-bold uppercase">Homologação da Diretoria de Gestão de Pessoas (DGEP) &bull; Divisão de Saúde Ocupacional</p>
            <p>Laudo Biopsicossocial homologado para os devidos fins de direitos e enquadramentos funcionais.</p>
            <p className="text-[10px] italic text-slate-700">
              Homologado por: {evalData.responsavelHomologacao || 'Diretoria de Gestão de Pessoas (DGEP) / Divisão de Saúde Ocupacional'} em {evalData.dataHomologacao ? new Date(evalData.dataHomologacao).toLocaleString('pt-BR') : 'Data de homologação'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
