export type UserProfile = 'rh' | 'medico' | 'social';

export interface AuthUser {
  email: string;
  nome: string;
  perfil: UserProfile;
  documento?: string; // CRM, CRESS, or Matrícula
  uf?: string;
  cargo: string;
  dataLogin: string;
}

export type StatusAvaliacaoGeral = 
  | 'solicitado_rh' 
  | 'pendente_pericias' 
  | 'aguardando_social' 
  | 'aguardando_medico' 
  | 'pronto_para_emissao' 
  | 'homologado';

export type StatusProfissional = 'pendente' | 'em_andamento' | 'assinado';

export type SexoType = 'Masculino' | 'Feminino' | 'Outro';

export type LocalAvaliacaoType = 'Domicílio' | 'Consultório / Junta Médica' | 'Hospital' | 'Outro';

export type InformanteType = 
  | 'Próprio avaliado(a)'
  | 'Pessoa de convívio próximo'
  | 'Avaliado(a) e pessoa de convívio'
  | 'Outra pessoa';

export type PontuacaoIFBRA = 100 | 75 | 50 | 25;

export type GrauDeficiencia = 'Grave' | 'Moderada' | 'Leve' | 'Sem Deficiência';

export interface ProcessoAdministrativoData {
  numeroProcesso: string; // e.g. "PA-2026/00148"
  dataSolicitacao: string;
  motivoSolicitacao: string; // e.g. "Enquadramento Funcional PCD / Lei 13.146", "Concurso Público - Reserva de Vagas", "Readaptação"
  orgaoSolicitante: string; // e.g. "Secretaria Municipal de Administração e Recursos Humanos"
  gestorResponsavel: string;
  matriculaGestor: string;
  observacoesRH?: string;
  anexoNome?: string;
  anexoTamanho?: string;
  anexoDataUrl?: string; // base64 representation of PDF or scan
  anexoTipo?: string;
}

export interface ServidorData {
  nome: string;
  rg: string;
  cpf: string;
  idade: string;
  sexo: SexoType;
  matricula: string;
  cargo: string;
  setorLotacao?: string;
  dataAdmissao: string;
  telefone?: string;
  email?: string;
}

export interface RetificacaoRegistro {
  id: string;
  perfil: 'medico' | 'social';
  nomeProfissional: string;
  documentoProfissional: string;
  dataHora: string;
  justificativa: string;
}

export interface AssinaturaEletronica {
  assinado: boolean;
  nomeSignatario: string;
  documentoProfissional: string; // CRM or CRESS
  uf: string;
  dataHoraAssinatura: string;
  hashAutenticacao?: string;
  cargoFuncao: string;
}

export interface MedicoData {
  nome: string;
  crm: string;
  ufCrm?: string;
  dataAvaliacao: string;
  localAvaliacao: LocalAvaliacaoType;
  informante: InformanteType;
  informanteOutroText?: string;
  cidPrincipal: string;
  cidSequela: string;
  dataInicioImpedimento: string;
  historiaClinica: string;
  assinaturaMedico: string; // Visual signature text or token
  assinaturaDigital?: AssinaturaEletronica;
  statusPreenchimento?: StatusProfissional;
}

export interface AssistenteSocialData {
  nome: string;
  cress: string;
  ufCress?: string;
  dataAvaliacao: string;
  historicoSocial: string;
  fatoresAmbientaisBarreiras: string;
  assinaturaSocial: string;
  assinaturaDigital?: AssinaturaEletronica;
  statusPreenchimento?: StatusProfissional;
}

export interface TiposDeficiencia {
  auditiva: boolean;
  intelectualCognitiva: boolean;
  motora: boolean;
  visual: boolean;
}

export interface FuncoesCorporaisAcometidas {
  mentaisGlobais: boolean;
  mentaisEspecificas: boolean;
  visao: boolean;
  auditivas: boolean;
  vestibulares: boolean;
  dor: boolean;
  sensoriaisAdicionais: boolean;
  vozEFala: boolean;
  cardiovascular: boolean;
  hematologico: boolean;
  imunologico: boolean;
  respiratorio: boolean;
  digestivo: boolean;
  metabolismoEndocrino: boolean;
  urinarias: boolean;
  genitaisReprodutivas: boolean;
  articuloesEOssos: boolean;
  musculares: boolean;
  movimentos: boolean;
  pelePelosUnhas: boolean;
}

export interface QuestoesEmblematicasFuzzy {
  auditivaSurdezAntes6Anos: boolean | null;
  auditivaSemAuxilioTerceiros: boolean | null;
  
  intelectualNaoFicaSozinhoSeguranca: boolean | null;
  intelectualSemAuxilioTerceiros: boolean | null;
  
  motoraCadeiraDeRodasExclusiva: boolean | null;
  motoraSemAuxilioTerceiros: boolean | null;
  
  visualNaoEnxergavaAoNascer: boolean | null;
  visualSemAuxilioTerceiros: boolean | null;
}

export interface AtividadeIFBRA {
  id: string; // e.g. '1.1', '2.3'
  codigoDomain: number; // 1 to 7
  domainName: string;
  nome: string;
  descricao: string;
  pontuacao: PontuacaoIFBRA;
  observacoes?: string;
}

export interface DominioPontuacao {
  codigoDomain: number;
  nomeDomain: string;
  qtdAtividades: number;
  
  // Medical IF-BRA Domain Scores
  totalBrutoMedico: number;
  totalAjustadoFuzzyMedico: number;
  
  // Social IF-BRA Domain Scores
  totalBrutoSocial: number;
  totalAjustadoFuzzySocial: number;
  
  // Combined Sum (Médico + Social)
  totalBrutoSoma: number;
  totalAjustadoFuzzySoma: number;
  
  // Backward compatibility alias fields
  totalBruto: number;
  totalAjustadoFuzzy: number;

  atividades: {
    id: string;
    nome: string;
    brutoMedico: PontuacaoIFBRA;
    ajustadoMedico: PontuacaoIFBRA;
    brutoSocial: PontuacaoIFBRA;
    ajustadoSocial: PontuacaoIFBRA;
    somaBruta: number;
    somaFuzzy: number;
    // Backward compatibility aliases
    bruto: PontuacaoIFBRA;
    ajustado: PontuacaoIFBRA;
  }[];
}

export interface ResultadoAvaliacaoFuzzy {
  auditivaFuzzyAtingido: boolean;
  intelectualFuzzyAtingido: boolean;
  motoraFuzzyAtingido: boolean;
  visualFuzzyAtingido: boolean;
  
  // Scores per evaluator (Max 2900 pts each)
  pontuacaoBrutaMedico: number;
  pontuacaoFuzzyMedico: number;
  grauDeficienciaMedico: GrauDeficiencia;

  pontuacaoBrutaSocial: number;
  pontuacaoFuzzySocial: number;
  grauDeficienciaSocial: GrauDeficiencia;

  // COMBINED SUM OF BOTH EVALUATIONS (Max 5800 pts)
  pontuacaoBrutaSoma: number;
  pontuacaoFuzzySoma: number;
  grauDeficienciaBrutoSoma: GrauDeficiencia;
  grauDeficienciaFuzzySoma: GrauDeficiencia;
  
  // Standardized equivalents for 41 items evaluated twice (Max 8200 pts)
  pontuacaoNormalizada8200: number;

  // Aliases for compatibility
  pontuacaoBrutaTotal: number; // alias to pontuacaoBrutaSoma
  pontuacaoFuzzyTotal: number; // alias to pontuacaoFuzzySoma
  pontuacaoNormalizada41: number; // alias to pontuacaoNormalizada8200
  grauDeficienciaBruto: GrauDeficiencia; // alias to grauDeficienciaBrutoSoma
  grauDeficienciaFuzzy: GrauDeficiencia; // alias to grauDeficienciaFuzzySoma
  
  dominiosPontuacao: DominioPontuacao[];
  resumoImpactoFuzzy: string[];
  parecerBiopsicossocialFormatado: string;
}

export interface AvaliacaoCompleta {
  id: string;
  dataCriacao: string;
  dataAtualizacao: string;
  status: 'Rascunho' | 'Em Andamento' | 'Concluído';
  statusGeral?: StatusAvaliacaoGeral;
  
  // Processo Administrativo e Solicitação RH
  processoAdministrativo: ProcessoAdministrativoData;
  
  servidor: ServidorData;
  medico: MedicoData;
  assistenteSocial: AssistenteSocialData;
  
  tiposDeficiencia: TiposDeficiencia;
  funcoesCorporais: FuncoesCorporaisAcometidas;
  questoesEmblematicas: QuestoesEmblematicasFuzzy;
  
  atividades: Record<string, PontuacaoIFBRA>; // key: activity id ('1.1', '1.2'...) -> score
  observacoesAtividades?: Record<string, string>;
  
  atividadesMedico?: Record<string, PontuacaoIFBRA>; // Medical IF-BRA evaluation
  observacoesAtividadesMedico?: Record<string, string>;
  
  atividadesSocial?: Record<string, PontuacaoIFBRA>; // Social IF-BRA evaluation
  observacoesAtividadesSocial?: Record<string, string>;
  
  // Homologação RH
  homologadoRH?: boolean;
  dataHomologacao?: string;
  responsavelHomologacao?: string;

  // Histórico de Retificações Periciais com Justificativa
  retificacoes?: RetificacaoRegistro[];
}

