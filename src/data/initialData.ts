import { AvaliacaoCompleta } from '../types';

export interface CidItem {
  codigo: string;
  descricao: string;
  categoria: string;
}

export const CIDS_FREQUENTES: CidItem[] = [
  { codigo: 'G80.0', descricao: 'Paralisia cerebral espástica quadriplégica/diplégica', categoria: 'Neurológica / Motora' },
  { codigo: 'G80.9', descricao: 'Paralisia cerebral não especificada', categoria: 'Neurológica / Motora' },
  { codigo: 'M21.0', descricao: 'Deformidade em valgo adquirida', categoria: 'Ortopédica / Motora' },
  { codigo: 'M54.5', descricao: 'Dor lombar baixa (Lombalgia crônica incapacitante)', categoria: 'Ortopédica / Coluna' },
  { codigo: 'M51.1', descricao: 'Transtornos de discos lombares com radiculopatia', categoria: 'Ortopédica / Coluna' },
  { codigo: 'H54.0', descricao: 'Cegueira, ambos os olhos (Visão subnormal grave/cegueira)', categoria: 'Sensorial / Visual' },
  { codigo: 'H54.4', descricao: 'Cegueira em um olho (Visão monocular - Lei 14.126/2021)', categoria: 'Sensorial / Visual' },
  { codigo: 'H90.3', descricao: 'Perda de audição bilateral neuro-sensorial', categoria: 'Sensorial / Auditiva' },
  { codigo: 'H90.5', descricao: 'Perda auditiva neuro-sensorial não especificada', categoria: 'Sensorial / Auditiva' },
  { codigo: 'F70', descricao: 'Retardo mental leve (Deficiência Intelectual)', categoria: 'Mental / Intelectual' },
  { codigo: 'F71', descricao: 'Retardo mental moderado', categoria: 'Mental / Intelectual' },
  { codigo: 'F84.0', descricao: 'Autismo infantil (Transtorno do Espectro Autista - TEA)', categoria: 'Neurodesenvolvimento' },
  { codigo: 'F84.1', descricao: 'Autismo atípico', categoria: 'Neurodesenvolvimento' },
  { codigo: 'F84.5', descricao: 'Síndrome de Asperger', categoria: 'Neurodesenvolvimento' },
  { codigo: 'G20', descricao: 'Doença de Parkinson', categoria: 'Neurológica degenerativa' },
  { codigo: 'G35', descricao: 'Esclerose múltipla', categoria: 'Neurológica desmielinizante' },
  { codigo: 'I69.4', descricao: 'Sequelas de acidente vascular cerebral (AVC/AVE)', categoria: 'Neurológica / Vascular' },
  { codigo: 'T92.6', descricao: 'Sequelas de amputação de membro superior/mão', categoria: 'Traumatológica' },
  { codigo: 'T93.6', descricao: 'Sequelas de amputação de membro inferior/pé', categoria: 'Traumatológica' },
];

export interface AtividadeDef {
  id: string;
  codigoDomain: number;
  domainName: string;
  nome: string;
  descricao: string;
}

export const ATIVIDADES_IFBRA_DEF: AtividadeDef[] = [
  // Domínio 1: Aprendizagem e Aplicação do Conhecimento
  { id: '1.1', codigoDomain: 1, domainName: 'Aprendizagem e Aplicação do Conhecimento', nome: '1.1 Observar', descricao: 'Usar o sentido da visão de forma intencional para perceber estímulos visuais.' },
  { id: '1.2', codigoDomain: 1, domainName: 'Aprendizagem e Aplicação do Conhecimento', nome: '1.2 OUVIR', descricao: 'Usar o sentido da audição de forma intencional para perceber estímulos auditivos.' },
  { id: '1.3', codigoDomain: 1, domainName: 'Aprendizagem e Aplicação do Conhecimento', nome: '1.3 Aprender', descricao: 'Adquirir novos conhecimentos, habilidades e comportamentos.' },
  { id: '1.4', codigoDomain: 1, domainName: 'Aprendizagem e Aplicação do Conhecimento', nome: '1.4 Pensar', descricao: 'Formular ideias, raciocinar, conceituar e julgar de forma abstrata e prática.' },
  { id: '1.5', codigoDomain: 1, domainName: 'Aprendizagem e Aplicação do Conhecimento', nome: '1.5 Ler', descricao: 'Compreender textos escritos e símbolos gráficos em linguagem verbal ou tátil (LIBRAS/Braille).' },

  // Domínio 2: Comunicação
  { id: '2.1', codigoDomain: 2, domainName: 'Comunicação', nome: '2.1 Comunicar-se / receber mensagens verbais', descricao: 'Compreender o sentido literal e implícito de falas e mensagens orais.' },
  { id: '2.2', codigoDomain: 2, domainName: 'Comunicação', nome: '2.2 Comunicar-se / receber mensagens não-verbais', descricao: 'Compreender gestos, expressões faciais, linguagem corporal e sinalizações.' },
  { id: '2.3', codigoDomain: 2, domainName: 'Comunicação', nome: '2.3 Produção de mensagens faladas/linguagem de sinais', descricao: 'Expressar pensamentos e sentimentos oralmente ou por LIBRAS.' },
  { id: '2.4', codigoDomain: 2, domainName: 'Comunicação', nome: '2.4 Produção de mensagens não-verbais', descricao: 'Expressar-se por meio de gestos, símbolos, escrita ou recursos alternativos.' },
  { id: '2.5', codigoDomain: 2, domainName: 'Comunicação', nome: '2.5 Conversação', descricao: 'Iniciar, manter e encerrar trocas comunicativas e diálogos com uma ou mais pessoas.' },

  // Domínio 3: Mobilidade
  { id: '3.1', codigoDomain: 3, domainName: 'Mobilidade', nome: '3.1 Mudar a posição básica do corpo', descricao: 'Abaixar-se, ajoelhar-se, sentar-se, levantar-se, inclinar-se.' },
  { id: '3.2', codigoDomain: 3, domainName: 'Mobilidade', nome: '3.2 Manter a posição do corpo', descricao: 'Permanecer na mesma posição corporal (sentado ou em pé) conforme necessário.' },
  { id: '3.3', codigoDomain: 3, domainName: 'Mobilidade', nome: '3.3 Transferir-se', descricao: 'Mover-se de um lugar para outro próximo (ex.: da cama para a cadeira).' },
  { id: '3.4', codigoDomain: 3, domainName: 'Mobilidade', nome: '3.4 Deslocar-se dentro de casa', descricao: 'Caminhar ou locomover-se entre os cômodos da própria residência.' },
  { id: '3.5', codigoDomain: 3, domainName: 'Mobilidade', nome: '3.5 Deslocar-se dentro de edifícios que não a própria casa', descricao: 'Locomover-se em locais de trabalho, comércio ou órgãos públicos.' },
  { id: '3.6', codigoDomain: 3, domainName: 'Mobilidade', nome: '3.6 Deslocar-se fora de sua casa e de outros edifícios', descricao: 'Locomover-se em vias públicas, calçadas, ruas e áreas abertas.' },
  { id: '3.7', codigoDomain: 3, domainName: 'Mobilidade', nome: '3.7 Utilizar transporte coletivo', descricao: 'Embarcar, permanecer e desembarcar de ônibus, metrô ou trens.' },
  { id: '3.8', codigoDomain: 3, domainName: 'Mobilidade', nome: '3.8 Utilizar transporte individual como passageiro', descricao: 'Utilizar carros, táxis ou veículos particulares como passageiro.' },

  // Domínio 4: Cuidados Pessoais
  { id: '4.1', codigoDomain: 4, domainName: 'Cuidados Pessoais', nome: '4.1 Lavar-se', descricao: 'Tomar banho, lavar e enxugar o corpo ou partes dele.' },
  { id: '4.2', codigoDomain: 4, domainName: 'Cuidados Pessoais', nome: '4.2 Cuidar de partes do corpo', descricao: 'Escovar dentes, pentear cabelos, cortar unhas, fazer a barba/maquiagem.' },
  { id: '4.3', codigoDomain: 4, domainName: 'Cuidados Pessoais', nome: '4.3 Regulação da micção', descricao: 'Indicar necessidade, usar o sanitário e higienizar-se para urinálise.' },
  { id: '4.4', codigoDomain: 4, domainName: 'Cuidados Pessoais', nome: '4.4 Regulação da defecação', descricao: 'Indicar necessidade, usar o sanitário e higienizar-se para evacuação.' },
  { id: '4.5', codigoDomain: 4, domainName: 'Cuidados Pessoais', nome: '4.5 Vestir-se', descricao: 'Escolher, vestir e despir roupas e calçados adequadamente.' },
  { id: '4.6', codigoDomain: 4, domainName: 'Cuidados Pessoais', nome: '4.6 Comer', descricao: 'Levar alimentos à boca, mastigar e engolir refeições.' },
  { id: '4.7', codigoDomain: 4, domainName: 'Cuidados Pessoais', nome: '4.7 Beber', descricao: 'Pegar copos ou recipientes e ingerir líquidos.' },
  { id: '4.8', codigoDomain: 4, domainName: 'Cuidados Pessoais', nome: '4.8 Capacidade de identificar agravos à saúde', descricao: 'Reconhecer sintomas de dor, febre ou mal-estar e buscar auxílio.' },

  // Domínio 5: Vida Doméstica
  { id: '5.1', codigoDomain: 5, domainName: 'Vida Doméstica', nome: '5.1 Preparar refeições tipo lanches', descricao: 'Montar lanches simples, passar manteiga no pão, servir café/suco.' },
  { id: '5.2', codigoDomain: 5, domainName: 'Vida Doméstica', nome: '5.2 Cozinhar', descricao: 'Planejar, manipular fogão e utensílios e preparar refeições quentes.' },
  { id: '5.3', codigoDomain: 5, domainName: 'Vida Doméstica', nome: '5.3 Realizar tarefas domésticas', descricao: 'Lavar louça, varrer, arrumar camas, lavar e passar roupas.' },
  { id: '5.4', codigoDomain: 5, domainName: 'Vida Doméstica', nome: '5.4 Manutenção e uso apropriado de objetos pessoais e utensílios da casa', descricao: 'Guardar utensílios, organizar pertences e operar eletrodomésticos.' },
  { id: '5.5', codigoDomain: 5, domainName: 'Vida Doméstica', nome: '5.5 Cuidar dos outros', descricao: 'Auxiliar familiares, filhos ou dependentes em tarefas diárias.' },

  // Domínio 6: Educação, Trabalho e Vida Econômica
  { id: '6.1', codigoDomain: 6, domainName: 'Educação, Trabalho e Vida Econômica', nome: '6.1 Educação', descricao: 'Participar do processo formal ou informal de aprendizagem escolar/acadêmica.' },
  { id: '6.2', codigoDomain: 6, domainName: 'Educação, Trabalho e Vida Econômica', nome: '6.2 Qualificação profissional', descricao: 'Frequentar cursos capacitações para inserção no mercado de trabalho.' },
  { id: '6.3', codigoDomain: 6, domainName: 'Educação, Trabalho e Vida Econômica', nome: '6.3 Trabalho remunerado', descricao: 'Desempenhar atividades produtivas e profissionais no serviço público/privado.' },
  { id: '6.4', codigoDomain: 6, domainName: 'Educação, Trabalho e Vida Econômica', nome: '6.4 Fazer compras e contratar serviços', descricao: 'Selecionar produtos, pagar, conferir troco em estabelecimentos comerciais.' },
  { id: '6.5', codigoDomain: 6, domainName: 'Educação, Trabalho e Vida Econômica', nome: '6.5 Administração de recursos econômicos pessoais', descricao: 'Gerir orçamento, contas bancárias, pagamentos e renda individual.' },

  // Domínio 7: Socialização e Vida Comunitária
  { id: '7.1', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.1 Comunidade', descricao: 'Participar de eventos sociais, recreativos ou esportivos em clubes/associações.' },
  { id: '7.2', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.2 Recreação e lazer', descricao: 'Praticar hobbies, jogos, artesanato ou comparecer a cinemas/parques.' },
  { id: '7.3', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.3 Religião e espiritualidade', descricao: 'Frequentar templos, cerimônias ou grupos religiosos comunitários.' },
  { id: '7.4', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.4 Direitos humanos', descricao: 'Exercer cidadania, usufruir de prerrogativas legais e garantias fundamentais.' },
  { id: '7.5', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.5 Vida política e cidadania', descricao: 'Votar, filiar-se a representações de classe e participar de conselhos.' },
  { id: '7.6', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.6 Relacionamentos com pessoas estranhas', descricao: 'Interagir com cordialidade com desconhecidos em ambientes públicos.' },
  { id: '7.7', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.7 Relacionamentos com pessoas conhecidas', descricao: 'Manter convivência com vizinhos, colegas de trabalho e amigos.' },
  { id: '7.8', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.8 Família', descricao: 'Conviver harmoniosamente no ambiente doméstico com familiares.' },
];

export interface FuncaoCIFDef {
  numero: number;
  titulo: string;
  itens: {
    key: keyof import('../types').FuncoesCorporaisAcometidas;
    nome: string;
    descricao: string;
  }[];
}

export const FUNCOES_CIF_DEF: FuncaoCIFDef[] = [
  {
    numero: 1,
    titulo: '1. Funções Mentais',
    itens: [
      {
        key: 'mentaisGlobais',
        nome: 'Funções Mentais Globais',
        descricao: 'consciência, orientação, intelectuais, psicossociais globais, temperamento e personalidade, energia e impulsos, sono'
      },
      {
        key: 'mentaisEspecificas',
        nome: 'Funções Mentais Específicas',
        descricao: 'atenção, memória, psicomotoras, emocionais, perceptivas, do pensamento, cognitivas superiores, da linguagem, de cálculo, dos movimentos complexos, de autorregulação'
      }
    ]
  },
  {
    numero: 2,
    titulo: '2. Funções Sensoriais e Dor',
    itens: [
      {
        key: 'visao',
        nome: 'Funções da Visão',
        descricao: 'visuais, acuidade visual, campo visual, qualidade da visão, funções das estruturas adjacentes ao olho'
      },
      {
        key: 'auditivas',
        nome: 'Funções Auditivas',
        descricao: 'auditivas, localização do som, discriminação lateral, discriminação da fala'
      },
      {
        key: 'vestibulares',
        nome: 'Funções Vestibulares',
        descricao: 'de posição, de equilíbrio, de movimento'
      },
      {
        key: 'sensoriaisAdicionais',
        nome: 'Funções Sensoriais Adicionais',
        descricao: 'gustativas, olfativas, proprioceptivas, táteis, térmicas e outras sensações cutâneas'
      },
      {
        key: 'dor',
        nome: 'Sensação de Dor',
        descricao: 'dor em uma parte do corpo, dor em múltiplas partes do corpo, dor generalizada, dor irradiada, dor em um dermátomo, dor provocada por estímulos não nocivos'
      }
    ]
  },
  {
    numero: 3,
    titulo: '3. Funções da Voz e da Fala',
    itens: [
      {
        key: 'vozEFala',
        nome: 'Funções da Voz e da Fala',
        descricao: 'produção da voz, qualidade da voz, fonação, articulação, fluência e ritmo da fala'
      }
    ]
  },
  {
    numero: 4,
    titulo: '4. Funções dos Sistemas Cardiovascular, Hematológico, Imunológico e Respiratório',
    itens: [
      {
        key: 'cardiovascular',
        nome: 'Funções do Sistema Cardiovascular',
        descricao: 'do coração, dos vasos sanguíneos, pressão arterial'
      },
      {
        key: 'hematologico',
        nome: 'Funções do Sistema Hematológico',
        descricao: 'produção de sangue, transporte de oxigênio e metabólitos e de coagulação'
      },
      {
        key: 'imunologico',
        nome: 'Funções do Sistema Imunológico',
        descricao: 'resposta imunológica, reações de hipersensibilidade, funções do sistema linfático'
      },
      {
        key: 'respiratorio',
        nome: 'Funções do Sistema Respiratório',
        descricao: 'respiratórias, dos músculos respiratórios, de tolerância aos exercícios'
      }
    ]
  },
  {
    numero: 5,
    titulo: '5. Funções dos Sistemas Digestivo, Metabólico e Endócrino',
    itens: [
      {
        key: 'digestivo',
        nome: 'Funções do Sistema Digestivo',
        descricao: 'ingestão, deglutição, digestivas, assimilação, defecação, manutenção de peso'
      },
      {
        key: 'metabolismoEndocrino',
        nome: 'Funções do Metabolismo e Sistema Endócrino',
        descricao: 'funções metabólicas gerais, equilíbrio hídrico, mineral e eletrolítico, termorreguladoras, das glândulas endócrinas'
      }
    ]
  },
  {
    numero: 6,
    titulo: '6. Funções Genitourinárias e Reprodutivas',
    itens: [
      {
        key: 'urinarias',
        nome: 'Funções Urinárias',
        descricao: 'funções de filtragem, coleta e excreção de urina'
      },
      {
        key: 'genitaisReprodutivas',
        nome: 'Funções Genitais e Reprodutivas',
        descricao: 'funções mentais e físicas/motoras relacionadas ao ato sexual, da menstruação, procriação'
      }
    ]
  },
  {
    numero: 7,
    titulo: '7. Funções Neuromusculoesqueléticas e relacionadas ao movimento',
    itens: [
      {
        key: 'articuloesEOssos',
        nome: 'Funções das Articulações e dos Ossos',
        descricao: 'mobilidade, estabilidade das articulações e ossos'
      },
      {
        key: 'musculares',
        nome: 'Funções Musculares',
        descricao: 'força, tônus e resistência muscular'
      },
      {
        key: 'movimentos',
        nome: 'Funções dos Movimentos',
        descricao: 'reflexo motor, movimentos involuntários, controle dos movimentos voluntários, padrão de marcha, sensações relacionadas aos músculos e funções do movimento'
      }
    ]
  },
  {
    numero: 8,
    titulo: '8. Funções da Pele e Estruturas Relacionadas',
    itens: [
      {
        key: 'pelePelosUnhas',
        nome: 'Funções da Pele, pelos e unhas',
        descricao: 'protetora, reparadora, sensação relacionada à pele, pelos e unhas'
      }
    ]
  }
];

// MODELO DE AVALIAÇÃO LIMPO E EM BRANCO PARA TESTES
export const CRIAR_AVALIACAO_LIMPA = (): AvaliacaoCompleta => {
  const numRandom = Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString();
  return {
    id: `EVAL-${new Date().getFullYear()}-${numRandom}`,
    dataCriacao: now,
    dataAtualizacao: now,
    status: 'Em Andamento',
    statusGeral: 'solicitado_rh',
    
    processoAdministrativo: {
      numeroProcesso: '',
      dataSolicitacao: now.split('T')[0],
      motivoSolicitacao: 'Avaliação Biopsicossocial para Enquadramento Funcional (IF-BRA)',
      orgaoSolicitante: 'Câmara Municipal de Curitiba - Diretoria de Gestão de Pessoas (DGEP)',
      gestorResponsavel: '',
      matriculaGestor: '',
      observacoesRH: '',
      anexoNome: '',
      anexoTamanho: '',
      anexoDataUrl: '',
      anexoTipo: ''
    },
    
    servidor: {
      nome: '',
      rg: '',
      cpf: '',
      idade: '',
      sexo: 'Masculino',
      matricula: '',
      cargo: '',
      setorLotacao: '',
      dataAdmissao: '',
      telefone: '',
      email: '',
    },
    
    medico: {
      nome: '',
      crm: '',
      ufCrm: 'PR',
      dataAvaliacao: now.split('T')[0],
      localAvaliacao: 'Consultório / Junta Médica',
      informante: 'Próprio avaliado(a)',
      cidPrincipal: '',
      cidSequela: '',
      dataInicioImpedimento: '',
      historiaClinica: '',
      assinaturaMedico: '',
      statusPreenchimento: 'pendente'
    },
    
    assistenteSocial: {
      nome: '',
      cress: '',
      ufCress: 'PR',
      dataAvaliacao: now.split('T')[0],
      historicoSocial: '',
      fatoresAmbientaisBarreiras: '',
      assinaturaSocial: '',
      statusPreenchimento: 'pendente'
    },
    
    tiposDeficiencia: {
      auditiva: false,
      intelectualCognitiva: false,
      motora: false,
      visual: false,
    },
    
    funcoesCorporais: {
      mentaisGlobais: false,
      mentaisEspecificas: false,
      visao: false,
      auditivas: false,
      vestibulares: false,
      dor: false,
      sensoriaisAdicionais: false,
      vozEFala: false,
      cardiovascular: false,
      hematologico: false,
      imunologico: false,
      respiratorio: false,
      digestivo: false,
      metabolismoEndocrino: false,
      urinarias: false,
      genitaisReprodutivas: false,
      articuloesEOssos: false,
      musculares: false,
      movimentos: false,
      pelePelosUnhas: false,
    },
    
    questoesEmblematicas: {
      auditivaSurdezAntes6Anos: null,
      auditivaSemAuxilioTerceiros: null,
      intelectualNaoFicaSozinhoSeguranca: null,
      intelectualSemAuxilioTerceiros: null,
      motoraCadeiraDeRodasExclusiva: null,
      motoraSemAuxilioTerceiros: null,
      visualNaoEnxergavaAoNascer: null,
      visualSemAuxilioTerceiros: null,
    },
    
    atividades: {},
    atividadesMedico: {},
    atividadesSocial: {},
    observacoesAtividades: {},
    observacoesAtividadesMedico: {},
    observacoesAtividadesSocial: {},
  };
};

export const RASCUNHO_INICIAL: AvaliacaoCompleta = CRIAR_AVALIACAO_LIMPA();

export const CRIAR_NOVA_AVALIACAO_RH = (dadosServidor?: Partial<import('../types').ServidorData>, dadosProcesso?: Partial<import('../types').ProcessoAdministrativoData>): AvaliacaoCompleta => {
  const numRandom = Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString();
  return {
    id: `EVAL-${new Date().getFullYear()}-${numRandom}`,
    dataCriacao: now,
    dataAtualizacao: now,
    status: 'Em Andamento',
    statusGeral: 'pendente_pericias',
    
    processoAdministrativo: {
      numeroProcesso: dadosProcesso?.numeroProcesso || `PA-${new Date().getFullYear()}/00${numRandom}`,
      dataSolicitacao: dadosProcesso?.dataSolicitacao || now.split('T')[0],
      motivoSolicitacao: dadosProcesso?.motivoSolicitacao || 'Avaliação Biopsicossocial para Enquadramento Funcional (IF-BRA)',
      orgaoSolicitante: dadosProcesso?.orgaoSolicitante || 'Câmara Municipal de Curitiba - Diretoria de Gestão de Pessoas (DGEP)',
      gestorResponsavel: dadosProcesso?.gestorResponsavel || '',
      matriculaGestor: dadosProcesso?.matriculaGestor || '',
      observacoesRH: dadosProcesso?.observacoesRH || '',
      anexoNome: dadosProcesso?.anexoNome || '',
      anexoTamanho: dadosProcesso?.anexoTamanho || '',
      anexoDataUrl: dadosProcesso?.anexoDataUrl || '',
      anexoTipo: dadosProcesso?.anexoTipo || ''
    },
    
    servidor: {
      nome: dadosServidor?.nome || '',
      rg: dadosServidor?.rg || '',
      cpf: dadosServidor?.cpf || '',
      idade: dadosServidor?.idade || '',
      sexo: dadosServidor?.sexo || 'Masculino',
      matricula: dadosServidor?.matricula || '',
      cargo: dadosServidor?.cargo || '',
      setorLotacao: dadosServidor?.setorLotacao || '',
      dataAdmissao: dadosServidor?.dataAdmissao || '',
      telefone: dadosServidor?.telefone || '',
      email: dadosServidor?.email || '',
    },
    
    medico: {
      nome: '',
      crm: '',
      ufCrm: 'PR',
      dataAvaliacao: now.split('T')[0],
      localAvaliacao: 'Consultório / Junta Médica',
      informante: 'Próprio avaliado(a)',
      cidPrincipal: '',
      cidSequela: '',
      dataInicioImpedimento: '',
      historiaClinica: '',
      assinaturaMedico: '',
      statusPreenchimento: 'pendente'
    },
    
    assistenteSocial: {
      nome: '',
      cress: '',
      ufCress: 'PR',
      dataAvaliacao: now.split('T')[0],
      historicoSocial: '',
      fatoresAmbientaisBarreiras: '',
      assinaturaSocial: '',
      statusPreenchimento: 'pendente'
    },
    
    tiposDeficiencia: {
      auditiva: false,
      intelectualCognitiva: false,
      motora: false,
      visual: false,
    },
    
    funcoesCorporais: {
      mentaisGlobais: false,
      mentaisEspecificas: false,
      visao: false,
      auditivas: false,
      vestibulares: false,
      dor: false,
      sensoriaisAdicionais: false,
      vozEFala: false,
      cardiovascular: false,
      hematologico: false,
      imunologico: false,
      respiratorio: false,
      digestivo: false,
      metabolismoEndocrino: false,
      urinarias: false,
      genitaisReprodutivas: false,
      articuloesEOssos: false,
      musculares: false,
      movimentos: false,
      pelePelosUnhas: false,
    },
    
    questoesEmblematicas: {
      auditivaSurdezAntes6Anos: null,
      auditivaSemAuxilioTerceiros: null,
      intelectualNaoFicaSozinhoSeguranca: null,
      intelectualSemAuxilioTerceiros: null,
      motoraCadeiraDeRodasExclusiva: null,
      motoraSemAuxilioTerceiros: null,
      visualNaoEnxergavaAoNascer: null,
      visualSemAuxilioTerceiros: null,
    },
    
    atividades: {},
    atividadesMedico: {},
    atividadesSocial: {},
    observacoesAtividades: {},
    observacoesAtividadesMedico: {},
    observacoesAtividadesSocial: {},
  };
};
