"use client";

import { useState } from "react";
import type { EventChoice, EventChoiceImpact } from "@/lib/game-data";

type ChoiceResultPanelProps = {
  choice: EventChoice;
  impact: EventChoiceImpact;
  onContinue: () => void;
};

const impactLabelMap: Record<keyof EventChoiceImpact, string> = {
  moral: "Moral",
  mantimentos: "Mantimentos",
  combustivel: "Combustível",
  pressaoDaNoite: "Pressão da Noite",
  survivorTension: "Tensão dos Sobreviventes",
  ameacaExterior: "Ameaça Exterior",
  objectiveProgress: "Progresso do Objetivo",
  secureLocationId: "Localização Segura",
};

export function ChoiceResultPanel({
  choice,
  impact,
  onContinue,
}: ChoiceResultPanelProps) {
  const [isVisible] = useState(true);

  const getImpactEntries = () => {
    const entries: Array<{
      key: keyof EventChoiceImpact;
      value: string | number | undefined;
      label: string;
      isPositive: boolean;
    }> = [];

    const impactKeys = Object.keys(impact) as Array<keyof EventChoiceImpact>;

    for (const key of impactKeys) {
      const value = impact[key];

      if (value === undefined || value === null) continue;

      // Skip non-numeric/non-string values (like secureLocationId which is just a location ID)
      if (typeof value === "string" && key !== "ameacaExterior") {
        // It's a secureLocationId or similar, skip for now as it's not a delta
        continue;
      }

      const numValue = typeof value === "number" ? value : 0;
      const label = impactLabelMap[key] || key;
      const isPositive = numValue >= 0;

      entries.push({
        key,
        value,
        label,
        isPositive,
      });
    }

    return entries;
  };

  const impactEntries = getImpactEntries();

  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(26,32,44,0.98),_rgba(15,23,42,0.96))] p-6 shadow-2xl shadow-black/50 transition-all duration-700 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
    >
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
            Consequência
          </p>
          <h3 className="mt-3 font-serif text-2xl leading-tight text-stone-50">
            {choice.consequenceTitle}
          </h3>
          <p className="mt-3 text-sm leading-7 text-stone-300/80">
            {choice.consequenceDetail}
          </p>
        </div>

        {impactEntries.length > 0 && (
          <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              Impacto nos recursos
            </p>
            <div className="mt-4 space-y-3">
              {impactEntries.map((entry) => {
                const numValue = typeof entry.value === "number" ? entry.value : 0;
                const displayValue = numValue >= 0 ? `+${numValue}` : `${numValue}`;
                const colorClass = entry.isPositive
                  ? "text-emerald-400"
                  : "text-rose-400";

                return (
                  <div
                    key={entry.key}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/3 px-3 py-2"
                  >
                    <span className="text-sm text-stone-300">
                      {entry.label}
                    </span>
                    <span className={`font-mono font-semibold ${colorClass}`}>
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-2xl border border-sky-300/40 bg-sky-100/15 px-4 py-3 text-sm font-medium text-sky-100 transition hover:bg-sky-100/25 active:bg-sky-100/20"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
