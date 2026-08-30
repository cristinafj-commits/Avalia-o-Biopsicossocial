import { AvaliacaoCompleta } from '../types';

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
  { id: '7.1', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.1 Regular o comportamento nas interações', descricao: 'Controlar impulsos, reações emotivas e comportamentos agressivos.' },
  { id: '7.2', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.2 Interagir de acordo com as regras sociais', descricao: 'Respeitar costumes, normas de convivência, limites e hierarquias.' },
  { id: '7.3', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.3 Relacionamentos com estranhos', descricao: 'Manter interações adequadas com pessoas desconhecidas no cotidiano.' },
  { id: '7.4', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.4 Relacionamentos familiares e com pessoas familiares', descricao: 'Conviver harmoniosamente com parentes, vizinhos e amigos próximos.' },
  { id: '7.5', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.5 Relacionamentos íntimos', descricao: 'Desenvolver laços afetivos profundos, namoro, casamento e parceria.' },
  { id: '7.6', codigoDomain: 7, domainName: 'Socialização', nome: '7.6 Socialização', descricao: 'Participar de eventos sociais, reuniões, festas e momentos de lazer.' },
  { id: '7.7', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.7 Fazer as próprias escolhas', descricao: 'Exercer autonomia nas decisões do dia a dia e planos futuros.' },
  { id: '7.8', codigoDomain: 7, domainName: 'Socialização e Vida Comunitária', nome: '7.8 Vida Política e Cidadania', descricao: 'Votar, participar de associações, sindicatos e exercer direitos civis.' },
];

export const CIDS_FREQUENTES = [
  { code: 'F70', description: 'Retardo mental leve' },
  { code: 'F71', description: 'Retardo mental moderado' },
  { code: 'F72', description: 'Retardo mental grave' },
  { code: 'F84.0', description: 'Autismo infantil (Transtorno do Espectro Autista)' },
  { code: 'G80', description: 'Paralisia cerebral' },
  { code: 'G81', description: 'Hemiplegia' },
  { code: 'G82', description: 'Paraplegia e tetraplegia' },
  { code: 'H54.0', description: 'Cegueira de ambos os olhos' },
  { code: 'H54.1', description: 'Cegueira em um olho e visão reduzida no outro' },
  { code: 'H90.3', description: 'Perda de audição neurossensorial bilateral' },
  { code: 'M15', description: 'Poliartrose / Artrose grave' },
  { code: 'M54.5', description: 'Lumbago com ciática / Dor lombar crônica incapacitante' },
  { code: 'I69', description: 'Sequelas de doenças cerebrovasculares (AVC)' },
  { code: 'Q90', description: 'Síndrome de Down' },
  { code: 'Z73.6', description: 'Incapacidade que resulta em redução das atividades' },
];

export interface FuncaoCorporalCIFItem {
  key: keyof import('../types').FuncoesCorporaisAcometidas;
  nome: string;
  descricao: string;
}

export interface CategoriaCIF {
  numero: number;
  titulo: string;
  itens: FuncaoCorporalCIFItem[];
}

export const FUNCOES_CIF_DEF: CategoriaCIF[] = [
  {
    numero: 1,
    titulo: '1. Funções Mentais',
    itens: [
      {
        key: 'mentaisGlobais',
        nome: 'Funções Mentais Globais',
        descricao: 'consciência, orientação (tempo, lugar, pessoa), intelectuais (inclui desenvolvimento cognitivo e intelectual), psicossociais globais (inclui autismo), temperamento e personalidade, energia e impulsos, sono'
      },
      {
        key: 'mentaisEspecificas',
        nome: 'Funções Mentais Específicas',
        descricao: 'atenção, memória, psicomotoras, emocionais, percepção, pensamento, funções executivas, linguagem, cálculo, sequenciamento de movimentos complexos (inclui apraxia), experiência pessoal e do tempo'
      }
    ]
  },
  {
    numero: 2,
    titulo: '2. Funções Sensoriais e Dor',
    itens: [
      {
        key: 'visao',
        nome: 'Visão e Funções Relacionadas',
        descricao: 'acuidade visual, campo visual, funções dos músculos internos e externos do olho, da pálpebra, glândulas lacrimais'
      },
      {
        key: 'auditivas',
        nome: 'Funções Auditivas',
        descricao: 'detecção, descriminação, localização do som e da fala'
      },
      {
        key: 'vestibulares',
        nome: 'Funções Vestibulares',
        descricao: 'relacionadas à posição, equilíbrio e movimento'
      },
      {
        key: 'dor',
        nome: 'Dor',
        descricao: 'sensação desagradável que indica lesão potencial ou real em alguma parte do corpo. Generalizada ou localizada.'
      },
      {
        key: 'sensoriaisAdicionais',
        nome: 'Funções Sensoriais adicionais',
        descricao: 'gustativa, olfativa, proprioceptiva, tátil, à dor, temperatura'
      }
    ]
  },
  {
    numero: 3,
    titulo: '3. Funções da Voz e da Fala',
    itens: [
      {
        key: 'vozEFala',
        nome: 'Voz, articulação, fluência, ritmo da fala',
        descricao: 'funções da produção da voz, articulação fonética, fluência, modulação e ritmo da fala'
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
        descricao: 'funções do coração, vasos sanguíneos, pressão arterial'
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

export const RASCUNHO_INICIAL: AvaliacaoCompleta = {
  id: 'EVAL-2026-001',
  dataCriacao: new Date().toISOString(),
  dataAtualizacao: new Date().toISOString(),
  status: 'Em Andamento',
  statusGeral: 'pronto_para_emissao',
  
  processoAdministrativo: {
    numeroProcesso: 'PA-2026/00148',
    dataSolicitacao: '2026-08-15',
    motivoSolicitacao: 'Avaliação Biopsicossocial para Enquadramento Funcional (IF-BRA)',
    orgaoSolicitante: 'Câmara Municipal de Curitiba - Diretoria de Gestão de Pessoas (DGEP)',
    gestorResponsavel: 'Mariana Duarte Souza',
    matriculaGestor: 'GP-4402',
    observacoesRH: 'Solicitação instruída a pedido do servidor com laudos médicos anexos. Encaminhado para perícia médica e serviço social.',
    anexoNome: 'Processo_Administrativo_PA_2026_00148.pdf',
    anexoTamanho: '2.4 MB',
    anexoTipo: 'application/pdf'
  },
  
  servidor: {
    nome: 'João da Silva Santos',
    rg: '12.345.678-9 PR',
    cpf: '123.456.789-00',
    idade: '45',
    sexo: 'Masculino',
    matricula: '89421-0',
    cargo: 'Técnico Administrativo',
    setorLotacao: 'Coordenação de Protocolo e Arquivo Geral',
    dataAdmissao: '2012-03-15',
    telefone: '(41) 98877-6655',
    email: 'joao.santos@curitiba.pr.gov.br',
  },
  
  medico: {
    nome: 'Dra. Maria Clara Oliveira',
    crm: 'CRM/PR 24.510',
    ufCrm: 'PR',
    dataAvaliacao: new Date().toISOString().split('T')[0],
    localAvaliacao: 'Consultório / Junta Médica',
    informante: 'Avaliado(a) e pessoa de convívio',
    cidPrincipal: 'G80.0 - Paralisia Cerebral Espástica',
    cidSequela: 'M21.0 - Deformidade Adquirida de Membro',
    dataInicioImpedimento: '2015-08-10',
    historiaClinica: 'Servidor público municipal portador de sequela motora em membros inferiores decorrente de paralisia cerebral leve associada a discopatia crônica com limitação de marcha e dor crônica aos esforços prolongados.',
    assinaturaMedico: 'Dra. Maria Clara Oliveira - Perita Médica',
    statusPreenchimento: 'assinado',
    assinaturaDigital: {
      assinado: true,
      nomeSignatario: 'Dra. Maria Clara Oliveira',
      documentoProfissional: 'CRM/PR 24.510',
      uf: 'PR',
      dataHoraAssinatura: new Date().toISOString(),
      hashAutenticacao: 'SHA256:7F9A3B28C14E90B09923FEDC78A1',
      cargoFuncao: 'Médica Perita Oficial do Município'
    }
  },
  
  assistenteSocial: {
    nome: 'Dr. Carlos Eduardo Mendes',
    cress: 'CRESS/PR 8.320',
    ufCress: 'PR',
    dataAvaliacao: new Date().toISOString().split('T')[0],
    historicoSocial: 'Reside com a esposa e dois filhos em imóvel próprio com adaptações parciais. Necessita de apoio de terceiros para locomoção fora de casa e transporte público devido a barreiras de acessibilidade urbana.',
    fatoresAmbientaisBarreiras: 'Barreiras arquitetônicas no transporte público e calçadas. Presença de apoio familiar efetivo.',
    assinaturaSocial: 'Dr. Carlos Eduardo Mendes - Assistente Social',
    statusPreenchimento: 'assinado',
    assinaturaDigital: {
      assinado: true,
      nomeSignatario: 'Dr. Carlos Eduardo Mendes',
      documentoProfissional: 'CRESS/PR 8.320',
      uf: 'PR',
      dataHoraAssinatura: new Date().toISOString(),
      hashAutenticacao: 'SHA256:4C82E119A56D883719FF54009BA2',
      cargoFuncao: 'Analista em Serviço Social Pericial'
    }
  },
  
  tiposDeficiencia: {
    auditiva: false,
    intelectualCognitiva: false,
    motora: true,
    visual: false,
  },
  
  funcoesCorporais: {
    mentaisGlobais: false,
    mentaisEspecificas: false,
    visao: false,
    auditivas: false,
    vestibulares: false,
    dor: true,
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
    articuloesEOssos: true,
    musculares: true,
    movimentos: true,
    pelePelosUnhas: false,
  },
  
  questoesEmblematicas: {
    auditivaSurdezAntes6Anos: null,
    auditivaSemAuxilioTerceiros: null,
    
    intelectualNaoFicaSozinhoSeguranca: null,
    intelectualSemAuxilioTerceiros: null,
    
    motoraCadeiraDeRodasExclusiva: false,
    motoraSemAuxilioTerceiros: true,
    
    visualNaoEnxergavaAoNascer: null,
    visualSemAuxilioTerceiros: null,
  },
  
  atividades: {
    '1.1': 100, '1.2': 100, '1.3': 100, '1.4': 100, '1.5': 100,
    '2.1': 100, '2.2': 100, '2.3': 100, '2.4': 100, '2.5': 100,
    '3.1': 75,  '3.2': 75,  '3.3': 75,  '3.4': 100, '3.5': 75, '3.6': 50, '3.7': 50, '3.8': 75,
    '4.1': 75,  '4.2': 75,  '4.3': 100, '4.4': 100, '4.5': 75, '4.6': 100, '4.7': 100, '4.8': 100,
    '5.1': 100, '5.2': 75,  '5.3': 50,  '5.4': 75,  '5.5': 50,
    '6.1': 100, '6.2': 100, '6.3': 75,  '6.4': 75,  '6.5': 100,
    '7.1': 100, '7.2': 100, '7.3': 100, '7.4': 100, '7.5': 100, '7.6': 75, '7.7': 100, '7.8': 100,
  },

  atividadesMedico: {
    '1.1': 100, '1.2': 100, '1.3': 100, '1.4': 100, '1.5': 100,
    '2.1': 100, '2.2': 100, '2.3': 100, '2.4': 100, '2.5': 100,
    '3.1': 75,  '3.2': 75,  '3.3': 75,  '3.4': 100, '3.5': 75, '3.6': 50, '3.7': 50, '3.8': 75,
    '4.1': 75,  '4.2': 75,  '4.3': 100, '4.4': 100, '4.5': 75, '4.6': 100, '4.7': 100, '4.8': 100,
    '5.1': 100, '5.2': 75,  '5.3': 50,  '5.4': 75,  '5.5': 50,
    '6.1': 100, '6.2': 100, '6.3': 75,  '6.4': 75,  '6.5': 100,
    '7.1': 100, '7.2': 100, '7.3': 100, '7.4': 100, '7.5': 100, '7.6': 75, '7.7': 100, '7.8': 100,
  },

  atividadesSocial: {
    '1.1': 100, '1.2': 100, '1.3': 100, '1.4': 100, '1.5': 100,
    '2.1': 100, '2.2': 100, '2.3': 100, '2.4': 100, '2.5': 100,
    '3.1': 75,  '3.2': 75,  '3.3': 75,  '3.4': 100, '3.5': 75, '3.6': 50, '3.7': 50, '3.8': 75,
    '4.1': 75,  '4.2': 75,  '4.3': 100, '4.4': 100, '4.5': 75, '4.6': 100, '4.7': 100, '4.8': 100,
    '5.1': 100, '5.2': 75,  '5.3': 50,  '5.4': 75,  '5.5': 50,
    '6.1': 100, '6.2': 100, '6.3': 75,  '6.4': 75,  '6.5': 100,
    '7.1': 100, '7.2': 100, '7.3': 100, '7.4': 100, '7.5': 100, '7.6': 75, '7.7': 100, '7.8': 100,
  },
  
  observacoesAtividades: {
    '3.6': 'Dificuldade para caminhar mais de 100m sem dor intensa e risco de queda.',
    '3.7': 'Ônibus municipal sem elevador adaptado no bairro do servidor.',
    '5.3': 'Esposa auxilia na limpeza pesada da residência.',
  },
  observacoesAtividadesMedico: {
    '3.6': 'Exame pericial confirma alteração de marcha e crepitação articular com dor intensa a palpação.',
  },
  observacoesAtividadesSocial: {
    '3.6': 'Dificuldade para caminhar mais de 100m sem dor intensa e risco de queda.',
  }
};

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
      motivoSolicitacao: dadosProcesso?.motivoSolicitacao || 'Avaliação Biopsicossocial para Enquadramento Funcional',
      orgaoSolicitante: dadosProcesso?.orgaoSolicitante || 'Câmara Municipal de Curitiba - Diretoria de Gestão de Pessoas (DGEP)',
      gestorResponsavel: dadosProcesso?.gestorResponsavel || 'Diretoria de Gestão de Pessoas',
      matriculaGestor: dadosProcesso?.matriculaGestor || 'GP-001',
      observacoesRH: dadosProcesso?.observacoesRH || 'Processo administrativo autuado. Aguardando laudos periciais.',
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

