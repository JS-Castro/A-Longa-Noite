import { createInitialGameState, resolveTurn } from "@/lib/game-engine";

describe("game engine", () => {
  it("resolves pharmacy exploration by raising supplies and advancing the turn", () => {
    const state = createInitialGameState();

    const next = resolveTurn(state, "explore_pharmacy");

    expect(next.turno).toBe(2);
    expect(next.shelter.mantimentos).toBe(state.shelter.mantimentos + 1);
    expect(next.shelter.pressaoDaNoite).toBe(state.shelter.pressaoDaNoite + 4);
    expect(next.log[0]?.titulo).toBe("Saque sob neve");
  });

  it("resolves ration transparency by trading supplies for morale", () => {
    const state = createInitialGameState();

    const next = resolveTurn(state, "ration_transparency");

    expect(next.shelter.mantimentos).toBe(state.shelter.mantimentos - 1);
    expect(next.shelter.moral).toBe(state.shelter.moral + 5);
    expect(next.survivors[0]?.tensao).toBeLessThan(state.survivors[0]?.tensao ?? 0);
  });
});
