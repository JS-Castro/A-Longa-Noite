import { fireEvent, render, screen } from "@testing-library/react";

import { VerticalSliceDashboard } from "@/components/vertical-slice-dashboard";
import { useGameStore } from "@/stores/game-store";

describe("VerticalSliceDashboard", () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it("renders the current shelter and turn information", () => {
    render(<VerticalSliceDashboard />);

    expect(
      screen.getByRole("heading", { level: 1, name: "A Longa Noite" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Estacao Vaga-Lume")).toHaveLength(2);
    expect(screen.getAllByText("Turno 1")).toHaveLength(2);
    expect(screen.getByText("Fase: Crise")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "O Fio no Gerador" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Segurar a Estacao Ate ao Amanhecer de Emergencia",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Serra e arredores" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Recursos em mao" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Cartas no abrigo: 0/i)).toBeInTheDocument();
  });

  it("resolves a turn when the action button is clicked", () => {
    render(<VerticalSliceDashboard />);

    fireEvent.click(screen.getByRole("button", { name: /Fazer remendo temporario/i }));
    fireEvent.click(screen.getByRole("button", { name: /Avancar para Planeamento/i }));
    fireEvent.click(screen.getByRole("button", { name: /Avancar para Acao/i }));
    fireEvent.click(screen.getByRole("button", { name: /Distribuir racoes com transparencia/i }));
    fireEvent.click(screen.getByRole("button", { name: /Avancar para Resolucao/i }));
    fireEvent.click(screen.getByRole("button", { name: /Resolver turno/i }));

    expect(screen.getAllByText("Turno 2")).toHaveLength(2);
    expect(screen.getByText("Remendo inseguro")).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === "2/6"),
    ).toBeInTheDocument();
    expect(screen.getByText("Fase: Crise")).toBeInTheDocument();
  });

  it("opens and closes the rules panel", () => {
    render(<VerticalSliceDashboard />);

    fireEvent.click(screen.getByRole("button", { name: /Abrir regras/i }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Consulta rapida do turno" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Fechar regras/i }));

    expect(
      screen.queryByRole("heading", { level: 2, name: "Consulta rapida do turno" }),
    ).not.toBeInTheDocument();
  });
});
