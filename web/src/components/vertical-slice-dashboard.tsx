"use client";

import { actionDefinitions } from "@/lib/game-data";
import { useGameStore } from "@/stores/game-store";

const metricTone = (value: number) => {
  if (value >= 70) return "text-emerald-300";
  if (value >= 45) return "text-amber-300";
  return "text-rose-300";
};

const riskTone = {
  baixo: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
  medio: "border-amber-400/40 bg-amber-500/10 text-amber-100",
  "medio-alto": "border-orange-400/40 bg-orange-500/10 text-orange-100",
  alto: "border-rose-400/40 bg-rose-500/10 text-rose-100",
} as const;

export function VerticalSliceDashboard() {
  const {
    turno,
    shelter,
    survivors,
    locations,
    objective,
    events,
    log,
    selectedActionId,
    selectedChoiceId,
    setSelectedAction,
    setSelectedChoice,
    resolveSelectedAction,
    resetGame,
  } = useGameStore();
  const activeEvent = events[0];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_45%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(26,32,44,0.94))] p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-stone-300/70">
                Vertical Slice
              </p>
              <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
                A Longa Noite
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-200/80 sm:text-base">
                Um abrigo isolado, um inverno que nao termina e um grupo a
                tentar manter-se humano enquanto os `Ermos` se aproximam.
              </p>
              <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-stone-300/80">
                Turno {turno}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-300/60">
                Abrigo ativo
              </p>
              <p className="mt-2 font-serif text-2xl text-stone-50">
                {shelter.nome}
              </p>
              <p className="text-sm text-stone-300/70">{shelter.ameacaExterior}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-sky-300/20 bg-sky-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-100/70">
                Temperatura
              </p>
              <p className="mt-3 font-serif text-3xl text-sky-50">
                {shelter.temperatura}
              </p>
            </div>
            <div className="rounded-3xl border border-rose-300/20 bg-rose-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-rose-100/70">
                Moral
              </p>
              <p className={`mt-3 font-serif text-3xl ${metricTone(shelter.moral)}`}>
                {shelter.moral}%
              </p>
            </div>
            <div className="rounded-3xl border border-amber-300/20 bg-amber-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-100/70">
                Mantimentos
              </p>
              <p className="mt-3 font-serif text-3xl text-amber-50">
                {shelter.mantimentos} dias
              </p>
            </div>
            <div className="rounded-3xl border border-stone-300/20 bg-stone-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-100/70">
                Pressao da Noite
              </p>
              <p
                className={`mt-3 font-serif text-3xl ${metricTone(
                  100 - shelter.pressaoDaNoite,
                )}`}
              >
                {shelter.pressaoDaNoite}%
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-emerald-300/15 bg-emerald-500/8 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/60">
                  Objetivo principal
                </p>
                <h2 className="mt-2 font-serif text-2xl text-stone-50">
                  {objective.titulo}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-300/80">
                  {objective.descricao}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/60">
                  Progresso
                </p>
                <p className="mt-2 font-serif text-3xl text-emerald-100">
                  {objective.progresso}/{objective.alvo}
                </p>
              </div>
            </div>
            <div className="mt-4 h-3 rounded-full bg-white/8">
              <div
                className="h-3 rounded-full bg-[linear-gradient(90deg,_#34d399,_#bef264)]"
                style={{
                  width: `${(objective.progresso / objective.alvo) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-stone-950/85 p-6 shadow-2xl shadow-black/25">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
            Acao recomendada
          </p>
          <h2 className="mt-3 font-serif text-3xl text-stone-50">
            Escolha do turno
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-300/80">
            O turno ja resolve impacto em moral, mantimentos, combustivel e
            pressao. Isto e a primeira camada jogavel do prototipo.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {actionDefinitions.map((action) => {
              const isSelected = action.id === selectedActionId;

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setSelectedAction(action.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-stone-50 bg-stone-50 text-stone-950"
                      : "border-white/10 bg-white/5 text-stone-200 hover:border-white/25 hover:bg-white/10"
                  }`}
                >
                  <span className="block text-sm font-medium">{action.label}</span>
                  <span className="mt-1 block text-xs leading-6 opacity-75">
                    {action.resumo}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={resolveSelectedAction}
              className="rounded-2xl border border-amber-300/40 bg-amber-100 px-4 py-3 text-sm font-medium text-stone-950 transition hover:bg-amber-200"
            >
              Resolver turno
            </button>
            <button
              type="button"
              onClick={resetGame}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-stone-100 transition hover:bg-white/10"
            >
              Reiniciar prototipo
            </button>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-white/10 bg-stone-950/80 p-6 shadow-xl shadow-black/20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
                Sobreviventes ativos
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-50">
                Estado da colonia
              </h2>
            </div>
            <p className="max-w-xs text-right text-sm leading-6 text-stone-400">
              Cada retrato podera mais tarde abrir inventario, relacoes, feridas
              e objetivos pessoais.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {survivors.map((survivor) => (
              <article
                key={survivor.id}
                className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                      {survivor.papel}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-stone-50">
                      {survivor.nome}
                    </h3>
                  </div>
                  <div className="h-14 w-14 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_35%_30%,_rgba(255,236,201,0.25),_transparent_35%),linear-gradient(135deg,_rgba(117,60,40,0.95),_rgba(39,25,21,0.95))]" />
                </div>

                <p className="mt-4 text-sm leading-7 text-stone-300/80">
                  {survivor.estado}
                </p>

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
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,_rgba(17,24,39,0.96),_rgba(9,12,18,0.96))] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
              Localizacoes
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-50">
              Mapa da serra
            </h2>
            <div className="mt-6 grid gap-3">
              {locations.map((location) => (
                <article
                  key={location.id}
                  className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                        {location.distancia}
                      </p>
                      <h3 className="mt-2 font-serif text-xl text-stone-50">
                        {location.nome}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                        location.estado === "seguro"
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                          : location.estado === "instavel"
                            ? "border-amber-400/40 bg-amber-500/10 text-amber-100"
                            : "border-rose-400/40 bg-rose-500/10 text-rose-100"
                      }`}
                    >
                      {location.estado}
                    </span>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500">
                    {location.tipo}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-300/80">
                    Recompensa potencial: {location.recompensa}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,_rgba(28,35,47,0.96),_rgba(13,17,24,0.96))] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
              Evento ativo
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-50">
              {activeEvent.titulo}
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-stone-500">
              {activeEvent.local}
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-300/80">
              {activeEvent.texto}
            </p>
            <div className="mt-5 space-y-3">
              {activeEvent.choices.map((choice) => {
                const isSelected = choice.id === selectedChoiceId;

                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => setSelectedChoice(choice.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-sky-200/50 bg-sky-100/10 text-stone-50"
                        : "border-white/10 bg-white/5 text-stone-200 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <span className="block text-sm font-medium">{choice.label}</span>
                    <span className="mt-2 block text-xs leading-6 opacity-80">
                      {choice.detalhe}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[#10151d] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
              Feed narrativo
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-50">
              Eventos e consequencias
            </h2>
            <div className="mt-6 space-y-4">
              {log.slice(0, 2).map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-[1.5rem] border border-amber-200/10 bg-amber-100/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-200/60">
                    Turno {entry.turno}
                  </p>
                  <h3 className="mt-2 font-serif text-xl text-stone-50">
                    {entry.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300/80">
                    {entry.detalhe}
                  </p>
                </article>
              ))}
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                        {event.local}
                      </p>
                      <h3 className="mt-2 font-serif text-xl text-stone-50">
                        {event.titulo}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                        riskTone[event.risco]
                      }`}
                    >
                      {event.risco}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone-300/80">
                    {event.texto}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,_rgba(46,16,16,0.95),_rgba(18,18,18,0.95))] p-6 shadow-xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
              Estado do prototipo
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-50">
              O que ja esta vivo
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200/80">
              <li>Escolha de acao por turno</li>
              <li>Resolucao simples de recursos e pressao</li>
              <li>Evento ativo com escolhas reais</li>
              <li>Mapa e objetivo principal da sessao</li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
