import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  CheckCircle2, 
  Lock, 
  RotateCcw, 
  Calendar, 
  Award, 
  AlertCircle,
  FileEdit,
  History,
  X
} from 'lucide-react';
import { AssinaturaEletronica, StatusProfissional, RetificacaoRegistro } from '../types';

interface DigitalSignatureSectionProps {
  role: 'medico' | 'social';
  nome: string;
  documento: string; // CRM or CRESS
  uf?: string;
  dataAvaliacao: string;
  assinaturaDigital?: AssinaturaEletronica;
  statusPreenchimento?: StatusProfissional;
  retificacoes?: RetificacaoRegistro[];
  onSign: (assinatura: AssinaturaEletronica) => void;
  onRevokeSignWithJustification: (justificativa: string) => void;
  onUpdateInfo: (updates: { nome?: string; documento?: string; uf?: string; data?: string }) => void;
}

export const DigitalSignatureSection: React.FC<DigitalSignatureSectionProps> = ({
  role,
  nome,
  documento,
  uf = 'PR',
  dataAvaliacao,
  assinaturaDigital,
  statusPreenchimento,
  retificacoes = [],
  onSign,
  onRevokeSignWithJustification,
  onUpdateInfo
}) => {
  const isDoctor = role === 'medico';
  const roleTitle = isDoctor ? 'Médico Perito Oficial' : 'Assistente Social Pericial';
  const docLabel = isDoctor ? 'CRM' : 'CRESS';
  const docPlaceholder = isDoctor ? 'CRM/PR 00.000' : 'CRESS/PR 0.000';
  const isSigned = statusPreenchimento === 'assinado' || Boolean(assinaturaDigital?.assinado);

  const [acceptedTerm, setAcceptedTerm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal de Justificativa de Retificação
  const [showRetificacaoModal, setShowRetificacaoModal] = useState(false);
  const [justificativaTexto, setJustificativaTexto] = useState('');
  const [modalError, setModalError] = useState('');

  // Retificações filtradas deste papel
  const roleRetificacoes = retificacoes.filter(r => r.perfil === role);

  const handlePerformSign = () => {
    if (!nome.trim()) {
      setErrorMsg(`Informe o nome completo do ${isDoctor ? 'médico' : 'assistente social'}.`);
      return;
    }
    if (!documento.trim()) {
      setErrorMsg(`Informe o número do ${docLabel}.`);
      return;
    }
    if (!acceptedTerm) {
      setErrorMsg('Você precisa marcar a declaração de responsabilidade técnica antes de assinar.');
      return;
    }

    setErrorMsg('');
    const now = new Date();
    const hash = 'SHA256:' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');

    const newSignature: AssinaturaEletronica = {
      assinado: true,
      nomeSignatario: nome.trim(),
      documentoProfissional: documento.trim(),
      uf: uf,
      dataHoraAssinatura: now.toISOString(),
      hashAutenticacao: hash,
      cargoFuncao: roleTitle
    };

    onSign(newSignature);
  };

  const handleConfirmRetificacao = () => {
    if (!justificativaTexto.trim() || justificativaTexto.trim().length < 15) {
      setModalError('A justificativa técnica de retificação é obrigatória e deve ter pelo menos 15 caracteres.');
      return;
    }

    onRevokeSignWithJustification(justificativaTexto.trim());
    setJustificativaTexto('');
    setModalError('');
    setShowRetificacaoModal(false);
  };

  return (
    <section className={`border rounded-2xl p-6 shadow-sm transition ${
      isSigned 
        ? 'bg-emerald-50/50 border-emerald-300' 
        : isDoctor 
          ? 'bg-emerald-50/20 border-emerald-200' 
          : 'bg-sky-50/20 border-sky-200'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${
            isSigned 
              ? 'bg-emerald-600 text-white' 
              : isDoctor 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-sky-100 text-sky-800'
          }`}>
            {isSigned ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Assinatura Pericial Digital
              </span>
              {isSigned && (
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Documento Assinado e Concluído</span>
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Assinatura Eletrônica do(a) {roleTitle}
            </h3>
          </div>
        </div>

        {isSigned && (
          <button
            type="button"
            onClick={() => {
              setJustificativaTexto('');
              setModalError('');
              setShowRetificacaoModal(true);
            }}
            className="text-xs font-bold px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Exige justificativa formal para reabertura de formulário pericial assinado"
          >
            <FileEdit className="w-3.5 h-3.5 text-amber-700" />
            <span>Solicitar Retificação Técnica</span>
          </button>
        )}
      </div>

      {isSigned ? (
        /* ASSINATURA CONCLUÍDA */
        <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Signatário(a):</span>
              <div className="text-sm font-bold text-slate-900">
                {assinaturaDigital?.nomeSignatario || nome}
              </div>
              <div className="text-slate-600">
                {docLabel}: <strong>{assinaturaDigital?.documentoProfissional || documento}</strong> &bull; {assinaturaDigital?.cargoFuncao || roleTitle}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-slate-500 font-medium">Data e Hora da Assinatura:</span>
              <div className="font-semibold text-slate-800">
                {assinaturaDigital?.dataHoraAssinatura ? new Date(assinaturaDigital.dataHoraAssinatura).toLocaleString('pt-BR') : 'Data registrada'}
              </div>
              <div className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                {assinaturaDigital?.hashAutenticacao || 'SHA256:AUTHENTICATED-PERICIAL-SEAL'}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-emerald-900 bg-emerald-50/80 p-3 rounded-lg border border-emerald-200/80 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Avaliação do {isDoctor ? 'Médico Perito' : 'Serviço Social'} finalizada e congelada para evitar contaminação. Se for necessário alterar notas ou parecer, utilize o botão <strong>Solicitar Retificação Técnica</strong> acima.
            </span>
          </div>

          {/* HISTÓRICO DE RETIFICAÇÕES TÉCNICAS */}
          {roleRetificacoes.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Histórico de Retificações Registradas ({roleRetificacoes.length}):</span>
              </div>
              <div className="space-y-2">
                {roleRetificacoes.map((ret, idx) => (
                  <div key={ret.id || idx} className="bg-amber-50/60 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-950">
                    <div className="flex justify-between items-center text-[11px] text-amber-800 font-semibold mb-1">
                      <span>Retificação #{idx + 1} por {ret.nomeProfissional} ({ret.documentoProfissional})</span>
                      <span>{new Date(ret.dataHora).toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 italic">
                      "{ret.justificativa}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* FORMULÁRIO DE ASSINATURA PENDENTE */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do(a) {isDoctor ? 'Médico(a) Perito(a)' : 'Assistente Social'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={e => onUpdateInfo({ nome: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                placeholder="Nome Completo do Profissional"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registro Profissional ({docLabel}) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={documento}
                onChange={e => onUpdateInfo({ documento: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                placeholder={docPlaceholder}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data da Perícia
              </label>
              <input
                type="date"
                value={dataAvaliacao}
                onChange={e => onUpdateInfo({ data: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* TERMO DE DECLARAÇÃO E RESPONSABILIDADE ÉTICA */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-slate-900">
              Declaração de Responsabilidade Técnica e Pericial:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isDoctor 
                ? 'Declaro que realizei a avaliação pericial médica do(a) servidor(a), procedendo ao exame clínico, análise de documentos médicos e pontuação do IF-BRA em estrita observância à Lei Federal nº 13.146/2015 e às normas do Conselho Federal de Medicina (CFM).'
                : 'Declaro que realizei a avaliação social do(a) servidor(a), procedendo à entrevista, análise do contexto sociofamiliar, barreiras ambientais e pontuação do IF-BRA em estrita observância à Lei Federal nº 13.146/2015 e às normas do Conselho Federal de Serviço Social (CFESS).'}
            </p>

            <label className="flex items-start space-x-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerm}
                onChange={e => setAcceptedTerm(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-xs font-medium text-slate-800">
                Confirmo a veracidade das informações e aprovo as pontuações registradas neste módulo pericial.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handlePerformSign}
              className={`text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer ${
                isDoctor 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isDoctor ? 'Assinar e Concluir Perícia Médica' : 'Assinar e Concluir Perícia Social'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE JUSTIFICATIVA FORMAL DE RETIFICAÇÃO */}
      {showRetificacaoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
                <FileEdit className="w-5 h-5" />
                <span>Justificativa de Retificação Pericial</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRetificacaoModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                A reabertura de uma avaliação pericial assinada requer registro formal e fundamentado do motivo técnico para auditoria da Comissão Biopsicossocial e Gestão de Pessoas.
              </p>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                <strong>Profissional Solicitante:</strong> {nome || 'Profissional'} ({docLabel}: {documento || '---'})
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Motivo / Fundamentação Técnica da Retificação: <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={justificativaTexto}
                onChange={e => setJustificativaTexto(e.target.value)}
                placeholder="Exemplo: Retificação solicitada para inclusão de laudo complementar de audiometria apresentado pelo servidor e reavaliação do Domínio 1 (Comunicação)..."
                className="w-full text-xs rounded-xl border border-slate-300 p-3 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400">Mínimo de 15 caracteres.</span>
            </div>

            {modalError && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRetificacaoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRetificacao}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Registrar Justificativa e Reabrir</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
