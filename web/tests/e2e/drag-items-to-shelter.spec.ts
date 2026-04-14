import { expect, test } from "@playwright/test";

import { advanceToPlanning, dragLocatorTo, gotoGame } from "./helpers/game";

test("drags item card from hand to shelter dropzone in Planning", async ({ page }) => {
  await gotoGame(page);
  await advanceToPlanning(page);

  await expect(page.getByText("Fase: Planeamento")).toBeVisible();

  const hand = page.getByTestId("hand-items");
  const shelterDropZone = page.getByTestId("shelter-dropzone");

  const firstCard = hand.locator("[data-testid^='item-card:']").first();
  await expect(firstCard).toBeVisible();

  await dragLocatorTo(page, firstCard, shelterDropZone);

  await expect(page.getByText("Cartas no abrigo: 1")).toBeVisible();
  await expect(page.getByTestId("shelter-items").locator("[data-testid^='item-card:']")).toHaveCount(1);
});
