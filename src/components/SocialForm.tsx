import React from 'react';
import { 
  Users, 
  HelpCircle, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Info,
  Copy,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { AvaliacaoCompleta, PontuacaoIFBRA, AssinaturaEletronica } from '../types';
import { ATIVIDADES_IFBRA_DEF } from '../data/initialData';
import { ProcessoAdminBanner } from './ProcessoAdminBanner';
import { DigitalSignatureSection } from './DigitalSignatureSection';

interface SocialFormProps {
  evalData: AvaliacaoCompleta;
  updateEval: (updater: (prev: AvaliacaoCompleta) => AvaliacaoCompleta) => void;
  onPrevTab?: () => void;
  onNextTab?: () => void;
  onBackToQueue?: () => void;
}

export const SocialForm: React.FC<SocialFormProps> = ({ 
  evalData, 
  updateEval,
  onPrevTab,
  onNextTab,
  onBackToQueue
}) => {
  const { assistenteSocial, atividades, atividadesSocial = atividades, observacoesAtividadesSocial = evalData.observacoesAtividades || {} } = evalData;

  const handleSocialChange = (field: keyof typeof assistenteSocial, value: string) => {
    updateEval(prev => ({
      ...prev,
      assistenteSocial: { ...prev.assistenteSocial, [field]: value },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const handleScoreChange = (activityId: string, score: PontuacaoIFBRA) => {
    updateEval(prev => {
      const updatedSocial = {
        ...(prev.atividadesSocial || prev.atividades),
        [activityId]: score
      };
      return {
        ...prev,
        atividadesSocial: updatedSocial,
        atividades: updatedSocial, // fallback sync
        dataAtualizacao: new Date().toISOString()
      };
    });
  };

  const handleObsChange = (activityId: string, obs: string) => {
    updateEval(prev => {
      const updatedObs = {
        ...(prev.observacoesAtividadesSocial || prev.observacoesAtividades || {}),
        [activityId]: obs
      };
      return {
        ...prev,
        observacoesAtividadesSocial: updatedObs,
        observacoesAtividades: updatedObs, // fallback sync
        dataAtualizacao: new Date().toISOString()
      };
    });
  };

  const handleCopyFromMedico = () => {
    if (!evalData.atividadesMedico) return;
    updateEval(prev => {
      const copiedScores = { ...prev.atividadesMedico };
      const copiedObs = { ...(prev.observacoesAtividadesMedico || {}) };
      return {
        ...prev,
        atividadesSocial: copiedScores,
        atividades: copiedScores,
        observacoesAtividadesSocial: copiedObs,
        observacoesAtividades: copiedObs,
        dataAtualizacao: new Date().toISOString()
      };
    });
  };

  const handleSocialSign = (assinatura: AssinaturaEletronica) => {
    updateEval(prev => ({
      ...prev,
      assistenteSocial: {
        ...prev.assistenteSocial,
        nome: assinatura.nomeSignatario,
        cress: assinatura.documentoProfissional,
        ufCress: assinatura.uf,
        assinaturaSocial: `${assinatura.nomeSignatario} - ${assinatura.documentoProfissional}`,
        assinaturaDigital: assinatura,
        statusPreenchimento: 'assinado'
      },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const handleSocialRevokeSignWithJustification = (justificativa: string) => {
    updateEval(prev => {
      const novaRetificacao = {
        id: 'ret_' + Date.now(),
        perfil: 'social' as const,
        nomeProfissional: prev.assistenteSocial.nome || 'Assistente Social',
        documentoProfissional: prev.assistenteSocial.cress || 'CRESS',
        dataHora: new Date().toISOString(),
        justificativa: justificativa
      };

      return {
        ...prev,
        assistenteSocial: {
          ...prev.assistenteSocial,
          statusPreenchimento: 'em_andamento',
          assinaturaDigital: undefined
        },
        retificacoes: [...(prev.retificacoes || []), novaRetificacao],
        dataAtualizacao: new Date().toISOString()
      };
    });
  };

  const handleSocialUpdateInfo = (updates: { nome?: string; documento?: string; uf?: string; data?: string }) => {
    updateEval(prev => ({
      ...prev,
      assistenteSocial: {
        ...prev.assistenteSocial,
        nome: updates.nome !== undefined ? updates.nome : prev.assistenteSocial.nome,
        cress: updates.documento !== undefined ? updates.documento : prev.assistenteSocial.cress,
        ufCress: updates.uf !== undefined ? updates.uf : prev.assistenteSocial.ufCress,
        dataAvaliacao: updates.data !== undefined ? updates.data : prev.assistenteSocial.dataAvaliacao,
      },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  // Group activities by Domain (1 to 7)
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
          perfilAtual="Assistente Social"
        />
      )}

      {/* Intro Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-sky-600 shadow-sm">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                Formulário Social
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Módulo do Serviço Social (IF-BRA Social & Barreiras)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Avalie o nível de independência do servidor nas 29 atividades dos 7 domínios sob a perspectiva social e analise as barreiras ambientais.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onBackToQueue && (
            <button
              type="button"
              onClick={onBackToQueue}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-950 border border-sky-200 hover:bg-sky-100 transition flex items-center space-x-1 cursor-pointer"
            >
              <span>← Fila de Avaliações</span>
            </button>
          )}

          {evalData.atividadesMedico && (
            <button
              type="button"
              onClick={handleCopyFromMedico}
              className="text-xs bg-sky-600 hover:bg-sky-700 text-white font-semibold px-3.5 py-2 rounded-xl transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar notas do Médico Perito</span>
            </button>
          )}
        </div>
      </div>

      {/* DADOS DA ASSISTENTE SOCIAL */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <Users className="w-5 h-5 text-sky-600" />
          <h3 className="text-base font-bold text-slate-900">
            Identificação da Assistente Social Avaliadora
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nome da Assistente Social
            </label>
            <input
              type="text"
              value={assistenteSocial.nome}
              onChange={e => handleSocialChange('nome', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-xs"
              placeholder="Nome da Assistente Social"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              CRESS
            </label>
            <input
              type="text"
              value={assistenteSocial.cress}
              onChange={e => handleSocialChange('cress', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-xs"
              placeholder="CRESS/UF 00000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Data da Avaliação Social
            </label>
            <input
              type="date"
              value={assistenteSocial.dataAvaliacao}
              onChange={e => handleSocialChange('dataAvaliacao', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* GUIA DE PONTUAÇÃO IF-BRA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Info className="w-4 h-4 text-sky-600" />
          <span>Critérios de Pontuação do Índice de Funcionalidade Brasileiro (IF-BRA Social):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
            <span className="font-bold text-emerald-700 block text-sm mb-0.5">100 PONTOS</span>
            <span className="text-slate-700">Realiza a atividade sozinho de forma independente, sem limitação.</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950">
            <span className="font-bold text-blue-700 block text-sm mb-0.5">75 PONTOS</span>
            <span className="text-slate-700">Realiza com alguma dependência, necessitando de adaptação ou auxílio esporádico.</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
            <span className="font-bold text-amber-700 block text-sm mb-0.5">50 PONTOS</span>
            <span className="text-slate-700">Realiza com muita dependência, supervisão constante ou apoio frequente.</span>
          </div>
          <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 text-red-950">
            <span className="font-bold text-red-700 block text-sm mb-0.5">25 PONTOS</span>
            <span className="text-slate-700">Não realiza a atividade ou depende totalmente de outra pessoa.</span>
          </div>
        </div>
      </div>

      {/* 29 ATIVIDADES AGRUPADAS POR DOMÍNIOS */}
      {domains.map(dom => {
        const domainActivities = ATIVIDADES_IFBRA_DEF.filter(a => a.codigoDomain === dom.code);
        
        return (
          <section key={dom.code} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
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
                const currentScore = atividadesSocial[act.id] ?? 100;
                const obsText = observacoesAtividadesSocial[act.id] || '';

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

                    {/* Optional Observation per Activity */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={obsText}
                        onChange={e => handleObsChange(act.id, e.target.value)}
                        placeholder="Observações do Serviço Social para esta atividade (opcional)..."
                        className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-2xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* CONTEXTO SOCIAL, BARREIRAS E ASSINATURA */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3 mb-3">
            <ShieldAlert className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">
              Fatores Ambientais, Barreiras e Apoio Familiar
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Descreva barreiras arquitetônicas, atitudinais, de transporte ou falta de apoio social/familiar que agravam a limitação de participação.
          </p>
          <textarea
            rows={3}
            value={assistenteSocial.fatoresAmbientaisBarreiras}
            onChange={e => handleSocialChange('fatoresAmbientaisBarreiras', e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 bg-white p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-xs leading-relaxed"
            placeholder="Descreva barreiras ambientais, acessibilidade nos ambientes e grau de suporte familiar..."
          />
        </div>

        <div>
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3 mb-3">
            <FileText className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">
              Parecer e Histórico Social
            </h3>
          </div>
          <textarea
            rows={4}
            value={assistenteSocial.historicoSocial}
            onChange={e => handleSocialChange('historicoSocial', e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 bg-white p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-xs leading-relaxed"
            placeholder="Relato detalhado da entrevista social, habitação, dinâmica familiar e vivência comunitária..."
          />
        </div>
      </section>

      {/* SEÇÃO DE ASSINATURA ELETRÔNICA DO SERVIÇO SOCIAL */}
      <DigitalSignatureSection
        role="social"
        nome={assistenteSocial.nome}
        documento={assistenteSocial.cress}
        uf={assistenteSocial.ufCress || 'PR'}
        dataAvaliacao={assistenteSocial.dataAvaliacao}
        assinaturaDigital={assistenteSocial.assinaturaDigital}
        statusPreenchimento={assistenteSocial.statusPreenchimento}
        retificacoes={evalData.retificacoes}
        onSign={handleSocialSign}
        onRevokeSignWithJustification={handleSocialRevokeSignWithJustification}
        onUpdateInfo={handleSocialUpdateInfo}
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
            <span>Voltar: Formulário 4 (IF-BRA Médico)</span>
          </button>
        ) : <div />}

        {onNextTab && (
          <button
            type="button"
            onClick={onNextTab}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            <span>Ver Laudo Consolidado (Fuzzy)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
