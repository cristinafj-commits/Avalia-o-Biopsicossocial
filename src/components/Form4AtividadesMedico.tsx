import React from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Info,
  Copy,
  Stethoscope
} from 'lucide-react';
import { AvaliacaoCompleta, PontuacaoIFBRA, AssinaturaEletronica } from '../types';
import { ATIVIDADES_IFBRA_DEF } from '../data/initialData';
import { ProcessoAdminBanner } from './ProcessoAdminBanner';
import { DigitalSignatureSection } from './DigitalSignatureSection';

interface Form4AtividadesMedicoProps {
  evalData: AvaliacaoCompleta;
  updateEval: (updater: (prev: AvaliacaoCompleta) => AvaliacaoCompleta) => void;
  onPrevTab?: () => void;
  onNextTab?: () => void;
}

export const Form4AtividadesMedico: React.FC<Form4AtividadesMedicoProps> = ({
  evalData,
  updateEval,
  onPrevTab,
  onNextTab
}) => {
  const atividadesMedico = evalData.atividadesMedico || evalData.atividades;
  const observacoesAtividadesMedico = evalData.observacoesAtividadesMedico || evalData.observacoesAtividades || {};

  const handleScoreChange = (activityId: string, score: PontuacaoIFBRA) => {
    updateEval(prev => {
      const updatedMedico = {
        ...(prev.atividadesMedico || prev.atividades),
        [activityId]: score
      };
      return {
        ...prev,
        atividadesMedico: updatedMedico,
        dataAtualizacao: new Date().toISOString()
      };
    });
  };

  const handleObsChange = (activityId: string, obs: string) => {
    updateEval(prev => {
      const updatedObs = {
        ...(prev.observacoesAtividadesMedico || prev.observacoesAtividades || {}),
        [activityId]: obs
      };
      return {
        ...prev,
        observacoesAtividadesMedico: updatedObs,
        dataAtualizacao: new Date().toISOString()
      };
    });
  };

  const handleCopyFromSocial = () => {
    if (!evalData.atividadesSocial && !evalData.atividades) return;
    updateEval(prev => {
      const copiedScores = { ...(prev.atividadesSocial || prev.atividades) };
      const copiedObs = { ...(prev.observacoesAtividadesSocial || prev.observacoesAtividades || {}) };
      return {
        ...prev,
        atividadesMedico: copiedScores,
        observacoesAtividadesMedico: copiedObs,
        dataAtualizacao: new Date().toISOString()
      };
    });
  };

  const handleDoctorSign = (assinatura: AssinaturaEletronica) => {
    updateEval(prev => ({
      ...prev,
      medico: {
        ...prev.medico,
        nome: assinatura.nomeSignatario,
        crm: assinatura.documentoProfissional,
        ufCrm: assinatura.uf,
        assinaturaMedico: `${assinatura.nomeSignatario} - ${assinatura.documentoProfissional}`,
        assinaturaDigital: assinatura,
        statusPreenchimento: 'assinado'
      },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const handleDoctorRevokeSignWithJustification = (justificativa: string) => {
    updateEval(prev => {
      const novaRetificacao = {
        id: 'ret_' + Date.now(),
        perfil: 'medico' as const,
        nomeProfissional: prev.medico.nome || 'Médico Perito',
        documentoProfissional: prev.medico.crm || 'CRM',
        dataHora: new Date().toISOString(),
        justificativa: justificativa
      };

      return {
        ...prev,
        medico: {
          ...prev.medico,
          statusPreenchimento: 'em_andamento',
          assinaturaDigital: undefined
        },
        retificacoes: [...(prev.retificacoes || []), novaRetificacao],
        dataAtualizacao: new Date().toISOString()
      };
    });
  };

  const handleDoctorUpdateInfo = (updates: { nome?: string; documento?: string; uf?: string; data?: string }) => {
    updateEval(prev => ({
      ...prev,
      medico: {
        ...prev.medico,
        nome: updates.nome !== undefined ? updates.nome : prev.medico.nome,
        crm: updates.documento !== undefined ? updates.documento : prev.medico.crm,
        ufCrm: updates.uf !== undefined ? updates.uf : prev.medico.ufCrm,
        dataAvaliacao: updates.data !== undefined ? updates.data : prev.medico.dataAvaliacao,
      },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const domains = [
    { code: 1, title: 'Domínio 1: Aprendizagem e Aplicação do Conhecimento' },
    { code: 2, title: 'Domínio 2: Comunicação' },
    { code: 3, title: 'Domínio 3: Mobilidade' },
    { code: 4, title: 'Domínio 4: Cuidados Pessoais' },
    { code: 5, title: 'Domínio 5: Vida Doméstica' },
    { code: 6, title: 'Domínio 6: Educação, Trabalho e Vida Econômica' },
    { code: 7, title: 'Domínio 7: Socialização e Vida Comunitária' },
  ];

  const pontuacaoOptions: { val: PontuacaoIFBRA; label: string; desc: string; color: string }[] = [
    { val: 100, label: '100 - Independente', desc: 'Realiza sem dependência nem auxílio', color: 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-400' },
    { val: 75, label: '75 - Alguma Dependência', desc: 'Realiza com auxílio parcial ou adaptação', color: 'border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-400' },
    { val: 50, label: '50 - Muita Dependência', desc: 'Realiza com supervisão constante/ajuda frequente', color: 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-400' },
    { val: 25, label: '25 - Dependência Total', desc: 'Não realiza ou depende totalmente de terceiros', color: 'border-red-500 bg-red-50 text-red-900 ring-1 ring-red-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* BANNER DO PROCESSO ADMINISTRATIVO DO RH */}
      {evalData.processoAdministrativo && (
        <ProcessoAdminBanner
          processo={evalData.processoAdministrativo}
          servidor={evalData.servidor}
          perfilAtual="Médico Perito"
        />
      )}

      {/* Banner de Apresentação */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shadow-sm">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Formulário 4
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Avaliação de Atividades e Participação (IF-BRA Médico)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pontuação das 29 atividades pelo Médico Perito para compor a pontuação unificada com o Serviço Social.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {(evalData.atividadesSocial || evalData.atividades) && (
            <button
              type="button"
              onClick={handleCopyFromSocial}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center space-x-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Notas da Assistente Social</span>
            </button>
          )}
        </div>
      </div>

      {/* GUIA DE PONTUAÇÃO IF-BRA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>Critérios de Pontuação do Índice de Funcionalidade Brasileiro (IF-BRA):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
            <span className="font-bold text-emerald-700 block text-sm mb-0.5">100 PONTOS</span>
            <span className="text-slate-700">Realiza a atividade sozinho de forma independente, sem limitação ou adaptação complexa.</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950">
            <span className="font-bold text-blue-700 block text-sm mb-0.5">75 PONTOS</span>
            <span className="text-slate-700">Realiza com alguma dependência, necessitando de adaptação, auxílio esporádico ou tempo adicional.</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
            <span className="font-bold text-amber-700 block text-sm mb-0.5">50 PONTOS</span>
            <span className="text-slate-700">Realiza com muita dependência, necessitando de supervisão constante ou apoio frequente.</span>
          </div>
          <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 text-red-950">
            <span className="font-bold text-red-700 block text-sm mb-0.5">25 PONTOS</span>
            <span className="text-slate-700">Não realiza a atividade ou depende totalmente de outra pessoa para sua execução.</span>
          </div>
        </div>
      </div>

      {/* 29 ATIVIDADES AGRUPADAS POR DOMÍNIOS */}
      {domains.map(dom => {
        const domainActivities = ATIVIDADES_IFBRA_DEF.filter(a => a.codigoDomain === dom.code);
        
        return (
          <section 
            key={dom.code} 
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {dom.title}
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-mono font-semibold">
                {domainActivities.length} Atividades
              </span>
            </div>

            <div className="space-y-4">
              {domainActivities.map(act => {
                const currentScore = atividadesMedico[act.id] ?? 100;
                const obsText = observacoesAtividadesMedico[act.id] || '';

                return (
                  <div 
                    key={act.id} 
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                            {act.id}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {act.nome}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                          {act.descricao}
                        </p>
                      </div>

                      <div className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-200 text-slate-800 self-start sm:self-auto shrink-0">
                        Nota: {currentScore} pts
                      </div>
                    </div>

                    {/* Radio Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                      {pontuacaoOptions.map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => handleScoreChange(act.id, opt.val)}
                          className={`text-left p-3 rounded-xl border text-xs font-medium transition flex flex-col justify-between cursor-pointer ${
                            currentScore === opt.val
                              ? `${opt.color} shadow-xs font-bold border-2`
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">{opt.label}</span>
                            {currentScore === opt.val && (
                              <CheckCircle2 className="w-4 h-4 text-current shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] opacity-80 font-normal leading-tight">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Observação Específica por Atividade */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={obsText}
                        onChange={e => handleObsChange(act.id, e.target.value)}
                        placeholder="Observações clínicas / periciais para esta atividade (opcional)..."
                        className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-2xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* SEÇÃO DE ASSINATURA ELETRÔNICA DO MÉDICO PERITO */}
      <DigitalSignatureSection
        role="medico"
        nome={evalData.medico.nome}
        documento={evalData.medico.crm}
        uf={evalData.medico.ufCrm || 'PR'}
        dataAvaliacao={evalData.medico.dataAvaliacao}
        assinaturaDigital={evalData.medico.assinaturaDigital}
        statusPreenchimento={evalData.medico.statusPreenchimento}
        retificacoes={evalData.retificacoes}
        onSign={handleDoctorSign}
        onRevokeSignWithJustification={handleDoctorRevokeSignWithJustification}
        onUpdateInfo={handleDoctorUpdateInfo}
      />

      {/* Navegação Inferior */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {onPrevTab ? (
          <button
            type="button"
            onClick={onPrevTab}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar: Formulário 3 (FuzziMed)</span>
          </button>
        ) : <div />}

        {onNextTab && (
          <button
            type="button"
            onClick={onNextTab}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            <span>Avançar para Formulário Social (Serviço Social)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
