import { readFile, writeFile } from "node:fs/promises";

const packageFile = new URL("../ios/App/CapApp-SPM/Package.swift", import.meta.url);

try {
  const source = await readFile(packageFile, "utf8");
  const normalized = source.replaceAll("\\", "/");

  if (source !== normalized) {
    await writeFile(packageFile, normalized, "utf8");
    console.log("Normalized Swift package paths for macOS.");
  }
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}
