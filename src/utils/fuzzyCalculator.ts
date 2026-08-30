import { 
  AvaliacaoCompleta, 
  PontuacaoIFBRA, 
  ResultadoAvaliacaoFuzzy, 
  DominioPontuacao, 
  GrauDeficiencia 
} from '../types';
import { ATIVIDADES_IFBRA_DEF } from '../data/initialData';

export function calcularAvaliacaoBiopsicossocial(evalData: AvaliacaoCompleta): ResultadoAvaliacaoFuzzy {
  const { tiposDeficiencia, questoesEmblematicas, atividades } = evalData;

  // Helpers to get raw scores for Medical and Social evaluations
  const getScoreMedico = (id: string): PontuacaoIFBRA => {
    return evalData.atividadesMedico?.[id] ?? atividades[id] ?? 100;
  };

  const getScoreSocial = (id: string): PontuacaoIFBRA => {
    return evalData.atividadesSocial?.[id] ?? atividades[id] ?? 100;
  };

  // Group activity IDs by domain
  const d1Ids = ['1.1', '1.2', '1.3', '1.4', '1.5'];
  const d2Ids = ['2.1', '2.2', '2.3', '2.4', '2.5'];
  const d3Ids = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8'];
  const d4Ids = ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8'];
  const d5Ids = ['5.1', '5.2', '5.3', '5.4', '5.5'];
  const d6Ids = ['6.1', '6.2', '6.3', '6.4', '6.5'];
  const d7Ids = ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8'];

  // Check scores in specific domain sets (combining Medical and Social observations)
  const has25or50 = (ids: string[]): boolean => 
    ids.some(id => getScoreMedico(id) === 25 || getScoreMedico(id) === 50 || getScoreSocial(id) === 25 || getScoreSocial(id) === 50);

  const all75 = (ids: string[]): boolean => 
    ids.every(id => getScoreMedico(id) === 75 || getScoreSocial(id) === 75);

  // 1. AUDITIVA FUZZY CRITERIA (Comunicação D2 & Socialização D7)
  const auditivaC5 = questoesEmblematicas.auditivaSurdezAntes6Anos === true;
  const auditivaC6 = questoesEmblematicas.auditivaSemAuxilioTerceiros === true;
  const auditivaC7 = has25or50(d2Ids) || has25or50(d7Ids);
  const auditivaC8 = all75(d2Ids) || all75(d7Ids);
  const auditivaFuzzyAtingido = tiposDeficiencia.auditiva && (auditivaC5 || auditivaC6 || auditivaC7 || auditivaC8);

  // 2. INTELECTUAL / COGNITIVA FUZZY CRITERIA (Vida Doméstica D5 & Socialização D7)
  const intelectualE5 = questoesEmblematicas.intelectualNaoFicaSozinhoSeguranca === true;
  const intelectualE6 = questoesEmblematicas.intelectualSemAuxilioTerceiros === true;
  const intelectualE7 = has25or50(d5Ids) || has25or50(d7Ids);
  const intelectualE8 = all75(d5Ids) || all75(d7Ids);
  const intelectualFuzzyAtingido = tiposDeficiencia.intelectualCognitiva && (intelectualE5 || intelectualE6 || intelectualE7 || intelectualE8);

  // 3. MOTORA FUZZY CRITERIA (Mobilidade D3 & Cuidados Pessoais D4)
  const motoraG5 = questoesEmblematicas.motoraCadeiraDeRodasExclusiva === true;
  const motoraG6 = questoesEmblematicas.motoraSemAuxilioTerceiros === true;
  const motoraG7 = has25or50(d3Ids) || has25or50(d4Ids);
  const motoraG8 = all75(d3Ids) || all75(d4Ids);
  const motoraFuzzyAtingido = tiposDeficiencia.motora && (motoraG5 || motoraG6 || motoraG7 || motoraG8);

  // 4. VISUAL FUZZY CRITERIA (Mobilidade D3 & Vida Doméstica D5)
  const visualI5 = questoesEmblematicas.visualNaoEnxergavaAoNascer === true;
  const visualI6 = questoesEmblematicas.visualSemAuxilioTerceiros === true;
  const visualI7 = has25or50(d3Ids) || has25or50(d5Ids);
  const visualI8 = all75(d3Ids) || all75(d5Ids);
  const visualFuzzyAtingido = tiposDeficiencia.visual && (visualI5 || visualI6 || visualI7 || visualI8);

  // Min calculations per domain for Fuzzy min-capping
  const minD1Medico = Math.min(...d1Ids.map(getScoreMedico)) as PontuacaoIFBRA;
  const minD1Social = Math.min(...d1Ids.map(getScoreSocial)) as PontuacaoIFBRA;

  const minD2Medico = Math.min(...d2Ids.map(getScoreMedico)) as PontuacaoIFBRA;
  const minD2Social = Math.min(...d2Ids.map(getScoreSocial)) as PontuacaoIFBRA;

  const minD3Medico = Math.min(...d3Ids.map(getScoreMedico)) as PontuacaoIFBRA;
  const minD3Social = Math.min(...d3Ids.map(getScoreSocial)) as PontuacaoIFBRA;

  const minD4Medico = Math.min(...d4Ids.map(getScoreMedico)) as PontuacaoIFBRA;
  const minD4Social = Math.min(...d4Ids.map(getScoreSocial)) as PontuacaoIFBRA;

  const minD5Medico = Math.min(...d5Ids.map(getScoreMedico)) as PontuacaoIFBRA;
  const minD5Social = Math.min(...d5Ids.map(getScoreSocial)) as PontuacaoIFBRA;

  const minD6Medico = Math.min(...d6Ids.map(getScoreMedico)) as PontuacaoIFBRA;
  const minD6Social = Math.min(...d6Ids.map(getScoreSocial)) as PontuacaoIFBRA;

  const minD7Medico = Math.min(...d7Ids.map(getScoreMedico)) as PontuacaoIFBRA;
  const minD7Social = Math.min(...d7Ids.map(getScoreSocial)) as PontuacaoIFBRA;

  // Compute domain adjusted scores
  const dominiosPontuacao: DominioPontuacao[] = [];

  let pontuacaoBrutaMedico = 0;
  let pontuacaoFuzzyMedico = 0;
  let pontuacaoBrutaSocial = 0;
  let pontuacaoFuzzySocial = 0;

  const domainDefs = [
    { code: 1, name: 'Aprendizagem e Aplicação do Conhecimento', ids: d1Ids, minM: minD1Medico, minS: minD1Social, isFuzzy: false },
    { code: 2, name: 'Comunicação', ids: d2Ids, minM: minD2Medico, minS: minD2Social, isFuzzy: auditivaFuzzyAtingido },
    { code: 3, name: 'Mobilidade', ids: d3Ids, minM: minD3Medico, minS: minD3Social, isFuzzy: motoraFuzzyAtingido || visualFuzzyAtingido },
    { code: 4, name: 'Cuidados Pessoais', ids: d4Ids, minM: minD4Medico, minS: minD4Social, isFuzzy: motoraFuzzyAtingido },
    { code: 5, name: 'Vida Doméstica', ids: d5Ids, minM: minD5Medico, minS: minD5Social, isFuzzy: intelectualFuzzyAtingido || visualFuzzyAtingido },
    { code: 6, name: 'Educação, Trabalho e Vida Econômica', ids: d6Ids, minM: minD6Medico, minS: minD6Social, isFuzzy: false },
    { code: 7, name: 'Socialização e Vida Comunitária', ids: d7Ids, minM: minD7Medico, minS: minD7Social, isFuzzy: auditivaFuzzyAtingido || intelectualFuzzyAtingido },
  ];

  const resumoImpactoFuzzy: string[] = [];

  if (auditivaFuzzyAtingido) {
    resumoImpactoFuzzy.push('Modelo Fuzzy aplicado à Deficiência Auditiva: Ajustou pontuações dos domínios Comunicação e Socialização.');
  }
  if (intelectualFuzzyAtingido) {
    resumoImpactoFuzzy.push('Modelo Fuzzy aplicado à Deficiência Intelectual/Cognitiva: Ajustou pontuações dos domínios Vida Doméstica e Socialização.');
  }
  if (motoraFuzzyAtingido) {
    resumoImpactoFuzzy.push('Modelo Fuzzy aplicado à Deficiência Motora: Ajustou pontuações dos domínios Mobilidade e Cuidados Pessoais.');
  }
  if (visualFuzzyAtingido) {
    resumoImpactoFuzzy.push('Modelo Fuzzy aplicado à Deficiência Visual: Ajustou pontuações dos domínios Mobilidade e Vida Doméstica.');
  }

  if (resumoImpactoFuzzy.length === 0) {
    resumoImpactoFuzzy.push('Nenhum critério do Modelo Fuzzy foi acionado. As pontuações periciais ajustadas são idênticas às brutas.');
  }

  domainDefs.forEach(dDef => {
    let dBrutoM = 0;
    let dFuzzyM = 0;
    let dBrutoS = 0;
    let dFuzzyS = 0;

    const atividadesMapped = dDef.ids.map(id => {
      const def = ATIVIDADES_IFBRA_DEF.find(a => a.id === id);
      
      const brutoMedico = getScoreMedico(id);
      const ajustadoMedico = dDef.isFuzzy ? dDef.minM : brutoMedico;

      const brutoSocial = getScoreSocial(id);
      const ajustadoSocial = dDef.isFuzzy ? dDef.minS : brutoSocial;

      const somaBruta = brutoMedico + brutoSocial;
      const somaFuzzy = ajustadoMedico + ajustadoSocial;

      dBrutoM += brutoMedico;
      dFuzzyM += ajustadoMedico;

      dBrutoS += brutoSocial;
      dFuzzyS += ajustadoSocial;

      return {
        id,
        nome: def ? def.nome : id,
        brutoMedico,
        ajustadoMedico,
        brutoSocial,
        ajustadoSocial,
        somaBruta,
        somaFuzzy,
        // compatibility aliases
        bruto: brutoSocial,
        ajustado: ajustadoSocial,
      };
    });

    pontuacaoBrutaMedico += dBrutoM;
    pontuacaoFuzzyMedico += dFuzzyM;

    pontuacaoBrutaSocial += dBrutoS;
    pontuacaoFuzzySocial += dFuzzyS;

    const dSomaBruta = dBrutoM + dBrutoS;
    const dSomaFuzzy = dFuzzyM + dFuzzyS;

    dominiosPontuacao.push({
      codigoDomain: dDef.code,
      nomeDomain: dDef.name,
      qtdAtividades: dDef.ids.length,
      
      totalBrutoMedico: dBrutoM,
      totalAjustadoFuzzyMedico: dFuzzyM,
      
      totalBrutoSocial: dBrutoS,
      totalAjustadoFuzzySocial: dFuzzyS,
      
      totalBrutoSoma: dSomaBruta,
      totalAjustadoFuzzySoma: dSomaFuzzy,

      // compatibility aliases
      totalBruto: dBrutoS,
      totalAjustadoFuzzy: dFuzzyS,
      
      atividades: atividadesMapped,
    });
  });

  // Calculate Degree of Disability for Single Evaluator (2900 max pts scale)
  const getGrauSingle = (score: number): GrauDeficiencia => {
    if (score <= 1740) return 'Grave';
    if (score <= 2175) return 'Moderada';
    if (score <= 2610) return 'Leve';
    return 'Sem Deficiência';
  };

  // Calculate Degree of Disability for Combined Evaluation (5800 max pts scale - Médico + Social)
  const getGrauCombined = (score: number): GrauDeficiencia => {
    if (score <= 4058) return 'Grave';
    if (score <= 4493) return 'Moderada';
    if (score <= 5362) return 'Leve';
    return 'Sem Deficiência';
  };

  const grauDeficienciaMedico = getGrauSingle(pontuacaoFuzzyMedico);
  const grauDeficienciaSocial = getGrauSingle(pontuacaoFuzzySocial);

  const pontuacaoBrutaSoma = pontuacaoBrutaMedico + pontuacaoBrutaSocial;
  const pontuacaoFuzzySoma = pontuacaoFuzzyMedico + pontuacaoFuzzySocial;

  const grauDeficienciaBrutoSoma = getGrauCombined(pontuacaoBrutaSoma);
  const grauDeficienciaFuzzySoma = getGrauCombined(pontuacaoFuzzySoma);

  // Normalized to 8200 scale (41 items evaluated twice: 41 x 100 x 2 = 8200)
  const pontuacaoNormalizada8200 = Math.round((pontuacaoFuzzySoma / 5800) * 8200);

  // Formatted conclusion statement
  let parecerBiopsicossocialFormatado = `LAUDO BIOPSICOSSOCIAL CONSOLIDADO DE AVALIAÇÃO DE DEFICIÊNCIA\n\n`;
  parecerBiopsicossocialFormatado += `Servidor(a): ${evalData.servidor.nome || 'Não informado'} | CPF: ${evalData.servidor.cpf || 'Não informado'} | Matrícula: ${evalData.servidor.matricula || 'Não informado'}\n`;
  parecerBiopsicossocialFormatado += `Médico Perito: ${evalData.medico.nome || 'Não informado'} (${evalData.medico.crm || 'CRM'})\n`;
  parecerBiopsicossocialFormatado += `Assistente Social: ${evalData.assistenteSocial.nome || 'Não informado'} (${evalData.assistenteSocial.cress || 'CRESS'})\n\n`;
  parecerBiopsicossocialFormatado += `--- PONTUAÇÕES DO ÍNDICE DE FUNCIONALIDADE BRASILEIRO (IF-BRA DUAL) ---\n`;
  parecerBiopsicossocialFormatado += `1. Pontuação do Médico Perito: ${pontuacaoFuzzyMedico} / 2900 pontos (Grau Médico: ${grauDeficienciaMedico})\n`;
  parecerBiopsicossocialFormatado += `2. Pontuação do Assistente Social: ${pontuacaoFuzzySocial} / 2900 pontos (Grau Social: ${grauDeficienciaSocial})\n`;
  parecerBiopsicossocialFormatado += `3. SOMA DAS DUAS PONTUAÇÕES (SOMA PERICIAL CONSOLIDADA): ${pontuacaoFuzzySoma} / 5800 pontos\n`;
  parecerBiopsicossocialFormatado += `   Equivalente Normalizado (Escala 41 itens x 2): ${pontuacaoNormalizada8200} / 8200 pontos\n`;
  parecerBiopsicossocialFormatado += `   GRAU DE COMPROMETIMENTO FINAL UNIFICADO: ${grauDeficienciaFuzzySoma.toUpperCase()}\n\n`;
  parecerBiopsicossocialFormatado += `SÍNTESE CONCLUSIVA:\n`;

  if (grauDeficienciaFuzzySoma === 'Sem Deficiência') {
    parecerBiopsicossocialFormatado += `Com base na avaliação unificada do Médico Perito (${pontuacaoFuzzyMedico} pts) e do Assistente Social (${pontuacaoFuzzySocial} pts), somando ${pontuacaoFuzzySoma} de 5800 pontos, o(a) avaliado(a) NÃO atingiu a pontuação limite para enquadramento como Pessoa com Deficiência.`;
  } else {
    parecerBiopsicossocialFormatado += `Com base na soma das pontuações dos dois profissionais (${pontuacaoFuzzyMedico} pts Médico + ${pontuacaoFuzzySocial} pts Social = ${pontuacaoFuzzySoma} / 5800 pts) e aplicando o Modelo Linguístico Fuzzy, o(a) avaliado(a) ENQUADRA-SE como PESSOA COM DEFICIÊNCIA com Grau ${grauDeficienciaFuzzySoma.toUpperCase()}.`;
  }

  return {
    auditivaFuzzyAtingido,
    intelectualFuzzyAtingido,
    motoraFuzzyAtingido,
    visualFuzzyAtingido,
    
    pontuacaoBrutaMedico,
    pontuacaoFuzzyMedico,
    grauDeficienciaMedico,

    pontuacaoBrutaSocial,
    pontuacaoFuzzySocial,
    grauDeficienciaSocial,

    pontuacaoBrutaSoma,
    pontuacaoFuzzySoma,
    grauDeficienciaBrutoSoma,
    grauDeficienciaFuzzySoma,

    pontuacaoNormalizada8200,

    // Aliases
    pontuacaoBrutaTotal: pontuacaoBrutaSoma,
    pontuacaoFuzzyTotal: pontuacaoFuzzySoma,
    pontuacaoNormalizada41: pontuacaoNormalizada8200,
    grauDeficienciaBruto: grauDeficienciaBrutoSoma,
    grauDeficienciaFuzzy: grauDeficienciaFuzzySoma,

    dominiosPontuacao,
    resumoImpactoFuzzy,
    parecerBiopsicossocialFormatado,
  };
}
