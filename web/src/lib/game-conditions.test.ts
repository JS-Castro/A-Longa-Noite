import { describe, it, expect, beforeEach } from "vitest";
import {
  checkVictoryConditions,
  checkDefeatConditions,
  applyEndConditions,
} from "./game-conditions";
import { initialGameState } from "./game-data";

describe("Game Conditions", () => {
  let testState = initialGameState;

  beforeEach(() => {
    testState = JSON.parse(JSON.stringify(initialGameState));
  });

  describe("checkVictoryConditions", () => {
    it("should return true when objective progress equals target", () => {
      const state = {
        ...testState,
        objective: { ...testState.objective, progresso: 10, alvo: 10 },
      };
      expect(checkVictoryConditions(state)).toBe(true);
    });

    it("should return true when objective progress exceeds target", () => {
      const state = {
        ...testState,
        objective: { ...testState.objective, progresso: 15, alvo: 10 },
      };
      expect(checkVictoryConditions(state)).toBe(true);
    });

    it("should return false when objective progress is below target", () => {
      const state = {
        ...testState,
        objective: { ...testState.objective, progresso: 5, alvo: 10 },
      };
      expect(checkVictoryConditions(state)).toBe(false);
    });
  });

  describe("checkDefeatConditions", () => {
    it("should return defeat when moral is zero", () => {
      const state = {
        ...testState,
        shelter: { ...testState.shelter, moral: 0 },
      };
      const result = checkDefeatConditions(state);
      expect(result.defeated).toBe(true);
      expect(result.reason).toBe("Moral quebrada - o abrigo entrou em colapso");
    });

    it("should return defeat when moral is negative", () => {
      const state = {
        ...testState,
        shelter: { ...testState.shelter, moral: -5 },
      };
      const result = checkDefeatConditions(state);
      expect(result.defeated).toBe(true);
      expect(result.reason).toBe("Moral quebrada - o abrigo entrou em colapso");
    });

    it("should return defeat when mantimentos is zero", () => {
      const state = {
        ...testState,
        shelter: { ...testState.shelter, mantimentos: 0, moral: 50 },
      };
      const result = checkDefeatConditions(state);
      expect(result.defeated).toBe(true);
      expect(result.reason).toBe("Fome extrema - ninguém consegue continuar");
    });

    it("should return defeat when pressaoDaNoite equals 100", () => {
      const state = {
        ...testState,
        shelter: {
          ...testState.shelter,
          pressaoDaNoite: 100,
          moral: 50,
          mantimentos: 5,
        },
      };
      const result = checkDefeatConditions(state);
      expect(result.defeated).toBe(true);
      expect(result.reason).toBe(
        "A noite consumiu tudo - o Silencio Branco tomou o abrigo"
      );
    });

    it("should return defeat when pressaoDaNoite exceeds 100", () => {
      const state = {
        ...testState,
        shelter: {
          ...testState.shelter,
          pressaoDaNoite: 105,
          moral: 50,
          mantimentos: 5,
        },
      };
      const result = checkDefeatConditions(state);
      expect(result.defeated).toBe(true);
      expect(result.reason).toBe(
        "A noite consumiu tudo - o Silencio Branco tomou o abrigo"
      );
    });

    it("should return no defeat when all values are healthy", () => {
      const result = checkDefeatConditions(testState);
      expect(result.defeated).toBe(false);
      expect(result.reason).toBeNull();
    });

    it("should prioritize moral over other conditions", () => {
      const state = {
        ...testState,
        shelter: {
          ...testState.shelter,
          moral: 0,
          mantimentos: 0,
          pressaoDaNoite: 100,
        },
      };
      const result = checkDefeatConditions(state);
      expect(result.reason).toBe("Moral quebrada - o abrigo entrou em colapso");
    });

    it("should prioritize mantimentos over pressaoDaNoite", () => {
      const state = {
        ...testState,
        shelter: {
          ...testState.shelter,
          moral: 50,
          mantimentos: 0,
          pressaoDaNoite: 100,
        },
      };
      const result = checkDefeatConditions(state);
      expect(result.reason).toBe("Fome extrema - ninguém consegue continuar");
    });
  });

  describe("applyEndConditions", () => {
    it("should set gameStatus to victory when victory condition met", () => {
      const state = {
        ...testState,
        gameStatus: "playing" as const,
        objective: { ...testState.objective, progresso: 10, alvo: 10 },
      };
      const result = applyEndConditions(state);
      expect(result.gameStatus).toBe("victory");
    });

    it("should set gameStatus to defeat when defeat condition met", () => {
      const state = {
        ...testState,
        gameStatus: "playing" as const,
        shelter: { ...testState.shelter, moral: 0 },
      };
      const result = applyEndConditions(state);
      expect(result.gameStatus).toBe("defeat");
      expect(result.defeatReason).toBe(
        "Moral quebrada - o abrigo entrou em colapso"
      );
    });

    it("should not modify state when game has already ended (victory)", () => {
      const state = {
        ...testState,
        gameStatus: "victory" as const,
      };
      const result = applyEndConditions(state);
      expect(result).toEqual(state);
    });

    it("should not modify state when game has already ended (defeat)", () => {
      const state = {
        ...testState,
        gameStatus: "defeat" as const,
        defeatReason: "Test reason",
      };
      const result = applyEndConditions(state);
      expect(result).toEqual(state);
    });

    it("should not modify state when no end condition is met", () => {
      const result = applyEndConditions(testState);
      expect(result).toEqual(testState);
      expect(result.gameStatus).toBe("playing");
    });

    it("should check victory before defeat", () => {
      const state = {
        ...testState,
        gameStatus: "playing" as const,
        objective: { ...testState.objective, progresso: 10, alvo: 10 },
        shelter: { ...testState.shelter, moral: 0 },
      };
      const result = applyEndConditions(state);
      // Victory takes precedence
      expect(result.gameStatus).toBe("victory");
      expect(result.defeatReason).toBeNull();
    });

    it("should be immutable - not modify input state", () => {
      const originalState = JSON.parse(JSON.stringify(testState));
      applyEndConditions(testState);
      expect(testState).toEqual(originalState);
    });
  });
});
