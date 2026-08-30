import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  FileSpreadsheet, 
  Sparkles, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { AvaliacaoCompleta } from '../types';

interface AppsScriptAutomationProps {
  evalData: AvaliacaoCompleta;
}

export const AppsScriptAutomation: React.FC<AppsScriptAutomationProps> = ({ evalData }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const jsonPayload = JSON.stringify(evalData, null, 2);

  const googleAppsScriptCode = `/**
 * ==============================================================================
 * SCRIPT DE PREENCHIMENTO AUTOMÁTICO - AVALIAÇÃO BIOPSICOSSOCIAL (IF-BRA)
 * Google Apps Script para a Planilha 'Avaliação Aposentadoria PCD'
 * ==============================================================================
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🏥 Perícia Biopsicossocial')
    .addItem('1. Preencher Módulo Médico Perito', 'abrirFormularioMedico')
    .addItem('2. Preencher Módulo Assistente Social', 'abrirFormularioSocial')
    .addSeparator()
    .addItem('3. Importar Dados de Avaliação (JSON)', 'importarDadosJSON')
    .addItem('4. Recalcular Laudo Consolidado Fuzzy', 'recalcularFuzzy')
    .addToUi();
}

/**
 * Preenche a aba 'Dados do avaliado' (Formulário 1) e 'Funções corporais' (Formulário 2)
 */
function preencherAvaliacaoMedica(dados) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetDados = ss.getSheetByName('Dados do avaliado');
  var sheetFunc = ss.getSheetByName('Funções corporais');
  var sheetFuzzy = ss.getSheetByName('FuzziMed');
  
  if (!sheetDados) throw new Error("Aba 'Dados do avaliado' não encontrada.");

  // Preenche Formulário 1 (Servidor & Médico)
  sheetDados.getRange("B6").setValue(dados.servidor.nome);
  sheetDados.getRange("D6").setValue(dados.servidor.rg);
  sheetDados.getRange("F6").setValue(dados.servidor.cpf);
  sheetDados.getRange("H6").setValue(dados.servidor.idade);
  sheetDados.getRange("J6").setValue(dados.servidor.sexo);
  sheetDados.getRange("L6").setValue(dados.servidor.matricula);
  sheetDados.getRange("N6").setValue(dados.servidor.cargo);
  sheetDados.getRange("P6").setValue(dados.servidor.dataAdmissao);

  sheetDados.getRange("B9").setValue(dados.medico.nome);
  sheetDados.getRange("F9").setValue(dados.medico.dataAvaliacao);
  sheetDados.getRange("J9").setValue(dados.medico.localAvaliacao);

  sheetDados.getRange("B12").setValue(dados.medico.cidPrincipal);
  sheetDados.getRange("F12").setValue(dados.medico.cidSequela);
  sheetDados.getRange("J12").setValue(dados.medico.dataInicioImpedimento);

  // Tipos de deficiência (Sim / Não)
  sheetDados.getRange("B14").setValue(dados.tiposDeficiencia.auditiva ? "SIM" : "NÃO");
  sheetDados.getRange("D14").setValue(dados.tiposDeficiencia.intelectualCognitiva ? "SIM" : "NÃO");
  sheetDados.getRange("F14").setValue(dados.tiposDeficiencia.motora ? "SIM" : "NÃO");
  sheetDados.getRange("H14").setValue(dados.tiposDeficiencia.visual ? "SIM" : "NÃO");

  sheetDados.getRange("B16").setValue(dados.medico.historiaClinica);
  sheetDados.getRange("B18").setValue(dados.medico.assinaturaMedico);

  // Preenche FuzziMed (Questões Emblemáticas)
  if (sheetFuzzy) {
    if (dados.questoesEmblematicas.auditivaSurdezAntes6Anos !== null) {
      sheetFuzzy.getRange("B5").setValue(dados.questoesEmblematicas.auditivaSurdezAntes6Anos ? "Sim" : "Não");
    }
    if (dados.questoesEmblematicas.intelectualNaoFicaSozinhoSeguranca !== null) {
      sheetFuzzy.getRange("D5").setValue(dados.questoesEmblematicas.intelectualNaoFicaSozinhoSeguranca ? "Sim" : "Não");
    }
    if (dados.questoesEmblematicas.motoraCadeiraDeRodasExclusiva !== null) {
      sheetFuzzy.getRange("F5").setValue(dados.questoesEmblematicas.motoraCadeiraDeRodasExclusiva ? "Sim" : "Não");
    }
    if (dados.questoesEmblematicas.visualNaoEnxergavaAoNascer !== null) {
      sheetFuzzy.getRange("H5").setValue(dados.questoesEmblematicas.visualNaoEnxergavaAoNascer ? "Sim" : "Não");
    }
  }

  SpreadsheetApp.getUi().alert("✅ Dados do Médico Perito gravados com sucesso!");
}

/**
 * Preenche a aba 'Domínios e atividades' com as notas do Médico Perito e da Assistente Social
 */
function preencherPontuacaoAtividades(dados) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Domínios e atividades');
  if (!sheet) throw new Error("Aba 'Domínios e atividades' não encontrada.");

  var scoresMed = dados.atividadesMedico || dados.atividades;
  var scoresSoc = dados.atividadesSocial || dados.atividades;

  var lastRow = sheet.getLastRow();
  for (var r = 6; r <= lastRow; r++) {
    var codAtiv = sheet.getRange(r, 1).getValue().toString().trim();
    
    if (scoresMed && scoresMed[codAtiv] !== undefined) {
      sheet.getRange(r, 4).setValue(scoresMed[codAtiv]); // Coluna Médico
    }
    if (scoresSoc && scoresSoc[codAtiv] !== undefined) {
      sheet.getRange(r, 5).setValue(scoresSoc[codAtiv]); // Coluna Social
    }
  }

  SpreadsheetApp.getUi().alert("✅ Pontuação das 29 atividades vinculadas com sucesso!");
}
`;

  const copyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonPayload);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner de Apresentação */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600 shadow-sm">
            <Code2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                Integração & Script
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Automação e Conexão com o Google Sheets
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Copie o código Google Apps Script para a sua planilha e preencha automaticamente todas as abas e células.
            </p>
          </div>
        </div>
      </div>

      {/* GUIA DE INSTALAÇÃO PASSO A PASSO */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Como Instalar e Usar a Automação no Google Sheets
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold inline-flex items-center justify-center text-xs">1</span>
            <p className="font-bold text-slate-900">Abra a Planilha</p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Acesse sua planilha oficial no Google Sheets (Modelo 'Avaliação Aposentadoria PCD').
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold inline-flex items-center justify-center text-xs">2</span>
            <p className="font-bold text-slate-900">Abra o Apps Script</p>
            <p className="text-slate-600 text-xs leading-relaxed">
              No menu superior, clique em <strong>Extensões &gt; Apps Script</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold inline-flex items-center justify-center text-xs">3</span>
            <p className="font-bold text-slate-900">Cole o Script</p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Substitua o conteúdo existente pelo código do painel abaixo e clique no ícone de <strong>Salvar (💾)</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold inline-flex items-center justify-center text-xs">4</span>
            <p className="font-bold text-slate-900">Execute na Planilha</p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Recarregue a planilha. O menu <strong>"🏥 Perícia Biopsicossocial"</strong> aparecerá na barra superior!
            </p>
          </div>
        </div>
      </section>

      {/* SCRIPT CODE PANEL */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Código do Google Apps Script (GAS)
            </h3>
          </div>

          <button
            onClick={copyScript}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs"
          >
            {copiedScript ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copiedScript ? 'Código Copiado!' : 'Copiar Script GAS'}</span>
          </button>
        </div>

        <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 max-h-96 overflow-y-auto leading-relaxed">
          {googleAppsScriptCode}
        </pre>
      </section>

      {/* CURRENT EVALUATION JSON PAYLOAD */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Payload JSON da Avaliação Atual (Pronto para Importação)
            </h3>
            <p className="text-xs text-slate-500">
              Utilize este JSON para importar instantaneamente esta avaliação dentro do Google Sheets através do menu do script.
            </p>
          </div>

          <button
            onClick={copyJson}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs"
          >
            {copiedJson ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedJson ? 'JSON Copiado!' : 'Copiar JSON Atual'}</span>
          </button>
        </div>

        <pre className="whitespace-pre-wrap font-mono text-[11px] bg-slate-50 text-slate-800 p-4 rounded-xl max-h-64 overflow-y-auto border border-slate-200 leading-relaxed">
          {jsonPayload}
        </pre>
      </section>
    </div>
  );
};
