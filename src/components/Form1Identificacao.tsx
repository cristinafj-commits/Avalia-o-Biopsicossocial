import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  Activity, 
  AlertCircle, 
  FileText, 
  Search, 
  Building2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AvaliacaoCompleta } from '../types';
import { CIDS_FREQUENTES } from '../data/initialData';
import { ProcessoAdminBanner } from './ProcessoAdminBanner';

interface Form1IdentificacaoProps {
  evalData: AvaliacaoCompleta;
  updateEval: (updater: (prev: AvaliacaoCompleta) => AvaliacaoCompleta) => void;
  onNextTab?: () => void;
  onBackToQueue?: () => void;
}

export const Form1Identificacao: React.FC<Form1IdentificacaoProps> = ({
  evalData,
  updateEval,
  onNextTab,
  onBackToQueue
}) => {
  const { servidor, medico, tiposDeficiencia, processoAdministrativo } = evalData;
  const [cidSearch, setCidSearch] = useState('');

  const handleServidorChange = (field: keyof typeof servidor, value: string) => {
    updateEval(prev => ({
      ...prev,
      servidor: { ...prev.servidor, [field]: value },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const handleMedicoChange = (field: keyof typeof medico, value: any) => {
    updateEval(prev => ({
      ...prev,
      medico: { ...prev.medico, [field]: value },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const handleTipoDeficienciaToggle = (key: keyof typeof tiposDeficiencia) => {
    updateEval(prev => ({
      ...prev,
      tiposDeficiencia: {
        ...prev.tiposDeficiencia,
        [key]: !prev.tiposDeficiencia[key]
      },
      dataAtualizacao: new Date().toISOString()
    }));
  };

  const filteredCids = CIDS_FREQUENTES.filter(c => 
    c.code.toLowerCase().includes(cidSearch.toLowerCase()) ||
    c.description.toLowerCase().includes(cidSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* BANNER DO PROCESSO ADMINISTRATIVO DO RH */}
      {processoAdministrativo && (
        <ProcessoAdminBanner
          processo={processoAdministrativo}
          servidor={servidor}
          perfilAtual="Médico Perito"
        />
      )}

      {/* Banner de Apresentação */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shadow-sm">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Formulário 1
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Dados do Servidor e Perícia Médica
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Preencha a identificação funcional do avaliado, os dados do médico perito, diagnóstico clínico e tipos de deficiência.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onBackToQueue && (
            <button
              type="button"
              onClick={onBackToQueue}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition flex items-center space-x-1 cursor-pointer"
            >
              <span>← Fila de Perícias</span>
            </button>
          )}
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            Etapa 1 de 5 (Preenchimento)
          </div>
        </div>
      </div>

      {/* 1. DADOS DO SERVIDOR */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <User className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            1.1 Identificação do(a) Servidor(a) Avaliado(a)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={servidor.nome}
              onChange={e => handleServidorChange('nome', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="Ex.: João da Silva Santos"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              CPF <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={servidor.cpf}
              onChange={e => handleServidorChange('cpf', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              RG
            </label>
            <input
              type="text"
              value={servidor.rg}
              onChange={e => handleServidorChange('rg', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="00.000.000-0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Idade
            </label>
            <input
              type="text"
              value={servidor.idade}
              onChange={e => handleServidorChange('idade', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="Ex.: 42 anos"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sexo
            </label>
            <select
              value={servidor.sexo}
              onChange={e => handleServidorChange('sexo', e.target.value as any)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Matrícula Funcional
            </label>
            <input
              type="text"
              value={servidor.matricula}
              onChange={e => handleServidorChange('matricula', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="Ex.: 123456"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cargo / Função
            </label>
            <input
              type="text"
              value={servidor.cargo}
              onChange={e => handleServidorChange('cargo', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="Ex.: Analista Judiciário"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Data de Admissão
            </label>
            <input
              type="date"
              value={servidor.dataAdmissao}
              onChange={e => handleServidorChange('dataAdmissao', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* 2. DADOS DO MÉDICO PERITO */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <Stethoscope className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            1.2 Dados do Médico Avaliador & Local da Perícia
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nome do Médico Perito
            </label>
            <input
              type="text"
              value={medico.nome}
              onChange={e => handleMedicoChange('nome', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="Dr(a). ..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              CRM
            </label>
            <input
              type="text"
              value={medico.crm}
              onChange={e => handleMedicoChange('crm', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="CRM/UF 00000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Data da Avaliação Médica
            </label>
            <input
              type="date"
              value={medico.dataAvaliacao}
              onChange={e => handleMedicoChange('dataAvaliacao', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Local da Avaliação
            </label>
            <select
              value={medico.localAvaliacao}
              onChange={e => handleMedicoChange('localAvaliacao', e.target.value as any)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
            >
              <option value="Consultório / Junta Médica">Consultório / Junta Médica</option>
              <option value="Domicílio">Domicílio</option>
              <option value="Hospital">Hospital</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Informante durante a Perícia
            </label>
            <select
              value={medico.informante}
              onChange={e => handleMedicoChange('informante', e.target.value as any)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
            >
              <option value="Próprio avaliado(a)">Próprio avaliado(a)</option>
              <option value="Pessoa de convívio próximo">Pessoa de convívio próximo</option>
              <option value="Avaliado(a) e pessoa de convívio">Avaliado(a) e pessoa de convívio</option>
              <option value="Outra pessoa">Outra pessoa</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. DIAGNÓSTICO MÉDICO */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            1.3 Diagnóstico Médico
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              CID Principal / Doença de Base
            </label>
            <input
              type="text"
              value={medico.cidPrincipal}
              onChange={e => handleMedicoChange('cidPrincipal', e.target.value)}
              className="w-full text-sm font-mono rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="Ex.: G80 (Paralisia Cerebral), F84.0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              CID Secundário / Sequela
            </label>
            <input
              type="text"
              value={medico.cidSequela}
              onChange={e => handleMedicoChange('cidSequela', e.target.value)}
              className="w-full text-sm font-mono rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="Ex.: H54.0, R26"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Data de Início do Impedimento
            </label>
            <input
              type="date"
              value={medico.dataInicioImpedimento}
              onChange={e => handleMedicoChange('dataInicioImpedimento', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
            />
          </div>
        </div>

        {/* CIDs Rápidos */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Busca Rápida de CIDs mais frequentes:</span>
            </span>
            <input
              type="text"
              value={cidSearch}
              onChange={e => setCidSearch(e.target.value)}
              placeholder="Filtrar CID ou descrição..."
              className="text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {filteredCids.map(item => (
              <button
                key={item.code}
                type="button"
                onClick={() => handleMedicoChange('cidPrincipal', `${item.code} - ${item.description}`)}
                className="text-[11px] bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition text-left shadow-2xs"
              >
                <strong className="font-mono text-indigo-600">{item.code}</strong>: {item.description}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TIPOS DE DEFICIÊNCIA */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              1.4 Tipo(s) de Deficiência Diagnosticada(s)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Assinale todas as deficiências diagnosticadas (múltipla se mais de uma).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { key: 'motora', label: 'Deficiência Física / Motora', desc: 'Alteração parcial/completa de segmentos corporais' },
            { key: 'auditiva', label: 'Deficiência Auditiva', desc: 'Perda bilateral parcial ou total de audição' },
            { key: 'visual', label: 'Deficiência Visual', desc: 'Cegueira, baixa visão ou visão monocular' },
            { key: 'intelectualCognitiva', label: 'Deficiência Intelectual / Mental / TEA', desc: 'Limitações cognitivas, psicossociais ou autismo' },
          ].map(def => {
            const isChecked = tiposDeficiencia[def.key as keyof typeof tiposDeficiencia];
            return (
              <label
                key={def.key}
                onClick={() => handleTipoDeficienciaToggle(def.key as keyof typeof tiposDeficiencia)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-bold block ${isChecked ? 'text-indigo-950' : 'text-slate-800'}`}>
                    {def.label}
                  </span>
                  <span className="text-xs text-slate-500 block mt-1 leading-relaxed">
                    {def.desc}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* 5. HISTÓRIA CLÍNICA E ASSINATURA */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            1.5 História Clínica, Exames Complementares e Assinatura
          </h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            História Clínica / Descrição dos Impedimentos de Longo Prazo e Tratamentos
          </label>
          <textarea
            rows={4}
            value={medico.historiaClinica}
            onChange={e => handleMedicoChange('historiaClinica', e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 bg-white p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition leading-relaxed shadow-xs"
            placeholder="Descreva a evolução da patologia, tratamentos cirúrgicos/medicamentosos, próteses ou órteses utilizadas, exames de imagem e laudos comprobatórios..."
          />
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Assinatura / Matrícula do Médico Perito
            </label>
            <input
              type="text"
              value={medico.assinaturaMedico}
              onChange={e => handleMedicoChange('assinaturaMedico', e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-xs"
              placeholder="Dr(a). Nome Completo - CRM 00000"
            />
          </div>

          {onNextTab && (
            <button
              type="button"
              onClick={onNextTab}
              className="w-full sm:w-auto mt-2 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
            >
              <span>Avançar para Formulário 2 (CIF)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
