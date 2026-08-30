import React from 'react';
import { 
  User,
  Activity,
  Sparkles,
  Stethoscope, 
  Users, 
  FileCheck2, 
  Code2, 
  FolderOpen, 
  PlusCircle, 
  Download, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { AvaliacaoCompleta } from '../types';
import { DGEPLogo } from './DGEPLogo';

export type AppTab = 'rh_dashboard' | 'medico_dashboard' | 'social_dashboard' | 'form1' | 'form2' | 'form3' | 'form4' | 'social' | 'consolidado' | 'script';
export type UserRole = 'rh' | 'medico' | 'social';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentEval?: AvaliacaoCompleta;
  savedRecordsCount?: number;
  onNewEval?: () => void;
  onOpenRecords: () => void;
  onOpenManagementReport: () => void;
  grauFinal?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  setUserRole,
  activeTab,
  setActiveTab,
  currentEval,
  savedRecordsCount = 0,
  onNewEval,
  onOpenRecords,
  onOpenManagementReport,
  grauFinal,
}) => {
  const medicoTabs: { id: AppTab; num: string; label: string; subLabel: string; icon: React.ReactNode }[] = [
    {
      id: 'form1',
      num: '1',
      label: 'Identificação & CID',
      subLabel: 'Dados do Servidor e Diagnóstico',
      icon: <User className="w-3.5 h-3.5" />
    },
    {
      id: 'form2',
      num: '2',
      label: 'Funções Corporais (CIF)',
      subLabel: '8 Categorias Clínicas',
      icon: <Activity className="w-3.5 h-3.5" />
    },
    {
      id: 'form3',
      num: '3',
      label: 'Questões Emblemáticas',
      subLabel: 'Fuzzy - Casos de Severidade',
      icon: <Sparkles className="w-3.5 h-3.5" />
    },
    {
      id: 'form4',
      num: '4',
      label: 'IF-BRA Médico & Assinatura',
      subLabel: 'Atividades e Assinatura Pericial',
      icon: <Stethoscope className="w-3.5 h-3.5" />
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === 'rh') {
      setActiveTab('rh_dashboard');
    } else if (role === 'medico') {
      setActiveTab('medico_dashboard');
    } else if (role === 'social') {
      setActiveTab('social_dashboard');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <DGEPLogo size={52} className="shadow-xs" />
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 uppercase">
                SISTEMA DE AVALIAÇÃO BIOPSICOSSOCIAL
              </h1>
            </div>
          </div>

          {/* PERFIL / ROLE SELECTOR */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Perfil:</span>
            
            <button
              onClick={() => handleRoleSelect('rh')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                userRole === 'rh'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Gestão de Pessoas</span>
            </button>

            <button
              onClick={() => handleRoleSelect('medico')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                userRole === 'medico'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Médico Perito</span>
            </button>

            <button
              onClick={() => handleRoleSelect('social')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                userRole === 'social'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Assistente Social</span>
            </button>
          </div>

          {/* General Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenRecords}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              title="Gerenciar processos e avaliações salvas"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Processos Salvos</span>
            </button>

            <button
              onClick={onOpenManagementReport}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="Emitir relatório gerencial com dados de emissão e resultados das solicitações"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Relatório Gerencial</span>
            </button>
          </div>

        </div>

        {/* ESTRUTURA DE ABAS FILTRADA PELO PERFIL SELECIONADO */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          
          {/* ABAS DO GESTOR DE RH */}
          {userRole === 'rh' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('rh_dashboard')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'rh_dashboard'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Painel de Solicitações & Processos</span>
              </button>

              <button
                onClick={() => setActiveTab('consolidado')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'consolidado'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Emissão do Laudo Consolidado (com Assinaturas)</span>
              </button>

              <button
                onClick={() => setActiveTab('script')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeTab === 'script'
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Automação & Apps Script</span>
              </button>
            </div>
          )}

          {/* ABAS DO MÉDICO PERITO */}
          {userRole === 'medico' && (
            <div className="flex items-center space-x-1.5 bg-emerald-50/60 p-1 rounded-xl border border-emerald-200">
              <button
                onClick={() => setActiveTab('medico_dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'medico_dashboard'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-300" />
                <span>📋 Fila de Perícias Médicas</span>
              </button>

              <div className="h-4 w-px bg-emerald-300 mx-0.5" />

              {medicoTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.subLabel}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-emerald-950 hover:bg-emerald-100/70'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isActive ? 'bg-white text-emerald-700' : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {tab.num}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => setActiveTab('consolidado')}
                title="Visualizar laudo consolidado gerado"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'consolidado'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Ver Laudo Geral</span>
              </button>
            </div>
          )}

          {/* ABAS DA ASSISTENTE SOCIAL */}
          {userRole === 'social' && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 bg-sky-50/60 p-1 rounded-xl border border-sky-200">
                <button
                  onClick={() => setActiveTab('social_dashboard')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeTab === 'social_dashboard'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-sky-100 text-sky-950 hover:bg-sky-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-sky-300" />
                  <span>📋 Fila de Avaliações Sociais</span>
                </button>

                <div className="h-4 w-px bg-sky-300 mx-0.5" />

                <button
                  onClick={() => setActiveTab('social')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeTab === 'social'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-sky-950 hover:bg-sky-100/70'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold bg-white text-sky-700">
                    5
                  </span>
                  <span>Formulário Social: IF-BRA (41 Atividades) & Parecer</span>
                </button>
              </div>

              <button
                onClick={() => setActiveTab('consolidado')}
                title="Visualizar laudo consolidado gerado"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'consolidado'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Ver Laudo Consolidado</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};

