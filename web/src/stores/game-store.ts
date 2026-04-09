"use client";

import { create } from "zustand";

import { createInitialGameState, getNextPhase, resolveTurn } from "@/lib/game-engine";
import { type GameState, type ItemCardData } from "@/lib/game-data";

type GameStore = GameState & {
  shelterItems: ItemCardData[];
  handItems: ItemCardData[];
  rulesOpen: boolean;
  setSelectedAction: (actionId: string) => void;
  setSelectedChoice: (choiceId: string) => void;
  advancePhase: () => void;
  toggleRulesPanel: () => void;
  setRulesPanel: (open: boolean) => void;
  moveItemToShelter: (itemId: string) => void;
  resolveSelectedAction: () => void;
  resetGame: () => void;
};

const initialState = createInitialGameState();

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  handItems: initialState.itemDeck,
  shelterItems: [],
  rulesOpen: false,
  setSelectedAction: (actionId) =>
    set((state) =>
      state.currentPhase === "acao"
        ? { selectedActionId: actionId }
        : state,
    ),
  setSelectedChoice: (choiceId) =>
    set((state) =>
      state.currentPhase === "crise"
        ? { selectedChoiceId: choiceId }
        : state,
    ),
  advancePhase: () =>
    set((state) => ({
      currentPhase: getNextPhase(state.currentPhase),
    })),
  toggleRulesPanel: () => set((state) => ({ rulesOpen: !state.rulesOpen })),
  setRulesPanel: (open) => set({ rulesOpen: open }),
  moveItemToShelter: (itemId) =>
    set((state) => {
      if (state.currentPhase !== "planeamento") {
        return state;
      }

      const item = state.handItems.find((entry) => entry.id === itemId);

      if (!item) {
        return state;
      }

      return {
        handItems: state.handItems.filter((entry) => entry.id !== itemId),
        shelterItems: [...state.shelterItems, item],
      };
    }),
  resolveSelectedAction: () =>
    set((state) => {
      if (state.currentPhase !== "resolucao") {
        return state;
      }

      return resolveTurn(state, state.selectedActionId, state.selectedChoiceId);
    }),
  resetGame: () => {
    const nextState = createInitialGameState();

    return set({
      ...nextState,
      handItems: nextState.itemDeck,
      shelterItems: [],
      rulesOpen: false,
    });
  },
}));
