export type RiskLevel = "baixo" | "medio" | "medio-alto" | "alto";

export type SurvivorSummary = {
  id: string;
  nome: string;
  papel: string;
  estado: string;
  habilidade: string;
  tensao: number;
};

export type EventSummary = {
  id: string;
  titulo: string;
  local: string;
  texto: string;
  risco: RiskLevel;
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
};

export type TurnLogEntry = {
  id: string;
  turno: number;
  titulo: string;
  detalhe: string;
};

export type GameState = {
  turno: number;
  shelter: ShelterState;
  survivors: SurvivorSummary[];
  events: EventSummary[];
  selectedActionId: string;
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

export const eventQueue: EventSummary[] = [
  {
    id: "shelter_broken_wire",
    titulo: "O Fio no Gerador",
    local: "Sala das maquinas",
    texto:
      "Um cabo queimado pode deitar abaixo o aquecimento durante a noite. Tomas quer agir ja. O abrigo nao tem margem para outro erro.",
    risco: "medio",
  },
  {
    id: "shelter_steps_tower",
    titulo: "Passos na Torre",
    local: "Torre de observacao",
    texto:
      "Uma vigia ouviu passos num sitio fechado por dentro. Se for so medo, o rumor alastra. Se nao for, ha algo pior no abrigo.",
    risco: "medio-alto",
  },
  {
    id: "explore_fire_chapel",
    titulo: "Fogo na Capela",
    local: "Estrada velha",
    texto:
      "Uma luz viva aparece num ponto que devia estar abandonado. Pode ser ajuda, armadilha ou oportunidade rara.",
    risco: "alto",
  },
];

export const actionDefinitions: ActionDefinition[] = [
  {
    id: "explore_pharmacy",
    label: "Explorar a farmacia da encosta",
    resumo: "Procura medicamentos e mantimentos medicos, mas alonga a exposicao ao frio.",
  },
  {
    id: "fortify_gate",
    label: "Reforcar a porta norte",
    resumo: "Baixa a pressao exterior e compra tempo, mas custa combustivel e foco.",
  },
  {
    id: "ration_transparency",
    label: "Distribuir racoes com transparencia",
    resumo: "Ganha confianca e moral, mas acelera o consumo dos mantimentos.",
  },
  {
    id: "investigate_tower",
    label: "Investigar a torre antes do amanhecer",
    resumo: "Pode revelar pistas sobre o Silencio Branco, com risco alto para a equipa.",
  },
];

export const initialGameState: GameState = {
  turno: 1,
  shelter: shelterState,
  survivors: activeSurvivors,
  events: eventQueue,
  selectedActionId: actionDefinitions[0].id,
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
