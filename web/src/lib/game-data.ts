export type RiskLevel = "baixo" | "medio" | "medio-alto" | "alto";
export type TurnPhase = "crise" | "planeamento" | "acao" | "resolucao";

export type SurvivorSummary = {
  id: string;
  nome: string;
  papel: string;
  estado: string;
  habilidade: string;
  tensao: number;
};

export type ShelterState = {
  nome: string;
  temperatura: string;
  moral: number;
  mantimentos: number;
  combustivel: number;
  pressaoDaNoite: number;
  ameacaExterior: string;
};

export type ActionDefinition = {
  id: string;
  label: string;
  resumo: string;
  allowedPhase: TurnPhase;
};

export type LocationDefinition = {
  id: string;
  nome: string;
  tipo: "saque" | "abrigo" | "risco" | "facção";
  estado: "seguro" | "instavel" | "hostil";
  distancia: string;
  recompensa: string;
};

export type ObjectiveState = {
  titulo: string;
  descricao: string;
  progresso: number;
  alvo: number;
};

export type ItemCardData = {
  id: string;
  nome: string;
  quantidade: number;
  efeito: string;
  origem: string;
  categoria: "mantimentos" | "medico" | "municao" | "ferramenta";
  flavor: string;
  accent: string;
};

export type EventChoiceImpact = {
  moral?: number;
  mantimentos?: number;
  combustivel?: number;
  pressaoDaNoite?: number;
  survivorTension?: number;
  ameacaExterior?: string;
  objectiveProgress?: number;
  secureLocationId?: string;
};

export type EventChoice = {
  id: string;
  label: string;
  detalhe: string;
  consequenceTitle: string;
  consequenceDetail: string;
  impact: EventChoiceImpact;
};

export type EventDefinition = {
  id: string;
  titulo: string;
  local: string;
  texto: string;
  risco: RiskLevel;
  choices: EventChoice[];
};

export type TurnLogEntry = {
  id: string;
  turno: number;
  titulo: string;
  detalhe: string;
};

export type TurnPhaseDefinition = {
  id: TurnPhase;
  label: string;
  resumo: string;
  allowed: string[];
};

export type RulesSection = {
  id: string;
  titulo: string;
  items: string[];
};

export type GameState = {
  turno: number;
  currentPhase: TurnPhase;
  shelter: ShelterState;
  survivors: SurvivorSummary[];
  locations: LocationDefinition[];
  objective: ObjectiveState;
  itemDeck: ItemCardData[];
  events: EventDefinition[];
  selectedActionId: string;
  selectedChoiceId: string | null;
  log: TurnLogEntry[];
};

export const shelterState: ShelterState = {
  nome: "Estacao Vaga-Lume",
  temperatura: "-18 C",
  moral: 61,
  mantimentos: 4,
  combustivel: 3,
  pressaoDaNoite: 57,
  ameacaExterior: "Ermos avistados na encosta norte",
};

export const activeSurvivors: SurvivorSummary[] = [
  {
    id: "survivor_alma_macedo",
    nome: "Alma Macedo",
    papel: "Enfermaria",
    estado: "Exausta, mas estavel",
    habilidade: "Mao Firme",
    tensao: 34,
  },
  {
    id: "survivor_tomas_barradas",
    nome: "Tomas Barradas",
    papel: "Gerador",
    estado: "Em manutencao continua",
    habilidade: "Desenrascanço",
    tensao: 27,
  },
  {
    id: "survivor_ines_seixo",
    nome: "Ines Seixo",
    papel: "Radio e exploracao",
    estado: "Obcecada com um sinal",
    habilidade: "Escuta Longa",
    tensao: 52,
  },
  {
    id: "survivor_roque_vale",
    nome: "Roque Vale",
    papel: "Rondas",
    estado: "Em alerta agressivo",
    habilidade: "Linha Dura",
    tensao: 46,
  },
];

export const locations: LocationDefinition[] = [
  {
    id: "loc_farmacia_encosta",
    nome: "Farmacia da Encosta",
    tipo: "saque",
    estado: "instavel",
    distancia: "20 min",
    recompensa: "medicamentos e material medico",
  },
  {
    id: "loc_torre_observacao",
    nome: "Torre de Observacao",
    tipo: "risco",
    estado: "instavel",
    distancia: "5 min",
    recompensa: "informacao sobre a serra",
  },
  {
    id: "loc_capela_velha",
    nome: "Capela da Estrada Velha",
    tipo: "facção",
    estado: "hostil",
    distancia: "35 min",
    recompensa: "contato, abrigo secundario ou conflito",
  },
  {
    id: "loc_porta_norte",
    nome: "Porta Norte",
    tipo: "abrigo",
    estado: "instavel",
    distancia: "0 min",
    recompensa: "tempo e defesa do abrigo",
  },
];

export const mainObjective: ObjectiveState = {
  titulo: "Segurar a Estacao Ate ao Amanhecer de Emergencia",
  descricao:
    "Estabilizar o abrigo, proteger acessos e reunir margem suficiente para aguentar a proxima vaga de frio.",
  progresso: 1,
  alvo: 6,
};

export const itemDeck: ItemCardData[] = [
  {
    id: "item_mantimentos_enlatados",
    nome: "Mantimentos Enlatados",
    quantidade: 2,
    efeito: "Adicionar 2 unidades de comida ao abrigo.",
    origem: "Farmacia da Encosta",
    categoria: "mantimentos",
    flavor: "Ferrugem por fora, alivio por dentro.",
    accent: "#b45309",
  },
  {
    id: "item_kit_medico",
    nome: "Kit Medico Improvisado",
    quantidade: 1,
    efeito: "Reduz o impacto de um ferimento ou crise medica.",
    origem: "Enfermaria da colonia",
    categoria: "medico",
    flavor: "Nada disto inspira confianca. Tudo isto pode salvar uma vida.",
    accent: "#0f766e",
  },
  {
    id: "item_cartuchos",
    nome: "Cartuchos Recuperados",
    quantidade: 3,
    efeito: "Permitem defesa armada em encontros de alto risco.",
    origem: "Porta Norte",
    categoria: "municao",
    flavor: "Poucos, frios e demasiado valiosos para desperdiçar.",
    accent: "#7f1d1d",
  },
];

export const eventQueue: EventDefinition[] = [
  {
    id: "shelter_broken_wire",
    titulo: "O Fio no Gerador",
    local: "Sala das maquinas",
    texto:
      "Um cabo queimado pode deitar abaixo o aquecimento durante a noite. Tomas quer agir ja. O abrigo nao tem margem para outro erro.",
    risco: "medio",
    choices: [
      {
        id: "repair_now",
        label: "Reparar ja",
        detalhe: "Gasta combustivel e folego para estabilizar o aquecimento antes da noite cair.",
        consequenceTitle: "Gerador estabilizado",
        consequenceDetail:
          "A equipa resolveu o problema antes do pior frio. O abrigo gastou recursos, mas a moral segurou-se.",
        impact: {
          combustivel: -1,
          moral: 2,
          pressaoDaNoite: -6,
          survivorTension: 2,
          objectiveProgress: 1,
        },
      },
      {
        id: "patch_temp",
        label: "Fazer remendo temporario",
        detalhe: "Poupa combustivel agora, mas arrisca deixar a colonia vulneravel durante a madrugada.",
        consequenceTitle: "Remendo inseguro",
        consequenceDetail:
          "O sistema voltou a trabalhar, mas os estalidos no gerador fizeram crescer o medo de uma falha pior.",
        impact: {
          combustivel: 0,
          moral: -1,
          pressaoDaNoite: 5,
          survivorTension: 4,
        },
      },
    ],
  },
  {
    id: "shelter_steps_tower",
    titulo: "Passos na Torre",
    local: "Torre de observacao",
    texto:
      "Uma vigia ouviu passos num sitio fechado por dentro. Se for so medo, o rumor alastra. Se nao for, ha algo pior no abrigo.",
    risco: "medio-alto",
    choices: [
      {
        id: "search_tower",
        label: "Subir e investigar",
        detalhe: "Uma ronda curta, nervosa e silenciosa tenta encontrar a origem do barulho.",
        consequenceTitle: "Sinais na estrutura",
        consequenceDetail:
          "A torre nao revelou um intruso, mas ha marcas frescas na escada e o mistério pesa sobre todos.",
        impact: {
          moral: -2,
          pressaoDaNoite: -3,
          survivorTension: 6,
          ameacaExterior: "Ruido estranho detetado junto da torre",
          secureLocationId: "loc_torre_observacao",
          objectiveProgress: 1,
        },
      },
      {
        id: "seal_tower",
        label: "Fechar a torre",
        detalhe: "A prioridade passa a ser conter o rumor e impedir rondas isoladas até haver mais certezas.",
        consequenceTitle: "Silencio imposto",
        consequenceDetail:
          "A torre foi selada. A colonia ganhou tempo, mas alguns sobreviventes sentem que algo importante ficou por descobrir.",
        impact: {
          moral: -1,
          pressaoDaNoite: -1,
          survivorTension: 2,
          secureLocationId: "loc_torre_observacao",
        },
      },
    ],
  },
  {
    id: "explore_fire_chapel",
    titulo: "Fogo na Capela",
    local: "Estrada velha",
    texto:
      "Uma luz viva aparece num ponto que devia estar abandonado. Pode ser ajuda, armadilha ou oportunidade rara.",
    risco: "alto",
    choices: [
      {
        id: "observe_first",
        label: "Observar primeiro",
        detalhe: "A equipa mantém distância e tenta perceber quem está no interior antes de agir.",
        consequenceTitle: "Contacto evitado",
        consequenceDetail:
          "O abrigo não ganhou novos aliados, mas também evitou uma emboscada precipitada na neve.",
        impact: {
          moral: 1,
          pressaoDaNoite: -2,
          survivorTension: 1,
          objectiveProgress: 1,
        },
      },
      {
        id: "enter_fast",
        label: "Entrar de rompante",
        detalhe: "Aposta-se na iniciativa e na força para reclamar o espaço antes que o perigo reaja.",
        consequenceTitle: "Confronto na capela",
        consequenceDetail:
          "O grupo encontrou recursos, mas o barulho trouxe atenção indesejada e deixou a equipa mais tensa.",
        impact: {
          mantimentos: 1,
          moral: -1,
          pressaoDaNoite: 4,
          survivorTension: 5,
          secureLocationId: "loc_capela_velha",
        },
      },
    ],
  },
];

export const actionDefinitions: ActionDefinition[] = [
  {
    id: "explore_pharmacy",
    label: "Explorar a farmacia da encosta",
    resumo: "Procura medicamentos e mantimentos medicos, mas alonga a exposicao ao frio.",
    allowedPhase: "acao",
  },
  {
    id: "fortify_gate",
    label: "Reforcar a porta norte",
    resumo: "Baixa a pressao exterior e compra tempo, mas custa combustivel e foco.",
    allowedPhase: "acao",
  },
  {
    id: "ration_transparency",
    label: "Distribuir racoes com transparencia",
    resumo: "Ganha confianca e moral, mas acelera o consumo dos mantimentos.",
    allowedPhase: "acao",
  },
  {
    id: "investigate_tower",
    label: "Investigar a torre antes do amanhecer",
    resumo: "Pode revelar pistas sobre o Silencio Branco, com risco alto para a equipa.",
    allowedPhase: "acao",
  },
];

export const turnPhases: TurnPhaseDefinition[] = [
  {
    id: "crise",
    label: "Crise",
    resumo: "Resolver o dilema imediato da noite e escolher a resposta da colonia.",
    allowed: [
      "Escolher a opcao do evento ativo.",
      "Ler o texto do evento e preparar a decisao do turno.",
    ],
  },
  {
    id: "planeamento",
    label: "Planeamento",
    resumo: "Preparar o abrigo e organizar cartas antes da acao principal.",
    allowed: [
      "Arrastar cartas para a zona de preparacao do abrigo.",
      "Avaliar recursos antes de comprometer a equipa.",
    ],
  },
  {
    id: "acao",
    label: "Acao",
    resumo: "Escolher a jogada principal do turno.",
    allowed: [
      "Selecionar a acao principal do turno.",
      "Confirmar o alvo no tabuleiro antes de passar a resolucao.",
    ],
  },
  {
    id: "resolucao",
    label: "Resolucao",
    resumo: "Aplicar consequencias, atualizar o estado e abrir o turno seguinte.",
    allowed: [
      "Resolver o turno.",
      "Consultar o feed narrativo e confirmar o impacto da jogada.",
    ],
  },
];

export const rulesSections: RulesSection[] = [
  {
    id: "flow",
    titulo: "Estrutura do turno",
    items: [
      "Cada turno passa por quatro fases fixas: Crise, Planeamento, Acao e Resolucao.",
      "Nao se pode saltar diretamente para a acao final sem primeiro fechar a resposta ao evento e a preparacao.",
      "Depois de resolver o turno, o jogo regressa a Crise para abrir um novo dilema.",
    ],
  },
  {
    id: "timing",
    titulo: "Janelas permitidas",
    items: [
      "As escolhas do evento ativo so podem ser alteradas durante a fase de Crise.",
      "O drag and drop das cartas para o abrigo so fica ativo durante Planeamento.",
      "A selecao da acao principal so fica disponivel durante Acao.",
      "O botao de resolver turno so funciona durante Resolucao.",
    ],
  },
  {
    id: "board",
    titulo: "Base inspirada no board game",
    items: [
      "A ordem do turno inspira-se em jogos de sobrevivencia por rondas, com pressao crescente, gestao de abrigo e escolhas de risco.",
      "O prototipo usa como base a ideia de colonia central, locais exteriores, evento por turno e consequencias encadeadas.",
      "A implementacao e o universo de A Longa Noite sao originais e podem simplificar ou expandir regras consoante o vertical slice evolui.",
    ],
  },
  {
    id: "goal",
    titulo: "Leitura rapida do objetivo",
    items: [
      "Tens de proteger o abrigo, manter a moral acima da ruptura e empurrar o objetivo principal ate ao alvo.",
      "Pressao da noite alta, tensao acumulada e falta de mantimentos tornam os turnos seguintes mais perigosos.",
      "Nem todas as boas decisoes ajudam imediatamente; algumas compram tempo, outras sacrificam recursos para evitar colapso.",
    ],
  },
];

export const initialGameState: GameState = {
  turno: 1,
  currentPhase: "crise",
  shelter: shelterState,
  survivors: activeSurvivors,
  locations,
  objective: mainObjective,
  itemDeck,
  events: eventQueue,
  selectedActionId: actionDefinitions[0].id,
  selectedChoiceId: eventQueue[0]?.choices[0]?.id ?? null,
  log: [
    {
      id: "log_1",
      turno: 1,
      titulo: "A colonia aguenta por pouco",
      detalhe:
        "A Estacao Vaga-Lume entra na noite com combustivel curto, moral instavel e um sinal estranho vindo da encosta.",
    },
  ],
};
