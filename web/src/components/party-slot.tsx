"use client";

import { useDroppable } from "@dnd-kit/core";

import type { SurvivorSummary } from "@/lib/game-data";

import { SurvivorCard } from "@/components/survivor-card";

type PartySlotProps = {
  slotIndex: number;
  enabled: boolean;
  occupant: SurvivorSummary | null;
  onClear: () => void;
};

export function PartySlot({ slotIndex, enabled, occupant, onClear }: PartySlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `party-slot:${slotIndex}`,
    disabled: !enabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-[1.5rem] border px-4 py-4 transition ${
        enabled && isOver
          ? "border-sky-300/60 bg-sky-200/10"
          : enabled
            ? "border-white/10 bg-white/5"
            : "border-white/8 bg-white/[0.03] opacity-60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
          Slot {slotIndex + 1}
        </p>
        {occupant ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-stone-200/80 transition hover:bg-white/10"
            aria-label={`Limpar slot ${slotIndex + 1}`}
          >
            Remover
          </button>
        ) : null}
      </div>

      <div className="mt-3">
        {occupant ? (
          <SurvivorCard
            survivor={occupant}
            compact
            draggable={enabled}
            partySlotIndex={slotIndex}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 px-4 py-5 text-center">
            <p className="text-sm leading-7 text-stone-300/75">
              {enabled
                ? "Arrasta um sobrevivente para aqui."
                : "Slots bloqueados nesta fase."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

