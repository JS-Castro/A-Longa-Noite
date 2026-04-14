"use client";

import { type SurvivorSummary } from "@/lib/game-data";

type ObjectiveData = {
  id: string;
  survivorId: string;
  titulo: string;
  descricao: string;
  motivacao?: string;
  progresso: number;
  alvo: number;
  type?: string;
  rewardMoral?: number;
  rewardTension?: number;
};

type PersonalObjectivesPanelProps = {
  survivors: SurvivorSummary[];
  objectives: ObjectiveData[];
};

function truncateTitle(title: string, maxWords: number = 3): string {
  const words = title.split(" ");
  if (words.length <= maxWords) return title;
  return words.slice(0, maxWords).join(" ");
}

export function PersonalObjectivesPanel({
  survivors,
  objectives,
}: PersonalObjectivesPanelProps) {
  const survivorMap = new Map(survivors.map((s) => [s.id, s]));

  return (
    <div className="rounded-[2rem] border border-white/10 bg-stone-950/85 p-6 shadow-2xl shadow-black/25">
      <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
        Objetivos pessoais
      </p>
      <h2 className="mt-3 font-serif text-3xl text-stone-50">
        Jornada individual
      </h2>
      <p className="mt-3 text-sm leading-7 text-stone-300/80">
        Cada sobrevivente persegue um objetivo pessoal que reflete o seu caminho
        e luta interna.
      </p>

      <div className="mt-6 space-y-3">
        {objectives.map((objective) => {
          const survivor = survivorMap.get(objective.survivorId);
          if (!survivor) return null;

          const isCompleted = objective.progresso >= objective.alvo;
          const progressPercent = Math.min(
            (objective.progresso / objective.alvo) * 100,
            100,
          );

          return (
            <div
              key={objective.id}
              className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                    {survivor.nome}
                  </p>
                  <h3
                    className="mt-2 text-sm font-medium text-stone-50 truncate"
                    title={objective.titulo}
                  >
                    {truncateTitle(objective.titulo)}
                  </h3>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-stone-400">
                    {objective.progresso}/{objective.alvo}
                  </p>
                </div>
              </div>

              <div className="mt-3 h-2 rounded-full bg-white/8">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-[linear-gradient(90deg,_#10b981,_#34d399)]"
                      : "bg-[linear-gradient(90deg,_#6b7280,_#9ca3af)]"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {isCompleted &&
                objective.rewardMoral !== undefined &&
                objective.rewardTension !== undefined && (
                  <div className="mt-3 rounded-lg bg-emerald-500/15 border border-emerald-400/30 px-3 py-2">
                    <p className="text-xs font-medium text-emerald-100">
                      Concluído! +{objective.rewardMoral} moral, {objective.rewardTension > 0 ? "+" : ""}{objective.rewardTension} tensão
                    </p>
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {objectives.length === 0 && (
        <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/5 p-4 text-center">
          <p className="text-sm text-stone-400">
            Nenhum objetivo pessoal disponível.
          </p>
        </div>
      )}
    </div>
  );
}
