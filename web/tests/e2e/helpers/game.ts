import { expect, type Locator, type Page } from "@playwright/test";

export const gotoGame = async (page: Page) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "A Longa Noite" })).toBeVisible();
};

export const advanceToPlanning = async (page: Page) => {
  await page.getByRole("button", { name: "Avancar para Planeamento" }).click();
  await expect(page.getByText("Fase: Planeamento")).toBeVisible();
};

export const advanceToAction = async (page: Page) => {
  await page.getByRole("button", { name: "Avancar para Planeamento" }).click();
  await page.getByRole("button", { name: "Avancar para Acao" }).click();
  await expect(page.getByText("Fase: Acao")).toBeVisible();
};

export const advanceToResolution = async (page: Page) => {
  await page.getByRole("button", { name: "Avancar para Planeamento" }).click();
  await page.getByRole("button", { name: "Avancar para Acao" }).click();
  await page.getByRole("button", { name: "Avancar para Resolucao" }).click();
  await expect(page.getByText("Fase: Resolucao")).toBeVisible();
};

export const dragLocatorTo = async (
  page: Page,
  source: Locator,
  target: Locator,
) => {
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();

  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox) throw new Error("dragLocatorTo: source bounding box missing");
  if (!targetBox) throw new Error("dragLocatorTo: target bounding box missing");

  const sourceX = sourceBox.x + sourceBox.width / 2;
  const sourceY = sourceBox.y + sourceBox.height / 2;
  const targetX = targetBox.x + targetBox.width / 2;
  const targetY = targetBox.y + targetBox.height / 2;

  await page.mouse.move(sourceX, sourceY);
  await page.mouse.down();
  await page.mouse.move(sourceX + 6, sourceY + 6, { steps: 6 });
  await page.mouse.move(targetX, targetY, { steps: 30 });
  await page.mouse.up();
};
