import { GameState, EventChoiceImpact, ShelterState } from "./game-data";

/**
 * Applies an EventChoiceImpact to the GameState, returning a new immutable state.
 * All numeric impacts are clamped to their valid ranges.
 *
 * @param state - The current GameState
 * @param impact - The EventChoiceImpact to apply
 * @returns A new GameState with the impact applied
 */
export function applyChoiceImpact(
  state: GameState,
  impact: EventChoiceImpact
): GameState {
  // Create new shelter state with clamped values
  const newShelter: ShelterState = {
    ...state.shelter,
    moral: clampValue(
      state.shelter.moral + (impact.moral ?? 0),
      0,
      100
    ),
    mantimentos: clampValue(
      state.shelter.mantimentos + (impact.mantimentos ?? 0),
      0,
      20
    ),
    combustivel: clampValue(
      state.shelter.combustivel + (impact.combustivel ?? 0),
      0,
      15
    ),
    pressaoDaNoite: clampValue(
      state.shelter.pressaoDaNoite + (impact.pressaoDaNoite ?? 0),
      0,
      100
    ),
    ameacaExterior: impact.ameacaExterior ?? state.shelter.ameacaExterior,
  };

  // Apply survivor tension evenly across all survivors
  const survivorTensionDelta = impact.survivorTension ?? 0;
  const newSurvivors = state.survivors.map((survivor) => ({
    ...survivor,
    tensao: clampValue(survivor.tensao + survivorTensionDelta, 0, 100),
  }));

  // Update objective progress
  const newObjective = {
    ...state.objective,
    progresso: clampValue(
      state.objective.progresso + (impact.objectiveProgress ?? 0),
      0,
      state.objective.alvo
    ),
  };

  // Return new state (immutable)
  return {
    ...state,
    shelter: newShelter,
    survivors: newSurvivors,
    objective: newObjective,
  };
}

/**
 * Validates a GameState to ensure all numeric values are within valid ranges.
 *
 * @param state - The GameState to validate
 * @returns An object with valid flag and array of error messages
 */
export function validateGameState(
  state: GameState
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate shelter values
  if (state.shelter.moral < 0 || state.shelter.moral > 100) {
    errors.push(
      `Abrigo moral deve estar entre 0 e 100, recebido ${state.shelter.moral}`
    );
  }
  if (state.shelter.mantimentos < 0 || state.shelter.mantimentos > 20) {
    errors.push(
      `Abrigo mantimentos deve estar entre 0 e 20, recebido ${state.shelter.mantimentos}`
    );
  }
  if (state.shelter.combustivel < 0 || state.shelter.combustivel > 15) {
    errors.push(
      `Abrigo combustivel deve estar entre 0 e 15, recebido ${state.shelter.combustivel}`
    );
  }
  if (state.shelter.pressaoDaNoite < 0 || state.shelter.pressaoDaNoite > 100) {
    errors.push(
      `Abrigo pressaoDaNoite deve estar entre 0 e 100, recebido ${state.shelter.pressaoDaNoite}`
    );
  }

  // Validate survivor tensions
  state.survivors.forEach((survivor) => {
    if (survivor.tensao < 0 || survivor.tensao > 100) {
      errors.push(
        `Sobrevivente ${survivor.id} tensao deve estar entre 0 e 100, recebido ${survivor.tensao}`
      );
    }
  });

  // Validate objective progress
  if (state.objective.progresso < 0 || state.objective.progresso > state.objective.alvo) {
    errors.push(
      `Objetivo progresso deve estar entre 0 e ${state.objective.alvo} (alvo), recebido ${state.objective.progresso}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Clamps a value between min and max (inclusive).
 *
 * @param value - The value to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value
 */
function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
