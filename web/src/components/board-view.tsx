"use client";

import type { LocationDefinition, SurvivorSummary } from "@/lib/game-data";

type BoardViewProps = {
  locations: LocationDefinition[];
  shelterName: string;
  survivors: SurvivorSummary[];
  highlightedLocationIds?: string[];
};

const locationPositions: Record<
  string,
  { left: string; top: string; lineX1: string; lineY1: string; lineX2: string; lineY2: string }
> = {
  loc_farmacia_encosta: {
    left: "12%",
    top: "18%",
    lineX1: "50%",
    lineY1: "50%",
    lineX2: "18%",
    lineY2: "24%",
  },
  loc_torre_observacao: {
    left: "50%",
    top: "10%",
    lineX1: "50%",
    lineY1: "50%",
    lineX2: "50%",
    lineY2: "18%",
  },
  loc_capela_velha: {
    left: "76%",
    top: "24%",
    lineX1: "50%",
    lineY1: "50%",
    lineX2: "80%",
    lineY2: "28%",
  },
  loc_porta_norte: {
    left: "74%",
    top: "68%",
    lineX1: "50%",
    lineY1: "50%",
    lineX2: "76%",
    lineY2: "67%",
  },
};

const stateTone = {
  seguro: "border-emerald-300/45 bg-emerald-400/12 text-emerald-50",
  instavel: "border-amber-300/45 bg-amber-400/12 text-amber-50",
  hostil: "border-rose-300/45 bg-rose-400/12 text-rose-50",
} as const;

const chipPositions = [
  { left: "39%", top: "58%" },
  { left: "46%", top: "66%" },
  { left: "55%", top: "66%" },
  { left: "62%", top: "58%" },
];

export function BoardView({
  locations,
  shelterName,
  survivors,
  highlightedLocationIds = [],
}: BoardViewProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(18,24,31,0.98),_rgba(10,13,18,0.98))] p-6 shadow-xl shadow-black/20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
            Tabuleiro
          </p>
          <h2 className="mt-3 font-serif text-3xl text-stone-50">
            Serra e arredores
          </h2>
        </div>
        <p className="max-w-sm text-right text-sm leading-6 text-stone-400">
          Primeira versao visual do board: abrigo central, rotas e locais
          relevantes do turno.
        </p>
      </div>

      <div className="relative mt-6 min-h-[36rem] overflow-hidden rounded-[1.8rem] border border-white/8 bg-[radial-gradient(circle_at_20%_20%,_rgba(148,163,184,0.08),_transparent_24%),radial-gradient(circle_at_80%_30%,_rgba(191,219,254,0.05),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent_38%),linear-gradient(135deg,_rgba(10,14,19,0.94),_rgba(20,28,38,0.94))]">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,0.03)_25%,transparent_26%,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%,transparent_74%,rgba(255,255,255,0.03)_75%,transparent_76%),linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.03)_25%,transparent_26%,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%,transparent_74%,rgba(255,255,255,0.03)_75%,transparent_76%)] bg-[length:120px_120px] opacity-20" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {locations.map((location) => {
            const position = locationPositions[location.id];
            if (!position) return null;

            return (
              <line
                key={location.id}
                x1={position.lineX1}
                y1={position.lineY1}
                x2={position.lineX2}
                y2={position.lineY2}
                stroke={highlightedLocationIds.includes(location.id) ? "#fbbf24" : "#94a3b8"}
                strokeDasharray={highlightedLocationIds.includes(location.id) ? "0" : "2 2"}
                strokeOpacity={highlightedLocationIds.includes(location.id) ? "0.8" : "0.35"}
                strokeWidth="0.45"
              />
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-1/2 w-[18rem] -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-[2rem] border border-sky-200/25 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_35%),linear-gradient(145deg,_rgba(26,35,48,0.98),_rgba(13,18,25,0.98))] p-5 shadow-[0_0_50px_rgba(56,189,248,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-100/60">
              Abrigo central
            </p>
            <h3 className="mt-2 font-serif text-2xl text-stone-50">
              {shelterName}
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-300/80">
              Gerador, enfermaria improvisada e portas sob pressao constante.
            </p>
          </div>
        </div>

        {survivors.slice(0, chipPositions.length).map((survivor, index) => {
          const chip = chipPositions[index];
          if (!chip) return null;

          return (
            <div
              key={survivor.id}
              className="absolute"
              style={{ left: chip.left, top: chip.top }}
            >
              <div className="flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[linear-gradient(145deg,_rgba(120,53,15,0.95),_rgba(41,23,18,0.95))] text-xs font-medium text-stone-100 shadow-lg shadow-black/30">
                {survivor.nome
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            </div>
          );
        })}

        {locations.map((location) => {
          const position = locationPositions[location.id];
          if (!position) return null;

          const isHighlighted = highlightedLocationIds.includes(location.id);

          return (
            <article
              key={location.id}
              className="absolute w-[13rem] -translate-x-1/2 -translate-y-1/2"
              style={{ left: position.left, top: position.top }}
            >
              <div
                className={`rounded-[1.6rem] border p-4 shadow-xl shadow-black/20 ${stateTone[location.estado]} ${
                  isHighlighted ? "ring-2 ring-amber-300/60" : ""
                }`}
              >
                <p className="text-[0.65rem] uppercase tracking-[0.24em] opacity-70">
                  {location.distancia}
                </p>
                <h3 className="mt-2 font-serif text-xl">{location.nome}</h3>
                <p className="mt-3 text-[0.72rem] uppercase tracking-[0.22em] opacity-70">
                  {location.tipo}
                </p>
                <p className="mt-3 text-sm leading-6 opacity-90">
                  {location.recompensa}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
