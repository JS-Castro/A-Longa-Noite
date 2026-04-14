import { describe, it, expect, beforeEach } from "vitest";
import {
  applyChoiceImpact,
  validateGameState,
  initialGameState,
} from "@/lib/game-data";
import { GameState, EventChoiceImpact } from "@/lib/game-data";

describe("applyChoiceImpact", () => {
  let testState: GameState;

  beforeEach(() => {
    testState = JSON.parse(JSON.stringify(initialGameState));
  });

  it("should apply positive moral impact", () => {
    const impact: EventChoiceImpact = { moral: 10 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.moral).toBe(testState.shelter.moral + 10);
  });

  it("should apply negative moral impact", () => {
    const impact: EventChoiceImpact = { moral: -5 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.moral).toBe(testState.shelter.moral - 5);
  });

  it("should clamp moral to max 100", () => {
    testState.shelter.moral = 95;
    const impact: EventChoiceImpact = { moral: 10 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.moral).toBe(100);
  });

  it("should clamp moral to min 0", () => {
    testState.shelter.moral = 5;
    const impact: EventChoiceImpact = { moral: -10 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.moral).toBe(0);
  });

  it("should apply mantimentos impact and clamp to max 20", () => {
    testState.shelter.mantimentos = 18;
    const impact: EventChoiceImpact = { mantimentos: 5 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.mantimentos).toBe(20);
  });

  it("should clamp mantimentos to min 0", () => {
    testState.shelter.mantimentos = 2;
    const impact: EventChoiceImpact = { mantimentos: -5 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.mantimentos).toBe(0);
  });

  it("should apply combustivel impact and clamp to max 15", () => {
    testState.shelter.combustivel = 12;
    const impact: EventChoiceImpact = { combustivel: 5 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.combustivel).toBe(15);
  });

  it("should clamp combustivel to min 0", () => {
    testState.shelter.combustivel = 1;
    const impact: EventChoiceImpact = { combustivel: -3 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.combustivel).toBe(0);
  });

  it("should apply pressaoDaNoite impact and clamp to max 100", () => {
    testState.shelter.pressaoDaNoite = 90;
    const impact: EventChoiceImpact = { pressaoDaNoite: 15 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.pressaoDaNoite).toBe(100);
  });

  it("should clamp pressaoDaNoite to min 0", () => {
    testState.shelter.pressaoDaNoite = 10;
    const impact: EventChoiceImpact = { pressaoDaNoite: -15 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.pressaoDaNoite).toBe(0);
  });

  it("should apply survivorTension to all survivors", () => {
    const impact: EventChoiceImpact = { survivorTension: 5 };
    const newState = applyChoiceImpact(testState, impact);
    newState.survivors.forEach((survivor) => {
      const originalTensao =
        testState.survivors.find((s) => s.id === survivor.id)?.tensao ?? 0;
      expect(survivor.tensao).toBe(originalTensao + 5);
    });
  });

  it("should clamp survivor tension to max 100", () => {
    testState.survivors.forEach((survivor) => {
      survivor.tensao = 98;
    });
    const impact: EventChoiceImpact = { survivorTension: 5 };
    const newState = applyChoiceImpact(testState, impact);
    newState.survivors.forEach((survivor) => {
      expect(survivor.tensao).toBe(100);
    });
  });

  it("should clamp survivor tension to min 0", () => {
    testState.survivors.forEach((survivor) => {
      survivor.tensao = 2;
    });
    const impact: EventChoiceImpact = { survivorTension: -5 };
    const newState = applyChoiceImpact(testState, impact);
    newState.survivors.forEach((survivor) => {
      expect(survivor.tensao).toBe(0);
    });
  });

  it("should apply objectiveProgress impact", () => {
    const impact: EventChoiceImpact = { objectiveProgress: 2 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.objective.progresso).toBe(
      testState.objective.progresso + 2
    );
  });

  it("should clamp objectiveProgress to max alvo", () => {
    testState.objective.progresso = 5;
    const impact: EventChoiceImpact = { objectiveProgress: 3 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.objective.progresso).toBe(testState.objective.alvo);
  });

  it("should clamp objectiveProgress to min 0", () => {
    testState.objective.progresso = 1;
    const impact: EventChoiceImpact = { objectiveProgress: -5 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.objective.progresso).toBe(0);
  });

  it("should update ameacaExterior when provided", () => {
    const newThreat = "Tempestade aberta no vale";
    const impact: EventChoiceImpact = { ameacaExterior: newThreat };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.ameacaExterior).toBe(newThreat);
  });

  it("should keep ameacaExterior unchanged when not provided in impact", () => {
    const impact: EventChoiceImpact = { moral: 5 };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.ameacaExterior).toBe(
      testState.shelter.ameacaExterior
    );
  });

  it("should return immutable state (original unchanged)", () => {
    const originalMoral = testState.shelter.moral;
    const impact: EventChoiceImpact = { moral: 10 };
    applyChoiceImpact(testState, impact);
    expect(testState.shelter.moral).toBe(originalMoral);
  });

  it("should apply multiple impacts at once", () => {
    const impact: EventChoiceImpact = {
      moral: 5,
      mantimentos: -2,
      combustivel: 1,
      pressaoDaNoite: 8,
      survivorTension: 3,
      objectiveProgress: 1,
      ameacaExterior: "Nova ameaca",
    };
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.moral).toBe(testState.shelter.moral + 5);
    expect(newState.shelter.mantimentos).toBe(testState.shelter.mantimentos - 2);
    expect(newState.shelter.combustivel).toBe(testState.shelter.combustivel + 1);
    expect(newState.shelter.pressaoDaNoite).toBe(
      testState.shelter.pressaoDaNoite + 8
    );
    expect(newState.objective.progresso).toBe(
      testState.objective.progresso + 1
    );
    expect(newState.shelter.ameacaExterior).toBe("Nova ameaca");
  });

  it("should handle empty impact object", () => {
    const impact: EventChoiceImpact = {};
    const newState = applyChoiceImpact(testState, impact);
    expect(newState.shelter.moral).toBe(testState.shelter.moral);
    expect(newState.shelter.mantimentos).toBe(testState.shelter.mantimentos);
  });
});

describe("validateGameState", () => {
  let testState: GameState;

  beforeEach(() => {
    testState = JSON.parse(JSON.stringify(initialGameState));
  });

  it("should validate a healthy game state", () => {
    const result = validateGameState(testState);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should catch invalid moral (too high)", () => {
    testState.shelter.moral = 101;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/moral.*0.*100.*101/),
      ])
    );
  });

  it("should catch invalid moral (negative)", () => {
    testState.shelter.moral = -1;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/moral.*0.*100.*-1/),
      ])
    );
  });

  it("should catch invalid mantimentos", () => {
    testState.shelter.mantimentos = 25;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/mantimentos.*0.*20.*25/),
      ])
    );
  });

  it("should catch invalid combustivel", () => {
    testState.shelter.combustivel = -1;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/combustivel.*0.*15.*-1/),
      ])
    );
  });

  it("should catch invalid pressaoDaNoite", () => {
    testState.shelter.pressaoDaNoite = 150;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/pressaoDaNoite.*0.*100.*150/),
      ])
    );
  });

  it("should catch invalid survivor tension", () => {
    testState.survivors[0].tensao = 101;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/tensao.*0.*100.*101/),
      ])
    );
  });

  it("should catch invalid objective progress (too high)", () => {
    testState.objective.progresso = testState.objective.alvo + 1;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/progresso.*0.*alvo/),
      ])
    );
  });

  it("should catch invalid objective progress (negative)", () => {
    testState.objective.progresso = -1;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/progresso.*0.*alvo/),
      ])
    );
  });

  it("should catch multiple errors at once", () => {
    testState.shelter.moral = -5;
    testState.shelter.mantimentos = 25;
    testState.survivors[0].tensao = 150;
    const result = validateGameState(testState);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("should allow valid boundary values", () => {
    testState.shelter.moral = 0;
    testState.shelter.mantimentos = 20;
    testState.shelter.combustivel = 15;
    testState.shelter.pressaoDaNoite = 100;
    testState.survivors.forEach((s) => {
      s.tensao = 100;
    });
    testState.objective.progresso = testState.objective.alvo;
    const result = validateGameState(testState);
    expect(result.valid).toBe(true);
  });
});
