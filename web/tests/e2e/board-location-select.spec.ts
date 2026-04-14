import { expect, test } from "@playwright/test";

import { advanceToAction, gotoGame } from "./helpers/game";

test("selects action by clicking board location during Action phase", async ({ page }) => {
  await gotoGame(page);

  await expect(page.getByText("Fase: Crise")).toBeVisible();
  await expect(page.getByRole("button", { name: "Resolver turno" })).toBeDisabled();

  await advanceToAction(page);
  await expect(page.getByText("Fase: Acao")).toBeVisible();

  await page.getByTestId("board-location:loc_farmacia_encosta").click();

  await page.getByRole("button", { name: "Avancar para Resolucao" }).click();
  await expect(page.getByText("Fase: Resolucao")).toBeVisible();

  await page.getByRole("button", { name: "Resolver turno" }).click();

  await expect(page.getByText("Acao do turno: Explorar a farmacia da encosta.")).toBeVisible();
});
