import { GameState } from "./game-data";

/**
 * Checks if the victory condition has been met.
 *
 * Victory occurs when the objective progress reaches or exceeds the target.
 *
 * @param state - The current GameState
 * @returns true if victory condition is met, false otherwise
 */
export function checkVictoryConditions(state: GameState): boolean {
  return state.objective.progresso >= state.objective.alvo;
}

/**
 * Checks if any defeat condition has been met.
 *
 * Defeat can occur due to:
 * - Moral reaching 0: "Moral quebrada - o abrigo entrou em colapso"
 * - Supplies depleted: "Fome extrema - ninguém consegue continuar"
 * - Night pressure overwhelming: "A noite consumiu tudo - o Silencio Branco tomou o abrigo"
 *
 * @param state - The current GameState
 * @returns An object with defeated status and reason if defeated
 */
export function checkDefeatConditions(
  state: GameState
): { defeated: boolean; reason: string | null } {
  // Defeat if moral is completely broken
  if (state.shelter.moral <= 0) {
    return {
      defeated: true,
      reason: "Moral quebrada - o abrigo entrou em colapso",
    };
  }

  // Defeat if provisions are completely exhausted
  if (state.shelter.mantimentos <= 0) {
    return {
      defeated: true,
      reason: "Fome extrema - ninguém consegue continuar",
    };
  }

  // Defeat if night pressure becomes overwhelming
  if (state.shelter.pressaoDaNoite >= 100) {
    return {
      defeated: true,
      reason: "A noite consumiu tudo - o Silencio Branco tomou o abrigo",
    };
  }

  return {
    defeated: false,
    reason: null,
  };
}

/**
 * Applies end game conditions to the game state.
 *
 * Checks both victory and defeat conditions in sequence.
 * If victory conditions are met, sets gameStatus to "victory".
 * If defeat conditions are met, sets gameStatus to "defeat" and records the reason.
 * If neither condition is met, returns the state unchanged.
 *
 * Victory is checked before defeat, so both cannot be true simultaneously.
 *
 * @param state - The current GameState
 * @returns A new GameState with end conditions applied (if any)
 */
export function applyEndConditions(state: GameState): GameState {
  // Skip checking if the game has already ended
  if (state.gameStatus !== "playing") {
    return state;
  }

  // Check victory first
  if (checkVictoryConditions(state)) {
    return {
      ...state,
      gameStatus: "victory",
    };
  }

  // Then check defeat
  const defeatCheck = checkDefeatConditions(state);
  if (defeatCheck.defeated) {
    return {
      ...state,
      gameStatus: "defeat",
      defeatReason: defeatCheck.reason,
    };
  }

  // No end condition met
  return state;
}
