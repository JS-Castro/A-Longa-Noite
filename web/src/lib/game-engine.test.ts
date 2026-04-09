import { createInitialGameState, resolveTurn } from "@/lib/game-engine";

describe("game engine", () => {
  it("resolves pharmacy exploration by raising supplies and advancing the turn", () => {
    const state = createInitialGameState();

    const next = resolveTurn(state, "explore_pharmacy", "repair_now");

    expect(next.turno).toBe(2);
    expect(next.shelter.mantimentos).toBe(state.shelter.mantimentos + 1);
    expect(next.shelter.combustivel).toBe(state.shelter.combustivel - 1);
    expect(next.shelter.pressaoDaNoite).toBe(state.shelter.pressaoDaNoite - 2);
    expect(next.objective.progresso).toBe(3);
    expect(next.locations.find((location) => location.id === "loc_farmacia_encosta")?.estado).toBe("seguro");
    expect(next.log[0]?.titulo).toBe("Gerador estabilizado");
  });

  it("resolves ration transparency by trading supplies for morale", () => {
    const state = createInitialGameState();

    const next = resolveTurn(state, "ration_transparency", "patch_temp");

    expect(next.shelter.mantimentos).toBe(state.shelter.mantimentos - 1);
    expect(next.shelter.moral).toBe(state.shelter.moral + 4);
    expect(next.shelter.pressaoDaNoite).toBe(state.shelter.pressaoDaNoite + 3);
    expect(next.objective.progresso).toBe(2);
    expect(next.survivors[0]?.tensao).toBeGreaterThan(state.survivors[0]?.tensao ?? 0);
  });
});
