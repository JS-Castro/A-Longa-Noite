"use client";

import { create } from "zustand";

import { createInitialGameState, resolveTurn } from "@/lib/game-engine";
import { type GameState, type ItemCardData } from "@/lib/game-data";

type GameStore = GameState & {
  shelterItems: ItemCardData[];
  handItems: ItemCardData[];
  setSelectedAction: (actionId: string) => void;
  setSelectedChoice: (choiceId: string) => void;
  moveItemToShelter: (itemId: string) => void;
  resolveSelectedAction: () => void;
  resetGame: () => void;
};

const initialState = createInitialGameState();

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  handItems: initialState.itemDeck,
  shelterItems: [],
  setSelectedAction: (actionId) => set({ selectedActionId: actionId }),
  setSelectedChoice: (choiceId) => set({ selectedChoiceId: choiceId }),
  moveItemToShelter: (itemId) =>
    set((state) => {
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
    set((state) =>
      resolveTurn(state, state.selectedActionId, state.selectedChoiceId),
    ),
  resetGame: () => {
    const nextState = createInitialGameState();

    return set({
      ...nextState,
      handItems: nextState.itemDeck,
      shelterItems: [],
    });
  },
}));
