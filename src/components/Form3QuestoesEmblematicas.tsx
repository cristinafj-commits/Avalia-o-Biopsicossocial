import React from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { AvaliacaoCompleta } from '../types';

interface Form3QuestoesEmblematicasProps {
  evalData: AvaliacaoCompleta;
  updateEval: (updater: (prev: AvaliacaoCompleta) => AvaliacaoCompleta) => void;
  onPrevTab?: () => void;
  onNextTab?: () => void;
}

export const Form3QuestoesEmblematicas: React.FC<Form3QuestoesEmblematicasProps> = ({
  evalData,
  updateEval,
  onPrevTab,
  onNextTab
}) => {
  const { tiposDeficiencia, questoesEmblematicas } = evalData;

  const handleFuzzyToggle = (key: keyof typeof questoesEmblematicas, val: boolean | null) => {
    updateEval(prev => ({
      ...prev,
      questoesEmblematicas: {
        ...prev.questoesEmblematicas,
        [key]: val
      },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const sections = [
    {
      typeKey: 'auditiva' as const,
      typeName: 'Deficiência Auditiva',
      subtitle: 'Comunicação e Socialização',
      qEmblematicaKey: 'auditivaSurdezAntes6Anos' as const,
      qEmblematicaLabel: 'Questão Emblemática: A surdez ocorreu antes dos 6 anos de idade (congênita ou adquirida precocemente)?',
      qAuxilioKey: 'auditivaSemAuxilioTerceiros' as const,
      qAuxilioLabel: 'Requisito de Auxílio: Não dispõe de auxílio de terceiros ou intérprete sempre que necessário?',
      impactText: 'Se confirmado (SIM para ambas), as atividades dos domínios de Comunicação e Socialização têm a pontuação ajustada para refletir a barreira linguística precoce.'
    },
    {
      typeKey: 'intelectualCognitiva' as const,
      typeName: 'Deficiência Intelectual / Cognitiva / TEA',
      subtitle: 'Vida Doméstica e Socialização',
      qEmblematicaKey: 'intelectualNaoFicaSozinhoSeguranca' as const,
      qEmblematicaLabel: 'Questão Emblemática: O avaliado não pode permanecer sozinho por risco à própria segurança física ou integridade?',
      qAuxilioKey: 'intelectualSemAuxilioTerceiros' as const,
      qAuxilioLabel: 'Requisito de Auxílio: Não dispõe de cuidador ou supervisão de terceiros contínua?',
      impactText: 'Se confirmado (SIM para ambas), atividades de Aprendizagem, Vida Doméstica e Socialização são ajustadas com o teto protetivo.'
    },
    {
      typeKey: 'motora' as const,
      typeName: 'Deficiência Física / Motora',
      subtitle: 'Mobilidade e Cuidados Pessoais',
      qEmblematicaKey: 'motoraCadeiraDeRodasExclusiva' as const,
      qEmblematicaLabel: 'Questão Emblemática: Desloca-se exclusivamente em cadeira de rodas para locomoção diária?',
      qAuxilioKey: 'motoraSemAuxilioTerceiros' as const,
      qAuxilioLabel: 'Requisito de Auxílio: Não dispõe de cuidador ou auxílio de terceiros para transferências e deslocamentos?',
      impactText: 'Se confirmado (SIM para ambas), as atividades de Mobilidade e Cuidados Pessoais recebem o teto protetivo da regra Fuzzy.'
    },
    {
      typeKey: 'visual' as const,
      typeName: 'Deficiência Visual',
      subtitle: 'Comunicação e Mobilidade',
      qEmblematicaKey: 'visualNaoEnxergavaAoNascer' as const,
      qEmblematicaLabel: 'Questão Emblemática: A cegueira ou baixa visão profunda ocorreu desde o nascimento (congênita)?',
      qAuxilioKey: 'visualSemAuxilioTerceiros' as const,
      qAuxilioLabel: 'Requisito de Auxílio: Não dispõe de guia vidente, leitor ou cão-guia sempre que necessário?',
      impactText: 'Se confirmado (SIM para ambas), os domínios de Comunicação e Mobilidade são ajustados conforme o algoritmo protetivo IF-BRA.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Banner de Apresentação */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600 shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                Formulário 3
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Questões Emblemáticas (FuzziMed)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Critérios qualificadores especiais do Modelo Fuzzy que ajustam a pontuação das atividades nos domínios mais vulneráveis.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
          Etapa 3 de 5 (Preenchimento)
        </div>
      </div>

      {/* Explicação do Modelo Fuzzy */}
      <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-4 text-slate-700 text-xs sm:text-sm flex items-start space-x-3">
        <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-purple-950">
            Como funciona a Regra Protetiva Fuzzy?
          </p>
          <p className="text-slate-600 leading-relaxed">
            Quando o servidor apresenta uma situação emblemática grave (ex.: surdez precoce, cadeira de rodas exclusiva, risco à integridade) e não dispõe do apoio necessário, o algoritmo IF-BRA aplica um limite máximo (teto de pontuação de 25 ou 50 pts) nas atividades dos domínios correspondentes, garantindo que o laudo reflita a severidade real do impedimento.
          </p>
        </div>
      </div>

      {/* 4 QUADROS DE QUESTÕES EMBLEMÁTICAS */}
      <div className="space-y-5">
        {sections.map(sec => {
          const isActive = tiposDeficiencia[sec.typeKey];
          const valEmblematica = questoesEmblematicas[sec.qEmblematicaKey];
          const valAuxilio = questoesEmblematicas[sec.qAuxilioKey];
          const isFuzzyApplied = isActive && valEmblematica === true && valAuxilio === true;

          return (
            <section
              key={sec.typeKey}
              className={`rounded-2xl border transition-all p-5 sm:p-6 ${
                isActive
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-purple-600' : 'bg-slate-300'}`} />
                  <h3 className="text-base font-bold text-slate-900">
                    {sec.typeName}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    — Domínios de {sec.subtitle}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {!isActive ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-slate-600">
                      Não assinalada no Formulário 1
                    </span>
                  ) : isFuzzyApplied ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fuzzy Ativado (Ajuste Protetivo)</span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                      Avaliação Padrão
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Pergunta 1: Questão Emblemática */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    {sec.qEmblematicaLabel}
                  </p>
                  <div className="flex items-center space-x-3">
                    {[
                      { label: 'SIM', val: true },
                      { label: 'NÃO', val: false },
                      { label: 'NÃO AVALIADO', val: null },
                    ].map(opt => (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={!isActive}
                        onClick={() => handleFuzzyToggle(sec.qEmblematicaKey, opt.val)}
                        className={`text-xs px-4 py-2 rounded-lg font-bold border transition ${
                          valEmblematica === opt.val
                            ? opt.val === true 
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-slate-700 text-white border-slate-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        } ${!isActive ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pergunta 2: Requisito de Auxílio */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    {sec.qAuxilioLabel}
                  </p>
                  <div className="flex items-center space-x-3">
                    {[
                      { label: 'SIM', val: true },
                      { label: 'NÃO', val: false },
                      { label: 'NÃO AVALIADO', val: null },
                    ].map(opt => (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={!isActive}
                        onClick={() => handleFuzzyToggle(sec.qAuxilioKey, opt.val)}
                        className={`text-xs px-4 py-2 rounded-lg font-bold border transition ${
                          valAuxilio === opt.val
                            ? opt.val === true 
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-slate-700 text-white border-slate-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        } ${!isActive ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Texto de Impacto */}
                <p className="text-xs text-slate-500 italic pl-1">
                  💡 {sec.impactText}
                </p>
              </div>
            </section>
          );
        })}
      </div>

      {/* Navegação Inferior */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {onPrevTab ? (
          <button
            type="button"
            onClick={onPrevTab}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar: Formulário 2 (CIF)</span>
          </button>
        ) : <div />}

        {onNextTab && (
          <button
            type="button"
            onClick={onNextTab}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            <span>Avançar para Formulário 4 (IF-BRA Médico)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
