export type RiskLevel = "baixo" | "medio" | "medio-alto" | "alto";

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

export type GameState = {
  turno: number;
  shelter: ShelterState;
  survivors: SurvivorSummary[];
  locations: LocationDefinition[];
  objective: ObjectiveState;
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
  locations,
  objective: mainObjective,
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
