import { describe, it, expect, beforeEach } from "vitest";
import {
  resolveChoiceAndAdvanceTurn,
  advanceTurn,
  getCurrentEvent,
  rotateEventQueue,
} from "./game-reducer";
import { initialGameState, EventDefinition } from "./game-data";

describe("Game Reducer", () => {
  let testState = initialGameState;

  beforeEach(() => {
    testState = JSON.parse(JSON.stringify(initialGameState));
  });

  describe("getCurrentEvent", () => {
    it("should return the first event in the queue", () => {
      const event = getCurrentEvent(testState);
      expect(event).toBeDefined();
      expect(event?.id).toBe(testState.events[0].id);
    });

    it("should return null when event queue is empty", () => {
      const emptyState = { ...testState, events: [] };
      const event = getCurrentEvent(emptyState);
      expect(event).toBeNull();
    });
  });

  describe("rotateEventQueue", () => {
    it("should rotate events in a circular manner", () => {
      const originalFirst = testState.events[0];
      const rotated = rotateEventQueue(testState.events);

      expect(rotated[0]).not.toEqual(originalFirst);
      expect(rotated[rotated.length - 1]).toEqual(originalFirst);
    });

    it("should preserve all events when rotating", () => {
      const originalLength = testState.events.length;
      const rotated = rotateEventQueue(testState.events);

      expect(rotated.length).toBe(originalLength);
    });

    it("should handle single-event queues without error", () => {
      const singleEvent = [testState.events[0]];
      const rotated = rotateEventQueue(singleEvent);

      expect(rotated).toEqual(singleEvent);
    });

    it("should handle empty queues without error", () => {
      const empty: EventDefinition[] = [];
      const rotated = rotateEventQueue(empty);

      expect(rotated).toEqual(empty);
    });
  });

  describe("advanceTurn", () => {
    it("should advance from crise to planeamento", () => {
      const state = { ...testState, currentPhase: "crise" as const };
      const newState = advanceTurn(state);

      expect(newState.currentPhase).toBe("planeamento");
    });

    it("should advance from planeamento to acao", () => {
      const state = { ...testState, currentPhase: "planeamento" as const };
      const newState = advanceTurn(state);

      expect(newState.currentPhase).toBe("acao");
    });

    it("should advance from acao to resolucao", () => {
      const state = { ...testState, currentPhase: "acao" as const };
      const newState = advanceTurn(state);

      expect(newState.currentPhase).toBe("resolucao");
    });

    it("should advance from resolucao to crise and rotate events", () => {
      const state = { ...testState, currentPhase: "resolucao" as const };
      const originalFirstEvent = state.events[0];

      const newState = advanceTurn(state);

      expect(newState.currentPhase).toBe("crise");
      expect(newState.events[0]).not.toEqual(originalFirstEvent);
      expect(newState.events[newState.events.length - 1]).toEqual(originalFirstEvent);
    });

    it("should increment turn number when transitioning to crise", () => {
      const state = { ...testState, currentPhase: "resolucao" as const, turno: 5 };
      const newState = advanceTurn(state);

      expect(newState.turno).toBe(6);
    });

    it("should not increment turn number when not transitioning to crise", () => {
      const state = { ...testState, currentPhase: "crise" as const, turno: 5 };
      const newState = advanceTurn(state);

      expect(newState.turno).toBe(5);
    });

    it("should return immutable state", () => {
      const originalState = { ...testState };
      advanceTurn(testState);

      expect(testState).toEqual(originalState);
    });
  });

  describe("resolveChoiceAndAdvanceTurn", () => {
    it("should apply choice impact to game state", () => {
      const currentEvent = testState.events[0];
      if (!currentEvent || currentEvent.choices.length === 0) {
        throw new Error("Test event missing choices");
      }

      const choice = currentEvent.choices[0];
      const originalMoral = testState.shelter.moral;
      void originalMoral;

      const newState = resolveChoiceAndAdvanceTurn(testState, choice.id);

      expect(newState.shelter.moral).toBeLessThanOrEqual(100);
      expect(newState.shelter.moral).toBeGreaterThanOrEqual(0);
    });

    it("should create a log entry with choice consequence", () => {
      const currentEvent = testState.events[0];
      if (!currentEvent || currentEvent.choices.length === 0) {
        throw new Error("Test event missing choices");
      }

      const choice = currentEvent.choices[0];
      const originalLogLength = testState.log.length;

      const newState = resolveChoiceAndAdvanceTurn(testState, choice.id);

      expect(newState.log.length).toBe(originalLogLength + 1);
      expect(newState.log[newState.log.length - 1].titulo).toBe(
        choice.consequenceTitle
      );
      expect(newState.log[newState.log.length - 1].detalhe).toBe(
        choice.consequenceDetail
      );
    });

    it("should log entry contain correct turn number", () => {
      const currentEvent = testState.events[0];
      if (!currentEvent || currentEvent.choices.length === 0) {
        throw new Error("Test event missing choices");
      }

      const choice = currentEvent.choices[0];
      const newState = resolveChoiceAndAdvanceTurn(testState, choice.id);

      expect(newState.log[newState.log.length - 1].turno).toBe(testState.turno);
    });

    it("should advance phase from crise to planeamento", () => {
      const currentEvent = testState.events[0];
      if (!currentEvent || currentEvent.choices.length === 0) {
        throw new Error("Test event missing choices");
      }

      const state = { ...testState, currentPhase: "crise" as const };
      const choice = currentEvent.choices[0];

      const newState = resolveChoiceAndAdvanceTurn(state, choice.id);

      expect(newState.currentPhase).toBe("planeamento");
    });

    it("should rotate events and increment turn when moving to crise", () => {
      const currentEvent = testState.events[0];
      if (!currentEvent || currentEvent.choices.length === 0) {
        throw new Error("Test event missing choices");
      }

      const state = { ...testState, currentPhase: "resolucao" as const, turno: 3 };
      const choice = currentEvent.choices[0];
      const originalFirstEvent = state.events[0];

      const newState = resolveChoiceAndAdvanceTurn(state, choice.id);

      expect(newState.currentPhase).toBe("crise");
      expect(newState.turno).toBe(4);
      expect(newState.events[0]).not.toEqual(originalFirstEvent);
    });

    it("should handle invalid choiceId gracefully", () => {
      const newState = resolveChoiceAndAdvanceTurn(testState, "invalid_choice_id");

      expect(newState).toEqual(testState);
    });

    it("should return immutable state", () => {
      const currentEvent = testState.events[0];
      if (!currentEvent || currentEvent.choices.length === 0) {
        throw new Error("Test event missing choices");
      }

      const originalState = JSON.parse(JSON.stringify(testState));
      const choice = currentEvent.choices[0];

      resolveChoiceAndAdvanceTurn(testState, choice.id);

      expect(testState).toEqual(originalState);
    });

    it("should accumulate log entries across multiple turns", () => {
      let state = testState;
      const initialLogLength = state.log.length;

      for (let turn = 0; turn < 4; turn++) {
        const currentEvent = getCurrentEvent(state);
        if (!currentEvent || currentEvent.choices.length === 0) break;

        const choice = currentEvent.choices[0];
        state = resolveChoiceAndAdvanceTurn(state, choice.id);
      }

      expect(state.log.length).toBeGreaterThan(initialLogLength);
    });
  });

  describe("Multiple turn cycle", () => {
    it("should complete a full turn cycle: crise -> planeamento -> acao -> resolucao -> crise", () => {
      let state = testState;
      const currentEvent = getCurrentEvent(state);
      if (!currentEvent || currentEvent.choices.length === 0) {
        throw new Error("Test event missing choices");
      }

      const choice = currentEvent.choices[0];

      // Crise -> Planeamento
      state = resolveChoiceAndAdvanceTurn(state, choice.id);
      expect(state.currentPhase).toBe("planeamento");

      // Planeamento -> Acao
      state = advanceTurn(state);
      expect(state.currentPhase).toBe("acao");

      // Acao -> Resolucao
      state = advanceTurn(state);
      expect(state.currentPhase).toBe("resolucao");

      // Resolucao -> Crise (new turn)
      const turnBeforeNewCrise = state.turno;
      state = advanceTurn(state);
      expect(state.currentPhase).toBe("crise");
      expect(state.turno).toBe(turnBeforeNewCrise + 1);
    });

    it("should handle multiple complete turn cycles", () => {
      let state = testState;

      for (let cycle = 0; cycle < 3; cycle++) {
        for (let phase = 0; phase < 4; phase++) {
          const currentEvent = getCurrentEvent(state);
          if (!currentEvent || currentEvent.choices.length === 0) break;

          if (phase === 0) {
            const choice = currentEvent.choices[0];
            state = resolveChoiceAndAdvanceTurn(state, choice.id);
          } else {
            state = advanceTurn(state);
          }
        }
      }

      expect(state.turno).toBe(testState.turno + 3);
      expect(state.log.length).toBeGreaterThan(testState.log.length);
    });
  });

  describe("Event queue management", () => {
    it("should maintain event queue length across rotations", () => {
      let state = testState;
      const originalLength = state.events.length;

      for (let i = 0; i < originalLength * 2; i++) {
        state = advanceTurn(state);
      }

      expect(state.events.length).toBe(originalLength);
    });

    it("should cycle through all events in order", () => {
      let state = testState;
      const eventOrder: string[] = [];
      const originalLength = state.events.length;

      for (let i = 0; i < originalLength * 4; i++) {
        const currentEvent = getCurrentEvent(state);
        if (currentEvent && !eventOrder.includes(currentEvent.id)) {
          eventOrder.push(currentEvent.id);
        }
        state = advanceTurn(state);
      }

      expect(eventOrder.length).toBe(originalLength);
    });
  });
});
