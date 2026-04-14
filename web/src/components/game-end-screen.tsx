"use client";

import type { GameStatus } from "@/lib/game-data";

type GameEndScreenProps = {
  status: GameStatus;
  turno: number;
  defeatReason: string | null;
  onRestart: () => void;
};

export function GameEndScreen({ status, turno, defeatReason, onRestart }: GameEndScreenProps) {
  const isVictory = status === "victory";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/60">
        <div
          className={`border-b border-white/10 px-8 py-8 ${
            isVictory
              ? "bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.12),_transparent_50%)]"
              : "bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.12),_transparent_50%)]"
          }`}
        >
          <p
            className={`text-xs uppercase tracking-[0.4em] ${
              isVictory ? "text-emerald-400/80" : "text-rose-400/80"
            }`}
          >
            {isVictory ? "Vitoria" : "Derrota"}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-50 sm:text-5xl">
            {isVictory ? "O Amanhecer Chegou" : "A Noite Venceu"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-stone-300/80">
            {isVictory
              ? "A Estacao Vaga-Lume resistiu. A colonia sobreviveu ao pior que a noite tinha para dar."
              : (defeatReason ?? "O abrigo nao resistiu.")}
          </p>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-5 py-4">
            <p className="text-sm text-stone-400">Turnos sobrevividos</p>
            <p className="font-serif text-2xl text-stone-50">{turno - 1}</p>
          </div>

          <button
            type="button"
            onClick={onRestart}
            className={`mt-6 w-full rounded-2xl px-6 py-4 text-sm font-medium transition ${
              isVictory
                ? "border border-emerald-300/40 bg-emerald-100 text-stone-950 hover:bg-emerald-200"
                : "border border-rose-300/40 bg-rose-950/60 text-stone-100 hover:bg-rose-900/60"
            }`}
          >
            Jogar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
