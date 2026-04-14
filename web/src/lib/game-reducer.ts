import {
  GameState,
  EventDefinition,
  TurnPhase,
  TurnLogEntry,
} from "./game-data";
import { applyChoiceImpact } from "./game-logic";
import { applyEndConditions } from "./game-conditions";

/**
 * Resolves a choice and advances the turn phase.
 *
 * Finds the choice in the current event, applies its impact to the game state,
 * creates a log entry, and advances the turn phase. If transitioning to a new
 * turn (phase becomes "crise"), rotates the event queue.
 *
 * @param state - The current GameState
 * @param choiceId - The ID of the choice to resolve
 * @returns A new GameState with the choice resolved and phase advanced
 */
export function resolveChoiceAndAdvanceTurn(
  state: GameState,
  choiceId: string
): GameState {
  // Get the current event
  const currentEvent = getCurrentEvent(state);
  if (!currentEvent) {
    return state;
  }

  // Find the choice in the current event
  const choice = currentEvent.choices.find((c) => c.id === choiceId);
  if (!choice) {
    return state;
  }

  // Apply the choice impact to the game state
  let newState = applyChoiceImpact(state, choice.impact);

  // Create a log entry for this choice resolution
  const logEntry: TurnLogEntry = {
    id: `log_${state.turno}_${choiceId}`,
    turno: state.turno,
    titulo: choice.consequenceTitle,
    detalhe: choice.consequenceDetail,
  };

  newState = {
    ...newState,
    log: [...newState.log, logEntry],
  };

  // Advance the turn phase
  const nextPhase = advancePhase(state.currentPhase);
  newState = {
    ...newState,
    currentPhase: nextPhase,
  };

  // If transitioning to a new turn (phase becomes "crise"), rotate the event queue
  if (nextPhase === "crise") {
    newState = {
      ...newState,
      events: rotateEventQueue(newState.events),
      turno: newState.turno + 1,
    };
  }

  // Apply end game conditions (victory/defeat checks)
  return applyEndConditions(newState);
}

/**
 * Advances the turn phase without applying a choice impact.
 *
 * Moves to the next phase in the cycle: crise → planeamento → acao → resolucao → crise.
 * If transitioning to a new turn (phase becomes "crise"), rotates the event queue
 * and increments the turn number.
 *
 * @param state - The current GameState
 * @returns A new GameState with the phase advanced
 */
export function advanceTurn(state: GameState): GameState {
  const nextPhase = advancePhase(state.currentPhase);

  let newState: GameState = {
    ...state,
    currentPhase: nextPhase,
  };

  // If transitioning to a new turn (phase becomes "crise"), rotate the event queue
  if (nextPhase === "crise") {
    newState = {
      ...newState,
      events: rotateEventQueue(newState.events),
      turno: newState.turno + 1,
    };
  }

  // Apply end game conditions (victory/defeat checks)
  return applyEndConditions(newState);
}

/**
 * Gets the current active event from the event queue.
 *
 * @param state - The current GameState
 * @returns The first event in the queue, or null if the queue is empty
 */
export function getCurrentEvent(state: GameState): EventDefinition | null {
  return state.events.length > 0 ? state.events[0] : null;
}

/**
 * Rotates the event queue in a circular manner.
 *
 * Removes the first event and appends it to the end of the queue,
 * simulating a circular rotation for continuous event cycling.
 *
 * @param events - The current event queue
 * @returns A new array with the queue rotated
 */
export function rotateEventQueue(events: EventDefinition[]): EventDefinition[] {
  if (events.length <= 1) {
    return events;
  }

  return [...events.slice(1), events[0]];
}

/**
 * Internal helper function to advance to the next phase in the turn cycle.
 *
 * Cycle: crise → planeamento → acao → resolucao → crise
 *
 * @param currentPhase - The current phase
 * @returns The next phase
 */
function advancePhase(currentPhase: TurnPhase): TurnPhase {
  const phaseOrder: TurnPhase[] = ["crise", "planeamento", "acao", "resolucao"];
  const currentIndex = phaseOrder.indexOf(currentPhase);
  const nextIndex = (currentIndex + 1) % phaseOrder.length;
  return phaseOrder[nextIndex];
}
