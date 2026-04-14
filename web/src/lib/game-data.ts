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
  targetLocationId?: string;
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

export type GameStatus = "playing" | "victory" | "defeat";

export type GameState = {
  turno: number;
  currentPhase: TurnPhase;
  gameStatus: GameStatus;
  defeatReason: string | null;
  shelter: ShelterState;
  survivors: SurvivorSummary[];
  locations: LocationDefinition[];
  objective: ObjectiveState;
  itemDeck: ItemCardData[];
  pendingLoot: ItemCardData[];
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

import charactersData from "@/data/characters.json";
import eventsData from "@/data/events.json";
import itemsData from "@/data/items.json";
import locationsData from "@/data/locations.json";

type CharacterJson = {
  id: string;
  nome: string;
  papel: string;
  habilidade: string;
};

type LocationJson = {
  id: string;
  nome: string;
  tipo: LocationDefinition["tipo"];
  estado: LocationDefinition["estado"];
  distancia: string;
  recompensa: string;
};

type EventChoiceJson = {
  id: string;
  label: string;
  detalhe: string;
  consequenceTitle: string;
  consequenceDetail: string;
  impact: EventChoiceImpact;
};

type EventJson = {
  id: string;
  titulo: string;
  local: string;
  texto: string;
  risco: RiskLevel;
  choices: EventChoiceJson[];
};

const characterStates: Record<string, { estado: string; tensao: number }> = {
  survivor_alma_macedo: { estado: "Exausta, mas estavel", tensao: 34 },
  survivor_tomas_barradas: { estado: "Em manutencao continua", tensao: 27 },
  survivor_ines_seixo: { estado: "Obcecada com um sinal", tensao: 52 },
  survivor_roque_vale: { estado: "Em alerta agressivo", tensao: 46 },
  survivor_leonor_vilar: { estado: "Pronta para sair", tensao: 18 },
  survivor_duarte_caeiro: { estado: "A registar tudo", tensao: 41 },
};

export const activeSurvivors: SurvivorSummary[] = (charactersData as CharacterJson[]).map(
  (char) => ({
    id: char.id,
    nome: char.nome,
    papel: char.papel,
    estado: characterStates[char.id]?.estado || "Desconhecido",
    habilidade: char.habilidade,
    tensao: characterStates[char.id]?.tensao || 0,
  }),
);

export const locations: LocationDefinition[] = (locationsData as LocationJson[]).map(
  (loc) => ({
    id: loc.id,
    nome: loc.nome,
    tipo: loc.tipo,
    estado: loc.estado,
    distancia: loc.distancia,
    recompensa: loc.recompensa,
  }),
);

export const mainObjective: ObjectiveState = {
  titulo: "Segurar a Estacao Ate ao Amanhecer de Emergencia",
  descricao:
    "Estabilizar o abrigo, proteger acessos e reunir margem suficiente para aguentar a proxima vaga de frio.",
  progresso: 1,
  alvo: 6,
};

export const allItems: ItemCardData[] = itemsData as ItemCardData[];

export const itemDeck: ItemCardData[] = [
  allItems[0],
  allItems[1],
  allItems[2],
];

export const lootByAction: Record<string, string[]> = {
  explore_pharmacy: ["item_antibioticos", "item_vendas_estereis", "item_mantimentos_enlatados"],
  fortify_gate: ["item_garrafa_combustivel", "item_fio_eletrico"],
  investigate_tower: ["item_documentos_estranhos", "item_sinalizador"],
  ration_transparency: ["item_racao_emergencia", "item_manta_termica"],
};

export const eventQueue: EventDefinition[] = (eventsData as EventJson[]).map(
  (event) => ({
    id: event.id,
    titulo: event.titulo,
    local: event.local,
    texto: event.texto,
    risco: event.risco,
    choices: event.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      detalhe: choice.detalhe,
      consequenceTitle: choice.consequenceTitle,
      consequenceDetail: choice.consequenceDetail,
      impact: choice.impact,
    })),
  }),
);

export const actionDefinitions: ActionDefinition[] = [
  {
    id: "explore_pharmacy",
    label: "Explorar a farmacia da encosta",
    resumo: "Procura medicamentos e mantimentos medicos, mas alonga a exposicao ao frio.",
    allowedPhase: "acao",
    targetLocationId: "loc_farmacia_encosta",
  },
  {
    id: "fortify_gate",
    label: "Reforcar a porta norte",
    resumo: "Baixa a pressao exterior e compra tempo, mas custa combustivel e foco.",
    allowedPhase: "acao",
    targetLocationId: "loc_porta_norte",
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
    targetLocationId: "loc_torre_observacao",
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
  gameStatus: "playing",
  defeatReason: null,
  pendingLoot: [],
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

// Re-export game logic functions
export { applyChoiceImpact, validateGameState } from "./game-logic";
