"use client";

import { useDraggable } from "@dnd-kit/core";

import type { SurvivorSummary } from "@/lib/game-data";

type SurvivorCardProps = {
  survivor: SurvivorSummary;
  compact?: boolean;
  draggable?: boolean;
  partySlotIndex?: number;
};

export function SurvivorCard({
  survivor,
  compact = false,
  draggable = false,
  partySlotIndex,
}: SurvivorCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `drag:survivor:${survivor.id}`,
      disabled: !draggable,
      data: {
        type: "survivor",
        survivorId: survivor.id,
        fromPartySlotIndex: Number.isInteger(partySlotIndex) ? partySlotIndex : null,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      className={`rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] ${
        compact ? "p-4" : "p-5"
      } ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${isDragging ? "opacity-70" : ""}`}
      style={style}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
            {survivor.papel}
          </p>
          <h3
            className={`mt-2 font-serif text-stone-50 ${
              compact ? "text-xl" : "text-2xl"
            }`}
          >
            {survivor.nome}
          </h3>
        </div>
        <div
          className={`rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_35%_30%,_rgba(255,236,201,0.25),_transparent_35%),linear-gradient(135deg,_rgba(117,60,40,0.95),_rgba(39,25,21,0.95))] ${
            compact ? "h-11 w-11" : "h-14 w-14"
          }`}
        />
      </div>

      {compact ? null : (
        <p className="mt-4 text-sm leading-7 text-stone-300/80">
          {survivor.estado}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-stone-400">Habilidade</span>
        <span className="text-stone-100">{survivor.habilidade}</span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-400">Tensao</span>
          <span className="text-stone-100">{survivor.tensao}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-[linear-gradient(90deg,_#d97706,_#fb7185)]"
            style={{ width: `${survivor.tensao}%` }}
          />
        </div>
      </div>
    </article>
  );
}
