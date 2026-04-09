"use client";

import { create } from "zustand";

import { createInitialGameState, resolveTurn } from "@/lib/game-engine";
import { type GameState } from "@/lib/game-data";

type GameStore = GameState & {
  setSelectedAction: (actionId: string) => void;
  resolveSelectedAction: () => void;
  resetGame: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  ...createInitialGameState(),
  setSelectedAction: (actionId) => set({ selectedActionId: actionId }),
  resolveSelectedAction: () =>
    set((state) => resolveTurn(state, state.selectedActionId)),
  resetGame: () => set(createInitialGameState()),
}));
