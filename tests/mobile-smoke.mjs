import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const baseUrl = process.env.RESUME_MAKER_URL || "http://127.0.0.1:4173/";
const executablePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const artifactDir = new URL("../test-artifacts/", import.meta.url);

await mkdir(artifactDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
});

const runtimeErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") {
    runtimeErrors.push(message.text());
  }
});
page.on("pageerror", (error) => runtimeErrors.push(error.message));

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  await assertVisible(page.getByRole("tab", { name: "Edit", exact: true }));
  await assertVisible(
    page.getByRole("tab", { name: "Preview", exact: true }),
  );
  await assertVisible(
    page.getByRole("button", { name: "Export PDF", exact: true }),
  );

  const nameInput = page.getByPlaceholder("John Doe", { exact: true });
  const resumeContent = page.locator("textarea");
  await nameInput.fill("iPhone Smoke Test");
  await resumeContent.fill(
    [
      "Summary",
      "Mobile-ready resume created on iPhone.",
      "",
      "Skills",
      "JavaScript, React, PDF export",
      "",
      "Experience",
      "Resume Maker",
      "Mobile App Tester",
      "2025 - Present",
      "",
      "Verified editing, preview, persistence, and PDF export.",
    ].join("\n"),
  );
  await page.waitForTimeout(150);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await nameInput.inputValue(), "iPhone Smoke Test");
  assert.match(await resumeContent.inputValue(), /Mobile-ready resume/);

  await page.screenshot({
    path: fileURLToPath(new URL("edit-view.png", artifactDir)),
    fullPage: false,
  });

  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await assertVisible(page.locator(".preview-panel"));
  await assertHidden(page.locator(".form-panel"));
  assert.match(
    await page.locator(".preview-panel").innerText(),
    /Mobile-ready resume/,
  );
  await page.screenshot({
    path: fileURLToPath(new URL("preview-view.png", artifactDir)),
    fullPage: false,
  });

  await page.getByRole("button", { name: "Export PDF", exact: true }).click();
  await page.locator(".modal-filename input").fill("Smoke Test");
  const downloadPromise = page.waitForEvent("download");
  await page.locator(".modal-save").click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "iPhone Smoke Test.pdf");

  assert.deepEqual(runtimeErrors, []);
  console.log("Mobile smoke test passed.");
} finally {
  await browser.close();
}

async function assertVisible(locator) {
  assert.equal(await locator.isVisible(), true);
}

async function assertHidden(locator) {
  assert.equal(await locator.isVisible(), false);
}
