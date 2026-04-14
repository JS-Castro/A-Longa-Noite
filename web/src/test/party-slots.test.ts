import { beforeEach, describe, expect, it } from "vitest";

import { useGameStore } from "@/stores/game-store";

const getThreeSurvivors = () => {
  const { survivors } = useGameStore.getState();
  return [survivors[0]?.id, survivors[1]?.id, survivors[2]?.id] as const;
};

describe("partySlots", () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    useGameStore.getState().advancePhase();
  });

  it("assigns survivor to slot", () => {
    const [a] = getThreeSurvivors();
    expect(a).toBeTruthy();

    useGameStore.getState().assignSurvivorToPartySlot(a, 0);
    expect(useGameStore.getState().partySlots).toEqual([a, null, null]);
  });

  it("moves survivor between slots (no duplicate)", () => {
    const [a] = getThreeSurvivors();
    expect(a).toBeTruthy();

    useGameStore.getState().assignSurvivorToPartySlot(a, 0);
    useGameStore.getState().assignSurvivorToPartySlot(a, 1);
    expect(useGameStore.getState().partySlots).toEqual([null, a, null]);
  });

  it("swaps when dragging from slot into occupied slot", () => {
    const [a, b] = getThreeSurvivors();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();

    useGameStore.getState().assignSurvivorToPartySlot(a, 0);
    useGameStore.getState().assignSurvivorToPartySlot(b, 1);
    useGameStore.getState().assignSurvivorToPartySlot(a, 1, 0);

    expect(useGameStore.getState().partySlots).toEqual([b, a, null]);
  });

  it("replaces occupant when dragging from roster into occupied slot", () => {
    const [a, b, c] = getThreeSurvivors();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(c).toBeTruthy();

    useGameStore.getState().assignSurvivorToPartySlot(a, 0);
    useGameStore.getState().assignSurvivorToPartySlot(b, 1);
    useGameStore.getState().assignSurvivorToPartySlot(c, 1, null);

    const slots = useGameStore.getState().partySlots;
    expect(slots[0]).toBe(a);
    expect(slots[1]).toBe(c);
    expect(slots.includes(b)).toBe(false);
  });

  it("removes survivor from party", () => {
    const [a] = getThreeSurvivors();
    expect(a).toBeTruthy();

    useGameStore.getState().assignSurvivorToPartySlot(a, 0);
    useGameStore.getState().removeSurvivorFromParty(a);
    expect(useGameStore.getState().partySlots).toEqual([null, null, null]);
  });
});
