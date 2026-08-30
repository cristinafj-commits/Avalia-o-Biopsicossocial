import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Header, AppTab, UserRole } from './components/Header';
import { RHManagementDashboard } from './components/RHManagementDashboard';
import { ProfessionalQueueDashboard } from './components/ProfessionalQueueDashboard';
import { Form1Identificacao } from './components/Form1Identificacao';
import { Form2FuncoesCorporais } from './components/Form2FuncoesCorporais';
import { Form3QuestoesEmblematicas } from './components/Form3QuestoesEmblematicas';
import { Form4AtividadesMedico } from './components/Form4AtividadesMedico';
import { SocialForm } from './components/SocialForm';
import { ConsolidatedReport } from './components/ConsolidatedReport';
import { AppsScriptAutomation } from './components/AppsScriptAutomation';
import { RecordsManagerModal } from './components/RecordsManagerModal';
import { ManagementRequestsReportModal } from './components/ManagementRequestsReportModal';
import { LoginPage } from './components/LoginPage';
import { AvaliacaoCompleta, AuthUser } from './types';
import { RASCUNHO_INICIAL, ATIVIDADES_IFBRA_DEF, FUNCOES_CIF_DEF, CRIAR_AVALIACAO_LIMPA } from './data/initialData';
import { calcularAvaliacaoBiopsicossocial } from './utils/fuzzyCalculator';

const STORAGE_KEY = 'SISTEMA_BIOPSICOSSOCIAL_RECORDS_V3';
const AUTH_KEY = 'CMC_AUTH_USER_SESSION_V1';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('rh');
  const [activeTab, setActiveTab] = useState<AppTab>('rh_dashboard');
  const [savedRecords, setSavedRecords] = useState<AvaliacaoCompleta[]>([]);
  const [currentEval, setCurrentEval] = useState<AvaliacaoCompleta>(RASCUNHO_INICIAL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManagementReportOpen, setIsManagementReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load user session and records from localStorage on init
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      if (storedAuth) {
        const parsedUser: AuthUser = JSON.parse(storedAuth);
        if (parsedUser && parsedUser.email && parsedUser.email.endsWith('@cmc.pr.gov.br')) {
          setCurrentUser(parsedUser);
          setUserRole(parsedUser.perfil || 'rh');
          if (parsedUser.perfil === 'medico') setActiveTab('medico_dashboard');
          else if (parsedUser.perfil === 'social') setActiveTab('social_dashboard');
          else setActiveTab('rh_dashboard');
        }
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AvaliacaoCompleta[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedRecords(parsed);
          setCurrentEval(parsed[0]);
        } else {
          const fresh = CRIAR_AVALIACAO_LIMPA();
          setSavedRecords([fresh]);
          setCurrentEval(fresh);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([fresh]));
        }
      } else {
        const fresh = CRIAR_AVALIACAO_LIMPA();
        setSavedRecords([fresh]);
        setCurrentEval(fresh);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([fresh]));
      }
    } catch (e) {
      console.error('Erro ao carregar dados do localStorage:', e);
      const fresh = CRIAR_AVALIACAO_LIMPA();
      setSavedRecords([fresh]);
      setCurrentEval(fresh);
    }
  }, []);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.perfil);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Falha ao salvar sessão:', e);
    }

    if (user.perfil === 'medico') {
      setActiveTab('medico_dashboard');
    } else if (user.perfil === 'social') {
      setActiveTab('social_dashboard');
    } else {
      setActiveTab('rh_dashboard');
    }

    showToast(`Bem-vindo(a), ${user.nome}! Acesso autenticado (@cmc.pr.gov.br).`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error('Falha ao limpar sessão:', e);
    }
    setCurrentUser(null);
    showToast('Sessão encerrada com sucesso.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Update current evaluation and automatically persist to local records
  const handleUpdateEval = (updater: (prev: AvaliacaoCompleta) => AvaliacaoCompleta) => {
    setCurrentEval(prev => {
      const next = updater(prev);
      
      // Update in savedRecords array
      setSavedRecords(records => {
        const index = records.findIndex(r => r.id === next.id);
        let updatedRecords: AvaliacaoCompleta[];
        if (index >= 0) {
          updatedRecords = [...records];
          updatedRecords[index] = next;
        } else {
          updatedRecords = [next, ...records];
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
        } catch (e) {
          console.error('Falha ao salvar no storage:', e);
        }
        return updatedRecords;
      });

      return next;
    });
  };

  // Create brand new blank evaluation
  const handleNewEval = () => {
    const freshRecord = CRIAR_AVALIACAO_LIMPA();
    setCurrentEval(freshRecord);
    setSavedRecords(prev => {
      const next = [freshRecord, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setActiveTab('form1');
    showToast('Nova avaliação em branco iniciada!');
  };

  // Clear all records from storage and start 100% fresh for clean testing
  const handleClearAllRecords = () => {
    const freshRecord = CRIAR_AVALIACAO_LIMPA();
    setSavedRecords([freshRecord]);
    setCurrentEval(freshRecord);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([freshRecord]));
    } catch (e) {
      console.error('Falha ao limpar registros:', e);
    }
    showToast('Sistema limpo com sucesso! Todos os cadastros e dados foram redefinidos para teste.');
  };

  // Switch active evaluation record
  const handleSelectRecord = (id: string) => {
    const target = savedRecords.find(r => r.id === id);
    if (target) {
      setCurrentEval(target);
      showToast(`Avaliação de "${target.servidor.nome || 'Servidor'}" carregada!`);
    }
  };

  // Delete an evaluation record
  const handleDeleteRecord = (id: string) => {
    if (savedRecords.length <= 1) {
      const freshRecord = CRIAR_AVALIACAO_LIMPA();
      setSavedRecords([freshRecord]);
      setCurrentEval(freshRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([freshRecord]));
      showToast('Registro redefinido para estado em branco.');
      return;
    }
    const updated = savedRecords.filter(r => r.id !== id);
    setSavedRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (currentEval.id === id) {
      setCurrentEval(updated[0]);
    }
    showToast('Avaliação excluída com sucesso.');
  };

  // Import JSON evaluation
  const handleImportJson = (jsonString: string) => {
    const parsed = JSON.parse(jsonString) as AvaliacaoCompleta;
    if (!parsed.id || !parsed.servidor) {
      throw new Error('Formato JSON inválido para avaliação biopsicossocial.');
    }
    setCurrentEval(parsed);
    setSavedRecords(prev => {
      const next = [parsed, ...prev.filter(r => r.id !== parsed.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    showToast('Avaliação importada com sucesso!');
  };

  // Export full multi-sheet Excel file matching Google Sheets format
  const handleExportExcel = () => {
    const calc = calcularAvaliacaoBiopsicossocial(currentEval);

    // Sheet 1: Dados do avaliado
    const sheet1Data = [
      ['AVALIAÇÃO DE PESSOA COM DEFICIÊNCIA - LAUDO BIOPSICOSSOCIAL'],
      ['Formulário 1: Dados do(a) Servidor(a)'],
      ['Nome:', currentEval.servidor.nome, 'RG:', currentEval.servidor.rg, 'CPF:', currentEval.servidor.cpf, 'Idade:', currentEval.servidor.idade],
      ['Sexo:', currentEval.servidor.sexo, 'Matrícula:', currentEval.servidor.matricula, 'Cargo:', currentEval.servidor.cargo, 'Data Admissão:', currentEval.servidor.dataAdmissao],
      [],
      ['Dados do Médico Avaliador'],
      ['Nome Médico:', currentEval.medico.nome, 'CRM:', currentEval.medico.crm, 'Data Avaliação:', currentEval.medico.dataAvaliacao],
      ['Local Avaliação:', currentEval.medico.localAvaliacao, 'Informante:', currentEval.medico.informante],
      [],
      ['Diagnóstico Médico'],
      ['Diagnóstico Principal (CID):', currentEval.medico.cidPrincipal, 'Sequela / Diagnóstico Secundário:', currentEval.medico.cidSequela, 'Início Impedimento:', currentEval.medico.dataInicioImpedimento],
      ['Tipo de Deficiência:', 
        `Auditiva: ${currentEval.tiposDeficiencia.auditiva ? 'SIM' : 'NÃO'}, Intelectual: ${currentEval.tiposDeficiencia.intelectualCognitiva ? 'SIM' : 'NÃO'}, Motora: ${currentEval.tiposDeficiencia.motora ? 'SIM' : 'NÃO'}, Visual: ${currentEval.tiposDeficiencia.visual ? 'SIM' : 'NÃO'}`
      ],
      [],
      ['História Clínica:'],
      [currentEval.medico.historiaClinica],
      [],
      ['Assinatura Perito Médico:', currentEval.medico.assinaturaMedico]
    ];

    // Sheet 2: Formulário 2: Funções Corporais Acometidas (CIF)
    const sheetFuncoesData: (string | boolean)[][] = [
      ['Formulário 2: Funções Corporais Acometidas'],
      []
    ];
    FUNCOES_CIF_DEF.forEach(cat => {
      sheetFuncoesData.push([cat.titulo]);
      cat.itens.forEach(it => {
        const isChecked = !!currentEval.funcoesCorporais[it.key];
        sheetFuncoesData.push([isChecked ? 'TRUE' : 'FALSE', `${it.nome}: ${it.descricao}`]);
      });
      sheetFuncoesData.push([]);
    });

    // Sheet 3: Domínios e atividades (29 Atividades IF-BRA Dual)
    const sheet2Header = [['Cód. Atividade', 'Domínio', 'Nome da Atividade', 'Pontuação Médico', 'Pontuação Social', 'SOMA DAS DUAS PONTUAÇÕES', 'Observação Médico', 'Observação Social']];
    const sheet2Rows = calc.dominiosPontuacao.flatMap(d => 
      d.atividades.map(a => [
        a.id,
        d.nomeDomain,
        a.nome,
        a.ajustadoMedico,
        a.ajustadoSocial,
        a.somaFuzzy,
        currentEval.observacoesAtividadesMedico?.[a.id] || '',
        currentEval.observacoesAtividadesSocial?.[a.id] || currentEval.observacoesAtividades?.[a.id] || ''
      ])
    );

    // Sheet 4: Resumo Consolidado Fuzzy
    const sheet3Data = [
      ['RESUMO DO LAUDO CONSOLIDADO DUAL FUZZY'],
      ['1. Pontuação do Médico Perito:', calc.pontuacaoFuzzyMedico, 'de 2900 pts', `(Grau Médico: ${calc.grauDeficienciaMedico})`],
      ['2. Pontuação do Assistente Social:', calc.pontuacaoFuzzySocial, 'de 2900 pts', `(Grau Social: ${calc.grauDeficienciaSocial})`],
      ['3. SOMA DAS DUAS PONTUAÇÕES (UNIFICADA):', calc.pontuacaoFuzzySoma, 'de 5800 pts'],
      ['Equivalente Normalizado (Escala 41 itens x 2):', calc.pontuacaoNormalizada8200, 'de 8200 pts'],
      ['GRAU DE DEFICIÊNCIA FINAL UNIFICADO:', calc.grauDeficienciaFuzzySoma.toUpperCase()],
      [],
      ['IMPACTO DO MODELO FUZZY:'],
      ...calc.resumoImpactoFuzzy.map(m => [m]),
      [],
      ['PARECER CONCLUSIVO FORMATADO:'],
      [calc.parecerBiopsicossocialFormatado]
    ];

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
    const wsFuncoes = XLSX.utils.aoa_to_sheet(sheetFuncoesData);
    const ws2 = XLSX.utils.aoa_to_sheet([...sheet2Header, ...sheet2Rows]);
    const ws3 = XLSX.utils.aoa_to_sheet(sheet3Data);

    XLSX.utils.book_append_sheet(wb, ws1, 'Dados do avaliado');
    XLSX.utils.book_append_sheet(wb, wsFuncoes, 'Funções Corporais');
    XLSX.utils.book_append_sheet(wb, ws2, 'Domínios e atividades');
    XLSX.utils.book_append_sheet(wb, ws3, 'Laudo Consolidado Fuzzy');

    const fileName = `Laudo_Biopsicossocial_${currentEval.servidor.nome.replace(/\s+/g, '_') || 'Servidor'}.xlsx`;
    XLSX.writeFile(wb, fileName);
    showToast(`Planilha Excel exportada: ${fileName}`);
  };

  const calc = calcularAvaliacaoBiopsicossocial(currentEval);

  // If user is not authenticated, show institutional Login Page with @cmc.pr.gov.br verification
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* HEADER COMPONENT */}
      <Header
        userRole={userRole}
        setUserRole={setUserRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentEval={currentEval}
        savedRecordsCount={savedRecords.length}
        onNewEval={handleNewEval}
        onOpenRecords={() => setIsModalOpen(true)}
        onOpenManagementReport={() => setIsManagementReportOpen(true)}
        grauFinal={calc.grauDeficienciaFuzzySoma}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* RH DASHBOARD */}
        {activeTab === 'rh_dashboard' && (
          <RHManagementDashboard
            records={savedRecords}
            currentEval={currentEval}
            onSelectRecord={id => {
              handleSelectRecord(id);
            }}
            onCreateRecord={newRec => {
              setSavedRecords(prev => {
                const next = [newRec, ...prev];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                return next;
              });
              setCurrentEval(newRec);
              showToast(`Processo "${newRec.processoAdministrativo.numeroProcesso}" cadastrado com sucesso!`);
            }}
            onUpdateRecord={upRec => {
              setSavedRecords(prev => {
                const next = prev.map(r => r.id === upRec.id ? upRec : r);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                return next;
              });
              if (currentEval.id === upRec.id) {
                setCurrentEval(upRec);
              }
              showToast('Status do processo atualizado.');
            }}
            onDeleteRecord={handleDeleteRecord}
            onViewConsolidado={recId => {
              handleSelectRecord(recId);
              setActiveTab('consolidado');
            }}
            onSwitchToMedico={recId => {
              handleSelectRecord(recId);
              setUserRole('medico');
              setActiveTab('medico_dashboard');
            }}
            onSwitchToSocial={recId => {
              handleSelectRecord(recId);
              setUserRole('social');
              setActiveTab('social_dashboard');
            }}
          />
        )}

        {/* PERITO MÉDICO DASHBOARD */}
        {activeTab === 'medico_dashboard' && (
          <ProfessionalQueueDashboard
            role="medico"
            records={savedRecords}
            currentEvalId={currentEval.id}
            onSelectAndOpenForm={recId => {
              handleSelectRecord(recId);
              setActiveTab('form1');
            }}
            onViewConsolidado={recId => {
              handleSelectRecord(recId);
              setActiveTab('consolidado');
            }}
          />
        )}

        {/* ASSISTENTE SOCIAL DASHBOARD */}
        {activeTab === 'social_dashboard' && (
          <ProfessionalQueueDashboard
            role="social"
            records={savedRecords}
            currentEvalId={currentEval.id}
            onSelectAndOpenForm={recId => {
              handleSelectRecord(recId);
              setActiveTab('social');
            }}
            onViewConsolidado={recId => {
              handleSelectRecord(recId);
              setActiveTab('consolidado');
            }}
          />
        )}

        {/* FORMS DAS ETAPAS PERICIAIS */}
        {activeTab === 'form1' && (
          <Form1Identificacao
            evalData={currentEval}
            updateEval={handleUpdateEval}
            onNextTab={() => setActiveTab('form2')}
            onBackToQueue={() => {
              if (userRole === 'medico') setActiveTab('medico_dashboard');
              else if (userRole === 'social') setActiveTab('social_dashboard');
              else setActiveTab('rh_dashboard');
            }}
          />
        )}

        {activeTab === 'form2' && (
          <Form2FuncoesCorporais
            evalData={currentEval}
            updateEval={handleUpdateEval}
            onPrevTab={() => setActiveTab('form1')}
            onNextTab={() => setActiveTab('form3')}
          />
        )}

        {activeTab === 'form3' && (
          <Form3QuestoesEmblematicas
            evalData={currentEval}
            updateEval={handleUpdateEval}
            onPrevTab={() => setActiveTab('form2')}
            onNextTab={() => setActiveTab('form4')}
          />
        )}

        {activeTab === 'form4' && (
          <Form4AtividadesMedico
            evalData={currentEval}
            updateEval={handleUpdateEval}
            onPrevTab={() => setActiveTab('form3')}
            onNextTab={() => {
              setActiveTab('medico_dashboard');
              showToast('Avaliação médica das 29 atividades concluída!');
            }}
          />
        )}

        {activeTab === 'social' && (
          <SocialForm
            evalData={currentEval}
            updateEval={handleUpdateEval}
            onBackToQueue={() => setActiveTab('social_dashboard')}
            onPrevTab={() => {
              if (userRole === 'social') {
                setActiveTab('social_dashboard');
              } else {
                setActiveTab('form4');
              }
            }}
            onNextTab={() => setActiveTab('consolidado')}
          />
        )}

        {activeTab === 'consolidado' && (
          <ConsolidatedReport
            evalData={currentEval}
            onExportExcel={handleExportExcel}
          />
        )}

        {activeTab === 'script' && (
          <AppsScriptAutomation
            evalData={currentEval}
          />
        )}
      </main>

      {/* RECORDS MODAL */}
      <RecordsManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        savedRecords={savedRecords}
        currentId={currentEval.id}
        onSelectRecord={handleSelectRecord}
        onNewRecord={handleNewEval}
        onDeleteRecord={handleDeleteRecord}
        onImportJson={handleImportJson}
        onClearAllRecords={handleClearAllRecords}
      />

      {/* MANAGEMENT REPORT MODAL */}
      <ManagementRequestsReportModal
        isOpen={isManagementReportOpen}
        onClose={() => setIsManagementReportOpen(false)}
        records={savedRecords}
      />
    </div>
  );
}
