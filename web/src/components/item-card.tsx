"use client";

import type { ItemCardData } from "@/lib/game-data";

type ItemCardProps = {
  item: ItemCardData;
  compact?: boolean;
};

export function ItemCard({ item, compact = false }: ItemCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-[1.6rem] border border-stone-300/35 bg-[linear-gradient(180deg,_rgba(255,248,235,0.96),_rgba(230,220,203,0.96))] text-stone-900 shadow-xl shadow-black/25 ${
        compact ? "w-[15rem]" : "w-full max-w-[17rem]"
      }`}
      style={{
        boxShadow: `0 10px 30px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.18)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_40%),linear-gradient(135deg,_rgba(120,53,15,0.05),_transparent_35%)]" />
      <div
        className="absolute left-0 top-0 h-full w-3"
        style={{ backgroundColor: item.accent }}
      />

      <div className="relative p-4 pl-6">
        <div className="rounded-[1.1rem] border border-stone-700/15 bg-[linear-gradient(145deg,_rgba(58,70,42,0.95),_rgba(33,41,26,0.95))] p-3 shadow-inner">
          <div className="flex aspect-[4/3] items-center justify-center rounded-[0.9rem] border border-white/12 bg-[radial-gradient(circle_at_35%_30%,_rgba(255,255,255,0.22),_transparent_28%),linear-gradient(145deg,_rgba(70,86,50,0.92),_rgba(35,44,28,0.92))]">
            <div className="grid grid-cols-2 gap-2">
              {[...Array(Math.min(item.quantidade + 2, 5))].map((_, index) => (
                <div
                  key={`${item.id}_${index}`}
                  className="h-9 w-9 rounded-full border border-black/10 bg-[radial-gradient(circle_at_35%_30%,_rgba(255,255,255,0.55),_transparent_25%),linear-gradient(145deg,_rgba(148,163,184,0.95),_rgba(71,85,105,0.98))] shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-stone-500">
              {item.categoria}
            </p>
            <h3 className="mt-1 font-serif text-2xl leading-tight text-stone-900">
              {item.nome}
            </h3>
          </div>
          <div className="rounded-full border border-stone-400/30 bg-white/55 px-3 py-2 font-mono text-xl font-semibold text-stone-900">
            {item.quantidade}
          </div>
        </div>

        <div className="mt-4 rounded-[1rem] border border-stone-400/20 bg-white/45 px-3 py-3">
          <p className="text-sm leading-6 text-stone-800">{item.efeito}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-[0.72rem] uppercase tracking-[0.2em] text-stone-500">
          <span>{item.origem}</span>
          <span>Item</span>
        </div>

        <p className="mt-4 border-t border-stone-500/15 pt-3 text-sm italic leading-6 text-stone-700">
          {item.flavor}
        </p>
      </div>
    </article>
  );
}
