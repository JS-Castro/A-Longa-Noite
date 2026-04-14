import {
  actionDefinitions,
  allItems,
  initialGameState,
  lootByAction,
  type ActionDefinition,
  type EventChoice,
  type EventDefinition,
  type GameState,
  type ItemCardData,
  type LocationDefinition,
  type SurvivorSummary,
  type TurnPhase,
  type TurnLogEntry,
} from "@/lib/game-data";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const rotateEvents = (events: EventDefinition[]) => {
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

const updateLocationState = (
  locations: LocationDefinition[],
  secureLocationId?: string,
): LocationDefinition[] => {
  if (!secureLocationId) {
    return locations;
  }

  return locations.map((location) =>
    location.id === secureLocationId
      ? { ...location, estado: "seguro" }
      : location,
  );
};

const logEntry = (turno: number, titulo: string, detalhe: string): TurnLogEntry => ({
  id: `log_${turno}_${titulo.toLowerCase().replaceAll(" ", "_")}`,
  turno,
  titulo,
  detalhe,
});

const actionById = (actionId: string): ActionDefinition =>
  actionDefinitions.find((action) => action.id === actionId) ?? actionDefinitions[0];

const choiceById = (
  event: EventDefinition | undefined,
  choiceId: string | null,
): EventChoice | undefined =>
  event?.choices.find((choice) => choice.id === choiceId) ?? event?.choices[0];

const phaseOrder: TurnPhase[] = ["crise", "planeamento", "acao", "resolucao"];

export const createInitialGameState = (): GameState =>
  JSON.parse(JSON.stringify(initialGameState)) as GameState;

export const getNextPhase = (phase: TurnPhase): TurnPhase => {
  if (phase === "resolucao") {
    return "resolucao";
  }

  const currentIndex = phaseOrder.indexOf(phase);

  return phaseOrder[(currentIndex + 1) % phaseOrder.length] ?? "crise";
};

const applyChoiceImpact = (state: GameState, choice: EventChoice): GameState => ({
  ...state,
  shelter: {
    ...state.shelter,
    moral: clamp(state.shelter.moral + (choice.impact.moral ?? 0), 0, 100),
    mantimentos: clamp(
      state.shelter.mantimentos + (choice.impact.mantimentos ?? 0),
      0,
      12,
    ),
    combustivel: clamp(
      state.shelter.combustivel + (choice.impact.combustivel ?? 0),
      0,
      12,
    ),
    pressaoDaNoite: clamp(
      state.shelter.pressaoDaNoite + (choice.impact.pressaoDaNoite ?? 0),
      0,
      100,
    ),
    ameacaExterior:
      choice.impact.ameacaExterior ?? state.shelter.ameacaExterior,
  },
  survivors: updateSurvivorTension(
    state.survivors,
    choice.impact.survivorTension ?? 0,
  ),
  locations: updateLocationState(state.locations, choice.impact.secureLocationId),
  objective: {
    ...state.objective,
    progresso: clamp(
      state.objective.progresso + (choice.impact.objectiveProgress ?? 0),
      0,
      state.objective.alvo,
    ),
  },
});

const drawLoot = (state: GameState, actionId: string): ItemCardData | null => {
  const pool = lootByAction[actionId] ?? [];
  const owned = new Set([
    ...state.itemDeck.map((i) => i.id),
    ...state.pendingLoot.map((i) => i.id),
  ]);

  const available = pool.find((id) => !owned.has(id));
  if (!available) return null;

  return allItems.find((item) => item.id === available) ?? null;
};

const checkEndConditions = (state: GameState): GameState => {
  if (state.shelter.moral <= 0) {
    return { ...state, gameStatus: "defeat", defeatReason: "A colonia perdeu a vontade de lutar. O silencio tomou conta do abrigo." };
  }
  if (state.shelter.mantimentos <= 0) {
    return { ...state, gameStatus: "defeat", defeatReason: "Os mantimentos acabaram. O frio e a fome fizeram o resto." };
  }
  if (state.shelter.pressaoDaNoite >= 100) {
    return { ...state, gameStatus: "defeat", defeatReason: "Os Ermos tomaram o abrigo. Nenhum sobrevivente resistiu ao amanhecer." };
  }
  if (state.objective.progresso >= state.objective.alvo) {
    return { ...state, gameStatus: "victory" };
  }
  return state;
};

export const resolveTurn = (
  state: GameState,
  actionId: string,
  choiceId: string | null,
): GameState => {
  if (state.currentPhase !== "resolucao") {
    return state;
  }

  const nextTurn = state.turno + 1;
  const action = actionById(actionId);
  const currentEvent = state.events[0];
  const selectedChoice = choiceById(currentEvent, choiceId);

  const stateAfterChoice =
    selectedChoice !== undefined ? applyChoiceImpact(state, selectedChoice) : state;

  switch (action.id) {
    case "explore_pharmacy": {
      const loot = drawLoot(stateAfterChoice, action.id);
      return checkEndConditions({
        ...stateAfterChoice,
        turno: nextTurn,
        currentPhase: "crise",
        selectedActionId: action.id,
        selectedChoiceId: state.events[1]?.choices[0]?.id ?? null,
        pendingLoot: loot ? [loot] : [],
        shelter: {
          ...stateAfterChoice.shelter,
          mantimentos: clamp(stateAfterChoice.shelter.mantimentos + 1, 0, 12),
          moral: clamp(stateAfterChoice.shelter.moral + 2, 0, 100),
          pressaoDaNoite: clamp(stateAfterChoice.shelter.pressaoDaNoite + 4, 0, 100),
        },
        survivors: updateSurvivorTension(stateAfterChoice.survivors, 5),
        locations: updateLocationState(stateAfterChoice.locations, "loc_farmacia_encosta"),
        objective: {
          ...stateAfterChoice.objective,
          progresso: clamp(stateAfterChoice.objective.progresso + 1, 0, stateAfterChoice.objective.alvo),
        },
        events: rotateEvents(state.events),
        log: [
          logEntry(
            nextTurn,
            selectedChoice?.consequenceTitle ?? "Saque sob neve",
            `${selectedChoice?.consequenceDetail ?? "A equipa regressou da farmacia com material util, mas o frio agravou a pressao."} Acao do turno: ${action.label}.${loot ? ` Encontrado: ${loot.nome}.` : ""}`,
          ),
          ...stateAfterChoice.log,
        ],
      });
    }
    case "fortify_gate": {
      const loot = drawLoot(stateAfterChoice, action.id);
      return checkEndConditions({
        ...stateAfterChoice,
        turno: nextTurn,
        currentPhase: "crise",
        selectedActionId: action.id,
        selectedChoiceId: state.events[1]?.choices[0]?.id ?? null,
        pendingLoot: loot ? [loot] : [],
        shelter: {
          ...stateAfterChoice.shelter,
          combustivel: clamp(stateAfterChoice.shelter.combustivel - 1, 0, 12),
          pressaoDaNoite: clamp(stateAfterChoice.shelter.pressaoDaNoite - 8, 0, 100),
          moral: clamp(stateAfterChoice.shelter.moral - 1, 0, 100),
        },
        survivors: updateSurvivorTension(stateAfterChoice.survivors, 2),
        locations: updateLocationState(stateAfterChoice.locations, "loc_porta_norte"),
        objective: {
          ...stateAfterChoice.objective,
          progresso: clamp(stateAfterChoice.objective.progresso + 1, 0, stateAfterChoice.objective.alvo),
        },
        events: rotateEvents(state.events),
        log: [
          logEntry(
            nextTurn,
            selectedChoice?.consequenceTitle ?? "Porta norte reforcada",
            `${selectedChoice?.consequenceDetail ?? "A defesa aguentou mais uma noite, mas o abrigo gastou combustivel precioso."} Acao do turno: ${action.label}.${loot ? ` Recuperado: ${loot.nome}.` : ""}`,
          ),
          ...stateAfterChoice.log,
        ],
      });
    }
    case "ration_transparency": {
      const loot = drawLoot(stateAfterChoice, action.id);
      return checkEndConditions({
        ...stateAfterChoice,
        turno: nextTurn,
        currentPhase: "crise",
        selectedActionId: action.id,
        selectedChoiceId: state.events[1]?.choices[0]?.id ?? null,
        pendingLoot: loot ? [loot] : [],
        shelter: {
          ...stateAfterChoice.shelter,
          mantimentos: clamp(stateAfterChoice.shelter.mantimentos - 1, 0, 12),
          moral: clamp(stateAfterChoice.shelter.moral + 5, 0, 100),
          pressaoDaNoite: clamp(stateAfterChoice.shelter.pressaoDaNoite - 2, 0, 100),
        },
        survivors: updateSurvivorTension(stateAfterChoice.survivors, -3),
        objective: {
          ...stateAfterChoice.objective,
          progresso: clamp(stateAfterChoice.objective.progresso + 1, 0, stateAfterChoice.objective.alvo),
        },
        events: rotateEvents(state.events),
        log: [
          logEntry(
            nextTurn,
            selectedChoice?.consequenceTitle ?? "Racoes distribuidas",
            `${selectedChoice?.consequenceDetail ?? "A verdade custou comida, mas reduziu o atrito no abrigo."} Acao do turno: ${action.label}.${loot ? ` Encontrado no deposito: ${loot.nome}.` : ""}`,
          ),
          ...stateAfterChoice.log,
        ],
      });
    }
    case "investigate_tower": {
      const loot = drawLoot(stateAfterChoice, action.id);
      return checkEndConditions({
        ...stateAfterChoice,
        turno: nextTurn,
        currentPhase: "crise",
        selectedActionId: action.id,
        selectedChoiceId: state.events[1]?.choices[0]?.id ?? null,
        pendingLoot: loot ? [loot] : [],
        shelter: {
          ...stateAfterChoice.shelter,
          moral: clamp(stateAfterChoice.shelter.moral - 3, 0, 100),
          pressaoDaNoite: clamp(stateAfterChoice.shelter.pressaoDaNoite - 5, 0, 100),
          ameacaExterior:
            stateAfterChoice.shelter.ameacaExterior === state.shelter.ameacaExterior
              ? "Ruido estranho detetado junto da torre"
              : stateAfterChoice.shelter.ameacaExterior,
        },
        survivors: updateSurvivorTension(stateAfterChoice.survivors, 7),
        locations: updateLocationState(stateAfterChoice.locations, "loc_torre_observacao"),
        objective: {
          ...stateAfterChoice.objective,
          progresso: clamp(stateAfterChoice.objective.progresso + 1, 0, stateAfterChoice.objective.alvo),
        },
        events: rotateEvents(state.events),
        log: [
          logEntry(
            nextTurn,
            selectedChoice?.consequenceTitle ?? "Torre investigada",
            `${selectedChoice?.consequenceDetail ?? "A ronda trouxe pistas sobre o Silencio Branco, mas deixou toda a colonia mais tensa."} Acao do turno: ${action.label}.${loot ? ` Encontrado: ${loot.nome}.` : ""}`,
          ),
          ...stateAfterChoice.log,
        ],
      });
    }
    default:
      return state;
  }
};
