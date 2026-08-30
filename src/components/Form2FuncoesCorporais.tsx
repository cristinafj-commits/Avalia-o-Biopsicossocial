import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Info
} from 'lucide-react';
import { AvaliacaoCompleta } from '../types';
import { FUNCOES_CIF_DEF } from '../data/initialData';

interface Form2FuncoesCorporaisProps {
  evalData: AvaliacaoCompleta;
  updateEval: (updater: (prev: AvaliacaoCompleta) => AvaliacaoCompleta) => void;
  onPrevTab?: () => void;
  onNextTab?: () => void;
}

export const Form2FuncoesCorporais: React.FC<Form2FuncoesCorporaisProps> = ({
  evalData,
  updateEval,
  onPrevTab,
  onNextTab
}) => {
  const { funcoesCorporais } = evalData;

  const handleFuncaoCorporalToggle = (key: keyof typeof funcoesCorporais) => {
    updateEval(prev => ({
      ...prev,
      funcoesCorporais: {
        ...prev.funcoesCorporais,
        [key]: !prev.funcoesCorporais[key]
      },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const totalAcometidas = Object.values(funcoesCorporais).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Banner de Apresentação */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 shadow-sm">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                Formulário 2
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Funções Corporais Acometidas (CIF)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Assinale nas caixas de seleção as funções e estruturas do corpo com acometimento anatômico ou fisiológico constatado na perícia médica.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 shadow-xs flex items-center space-x-2">
            <span>Acometidas:</span>
            <span className="bg-amber-500 text-white px-2 py-0.5 rounded-md font-mono text-xs">
              {totalAcometidas} de 20
            </span>
          </div>
        </div>
      </div>

      {/* Orientação Rápida */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-slate-700 text-xs sm:text-sm flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          As opções estão organizadas em <strong>8 capítulos da Classificação Internacional de Funcionalidade (CIF)</strong>. Clique diretamente na caixa ou no cartão correspondente à condição diagnosticada para marcá-la.
        </p>
      </div>

      {/* LISTA VERTICAL (UMA ABAIXO DA OUTRA) POR CAPÍTULO */}
      <div className="space-y-6">
        {FUNCOES_CIF_DEF.map(cat => (
          <section 
            key={cat.numero} 
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
          >
            {/* Cabeçalho do Capítulo */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {cat.titulo}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                {cat.itens.length} {cat.itens.length === 1 ? 'função' : 'funções'}
              </span>
            </div>

            {/* Itens listados verticalmente (um abaixo do outro) com fonte ampliada */}
            <div className="flex flex-col space-y-3">
              {cat.itens.map(func => {
                const isChecked = !!funcoesCorporais[func.key as keyof typeof funcoesCorporais];

                return (
                  <label
                    key={func.key}
                    onClick={() => handleFuncaoCorporalToggle(func.key as keyof typeof funcoesCorporais)}
                    className={`flex items-start space-x-4 p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-amber-50/70 border-amber-400 shadow-xs ring-1 ring-amber-400/50'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Checkbox Amplo */}
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                      />
                    </div>

                    {/* Texto com Letra Ampliada */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm sm:text-base font-bold block ${
                          isChecked ? 'text-amber-950' : 'text-slate-900'
                        }`}>
                          {func.nome}
                        </span>
                        {isChecked && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md flex items-center space-x-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Acometida</span>
                          </span>
                        )}
                      </div>

                      <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${
                        isChecked ? 'text-slate-700' : 'text-slate-600'
                      }`}>
                        {func.descricao}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
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
            <span>Voltar: Formulário 1</span>
          </button>
        ) : <div />}

        {onNextTab && (
          <button
            type="button"
            onClick={onNextTab}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            <span>Avançar para Formulário 3 (FuzziMed)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
