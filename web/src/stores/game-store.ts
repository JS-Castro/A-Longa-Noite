"use client";

import { create } from "zustand";

import { createInitialGameState, resolveTurn } from "@/lib/game-engine";
import { type GameState } from "@/lib/game-data";

type GameStore = GameState & {
  setSelectedAction: (actionId: string) => void;
  setSelectedChoice: (choiceId: string) => void;
  resolveSelectedAction: () => void;
  resetGame: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  ...createInitialGameState(),
  setSelectedAction: (actionId) => set({ selectedActionId: actionId }),
  setSelectedChoice: (choiceId) => set({ selectedChoiceId: choiceId }),
  resolveSelectedAction: () =>
    set((state) =>
      resolveTurn(state, state.selectedActionId, state.selectedChoiceId),
    ),
  resetGame: () => set(createInitialGameState()),
}));
