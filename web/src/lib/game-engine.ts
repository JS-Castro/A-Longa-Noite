import {
  actionDefinitions,
  initialGameState,
  type ActionDefinition,
  type EventSummary,
  type GameState,
  type SurvivorSummary,
  type TurnLogEntry,
} from "@/lib/game-data";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const rotateEvents = (events: EventSummary[]) => {
  if (events.length <= 1) {
    return events;
  }

  const [first, ...rest] = events;
  return [...rest, first];
};

const updateSurvivorTension = (
  survivors: SurvivorSummary[],
  delta: number,
): SurvivorSummary[] =>
  survivors.map((survivor) => ({
    ...survivor,
    tensao: clamp(survivor.tensao + delta, 0, 100),
  }));

const logEntry = (turno: number, titulo: string, detalhe: string): TurnLogEntry => ({
  id: `log_${turno}_${titulo.toLowerCase().replaceAll(" ", "_")}`,
  turno,
  titulo,
  detalhe,
});

const actionById = (actionId: string): ActionDefinition =>
  actionDefinitions.find((action) => action.id === actionId) ?? actionDefinitions[0];

export const createInitialGameState = (): GameState =>
  JSON.parse(JSON.stringify(initialGameState)) as GameState;

export const resolveTurn = (state: GameState, actionId: string): GameState => {
  const nextTurn = state.turno + 1;
  const action = actionById(actionId);
  const currentEvent = state.events[0];

  switch (action.id) {
    case "explore_pharmacy":
      return {
        ...state,
        turno: nextTurn,
        selectedActionId: action.id,
        shelter: {
          ...state.shelter,
          mantimentos: clamp(state.shelter.mantimentos + 1, 0, 12),
          moral: clamp(state.shelter.moral + 2, 0, 100),
          pressaoDaNoite: clamp(state.shelter.pressaoDaNoite + 4, 0, 100),
        },
        survivors: updateSurvivorTension(state.survivors, 5),
        events: rotateEvents(state.events),
        log: [
          logEntry(
            nextTurn,
            "Saque sob neve",
            `A equipa regressou da farmacia com material util, mas o frio agravou a pressao. Evento ativo: ${currentEvent.titulo}.`,
          ),
          ...state.log,
        ],
      };
    case "fortify_gate":
      return {
        ...state,
        turno: nextTurn,
        selectedActionId: action.id,
        shelter: {
          ...state.shelter,
          combustivel: clamp(state.shelter.combustivel - 1, 0, 12),
          pressaoDaNoite: clamp(state.shelter.pressaoDaNoite - 8, 0, 100),
          moral: clamp(state.shelter.moral - 1, 0, 100),
        },
        survivors: updateSurvivorTension(state.survivors, 2),
        events: rotateEvents(state.events),
        log: [
          logEntry(
            nextTurn,
            "Porta norte reforcada",
            `A defesa aguentou mais uma noite, mas o abrigo gastou combustivel precioso. Evento ativo: ${currentEvent.titulo}.`,
          ),
          ...state.log,
        ],
      };
    case "ration_transparency":
      return {
        ...state,
        turno: nextTurn,
        selectedActionId: action.id,
        shelter: {
          ...state.shelter,
          mantimentos: clamp(state.shelter.mantimentos - 1, 0, 12),
          moral: clamp(state.shelter.moral + 5, 0, 100),
          pressaoDaNoite: clamp(state.shelter.pressaoDaNoite - 2, 0, 100),
        },
        survivors: updateSurvivorTension(state.survivors, -3),
        events: rotateEvents(state.events),
        log: [
          logEntry(
            nextTurn,
            "Racoes distribuidas",
            `A verdade custou comida, mas reduziu o atrito no abrigo. Evento ativo: ${currentEvent.titulo}.`,
          ),
          ...state.log,
        ],
      };
    case "investigate_tower":
      return {
        ...state,
        turno: nextTurn,
        selectedActionId: action.id,
        shelter: {
          ...state.shelter,
          moral: clamp(state.shelter.moral - 3, 0, 100),
          pressaoDaNoite: clamp(state.shelter.pressaoDaNoite - 5, 0, 100),
          ameacaExterior: "Ruido estranho detetado junto da torre",
        },
        survivors: updateSurvivorTension(state.survivors, 7),
        events: rotateEvents(state.events),
        log: [
          logEntry(
            nextTurn,
            "Torre investigada",
            `A ronda trouxe pistas sobre o Silencio Branco, mas deixou toda a colonia mais tensa. Evento ativo: ${currentEvent.titulo}.`,
          ),
          ...state.log,
        ],
      };
    default:
      return state;
  }
};
