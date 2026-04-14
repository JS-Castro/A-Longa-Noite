import { expect, test } from "@playwright/test";

import { advanceToAction, gotoGame } from "./helpers/game";

test("board locations only selectable during Acao, and selection drives turn result", async ({
  page,
}) => {
  await gotoGame(page);

  await expect(
    page.getByRole("button", { name: "Selecionar Farmacia da Encosta" }),
  ).toHaveCount(0);

  await advanceToAction(page);

  await page.getByRole("button", { name: "Selecionar Farmacia da Encosta" }).click();

  await page.getByRole("button", { name: "Avancar para Resolucao" }).click();
  await expect(page.getByText("Fase: Resolucao")).toBeVisible();

  await page.getByRole("button", { name: "Resolver turno" }).click();

  await expect(
    page.getByText(/Acao do turno: Explorar a farmacia da encosta\./),
  ).toBeVisible();
});
