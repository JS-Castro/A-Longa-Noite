import { expect, test } from "@playwright/test";

test("shows the rulebook and enforces the turn phases", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Fase: Crise")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Resolver turno" }),
  ).toBeDisabled();

  await page.getByRole("button", { name: "Abrir regras" }).click();
  await expect(
    page.getByRole("heading", { name: "Consulta rapida do turno" }),
  ).toBeVisible();
  await expect(page.getByText("Estrutura do turno")).toBeVisible();
  await page.getByRole("button", { name: "Fechar regras" }).click();
  await expect(
    page.getByRole("heading", { name: "Consulta rapida do turno" }),
  ).not.toBeVisible();

  await page.getByRole("button", { name: "Fazer remendo temporario" }).click();
  await page.getByRole("button", { name: "Avancar para Planeamento" }).click();
  await expect(page.getByText("Fase: Planeamento")).toBeVisible();

  await page.getByRole("button", { name: "Avancar para Acao" }).click();
  await expect(page.getByText("Fase: Acao")).toBeVisible();
  await page.getByTestId("board-location:loc_farmacia_encosta").click();

  await page.getByRole("button", { name: "Avancar para Resolucao" }).click();
  await expect(page.getByText("Fase: Resolucao")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Resolver turno" }),
  ).toBeEnabled();

  await page.getByRole("button", { name: "Resolver turno" }).click();

  await expect(page.getByText("Turno 2").first()).toBeVisible();
  await expect(page.getByText("Fase: Crise")).toBeVisible();
  await expect(page.getByText("Remendo inseguro")).toBeVisible();
});
