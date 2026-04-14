"use client";

import { create } from "zustand";

import { createInitialGameState, getNextPhase, resolveTurn } from "@/lib/game-engine";
import { type GameState, type ItemCardData } from "@/lib/game-data";
import { resolveChoiceAndAdvanceTurn } from "@/lib/game-reducer";

type GameStore = GameState & {
  shelterItems: ItemCardData[];
  handItems: ItemCardData[];
  partySlots: Array<string | null>;
  rulesOpen: boolean;
  showingResult: boolean;
  setSelectedAction: (actionId: string) => void;
  setSelectedChoice: (choiceId: string) => void;
  advancePhase: () => void;
  toggleRulesPanel: () => void;
  setRulesPanel: (open: boolean) => void;
  setShowingResult: (showing: boolean) => void;
  moveItemToShelter: (itemId: string) => void;
  assignSurvivorToPartySlot: (
    survivorId: string,
    slotIndex: number,
    fromSlotIndex?: number | null,
  ) => void;
  removeSurvivorFromParty: (survivorId: string) => void;
  clearPartySlot: (slotIndex: number) => void;
  resolveSelectedAction: () => void;
  resolveChoiceAndShowResult: () => void;
  applyChoiceResultAndAdvance: () => void;
  resetGame: () => void;
};

const initialState = createInitialGameState();

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  handItems: initialState.itemDeck,
  shelterItems: [],
  partySlots: [null, null, null],
  rulesOpen: false,
  showingResult: false,
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
  setShowingResult: (showing) => set({ showingResult: showing }),
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
  assignSurvivorToPartySlot: (survivorId, slotIndex, fromSlotIndex = null) =>
    set((state) => {
      if (state.currentPhase !== "planeamento" && state.currentPhase !== "acao") {
        return state;
      }

      const nextSlots = [...state.partySlots];
      const normalizedSlotIndex = Math.max(
        0,
        Math.min(slotIndex, nextSlots.length - 1),
      );

      const existingIndex = nextSlots.findIndex((id) => id === survivorId);
      if (existingIndex !== -1) {
        nextSlots[existingIndex] = null;
      }

      const targetOccupant = nextSlots[normalizedSlotIndex];
      nextSlots[normalizedSlotIndex] = survivorId;

      if (
        fromSlotIndex !== null &&
        Number.isInteger(fromSlotIndex) &&
        fromSlotIndex >= 0 &&
        fromSlotIndex < nextSlots.length
      ) {
        if (targetOccupant && fromSlotIndex !== normalizedSlotIndex) {
          nextSlots[fromSlotIndex] = targetOccupant;
        }
      }

      return { partySlots: nextSlots };
    }),
  removeSurvivorFromParty: (survivorId) =>
    set((state) => {
      if (state.currentPhase !== "planeamento" && state.currentPhase !== "acao") {
        return state;
      }

      return {
        partySlots: state.partySlots.map((id) => (id === survivorId ? null : id)),
      };
    }),
  clearPartySlot: (slotIndex) =>
    set((state) => {
      if (state.currentPhase !== "planeamento" && state.currentPhase !== "acao") {
        return state;
      }

      const nextSlots = [...state.partySlots];
      const normalizedSlotIndex = Math.max(
        0,
        Math.min(slotIndex, nextSlots.length - 1),
      );
      nextSlots[normalizedSlotIndex] = null;
      return { partySlots: nextSlots };
    }),
  resolveSelectedAction: () =>
    set((state) => {
      if (state.currentPhase !== "resolucao") {
        return state;
      }

      const next = resolveTurn(state, state.selectedActionId, state.selectedChoiceId);
      const newHand = next.pendingLoot.length > 0
        ? [...state.handItems, ...next.pendingLoot]
        : state.handItems;

      return { ...next, handItems: newHand, pendingLoot: [] };
    }),
  resolveChoiceAndShowResult: () =>
    set((state) => {
      if (state.currentPhase !== "crise" || !state.selectedChoiceId) {
        return state;
      }

      // Show the result panel
      return { ...state, showingResult: true };
    }),
  applyChoiceResultAndAdvance: () =>
    set((state) => {
      if (state.currentPhase !== "crise" || !state.selectedChoiceId) {
        return state;
      }

      // Use the reducer to resolve choice and advance turn
      const newGameState = resolveChoiceAndAdvanceTurn(state, state.selectedChoiceId);
      const newHand = newGameState.pendingLoot.length > 0
        ? [...state.handItems, ...newGameState.pendingLoot]
        : state.handItems;

      return {
        ...newGameState,
        handItems: newHand,
        pendingLoot: [],
        showingResult: false,
        selectedChoiceId: "",
      };
    }),
  resetGame: () => {
    const nextState = createInitialGameState();

    return set({
      ...nextState,
      handItems: nextState.itemDeck,
      shelterItems: [],
      partySlots: [null, null, null],
      rulesOpen: false,
      showingResult: false,
    });
  },
}));
