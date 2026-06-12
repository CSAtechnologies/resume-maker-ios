import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Share } from "@capacitor/share";

const RESUME_DATA_KEY = "resume-maker-data";
const isNative = Capacitor.isNativePlatform();

function safePathSegment(value, fallback) {
  const cleaned = String(value || "")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || fallback;
}

function arrayBufferToBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return btoa(binary);
}

async function savePDF(pdfArrayBuffer, pdfName, _outputDir, folderName) {
  const fileName = safePathSegment(pdfName, "resume.pdf");
  const folder = safePathSegment(folderName, "Resume Maker");

  if (!isNative) {
    const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return { success: true, filePath: fileName };
  }

  try {
    const result = await Filesystem.writeFile({
      path: `${folder}/${fileName}`,
      data: arrayBufferToBase64(pdfArrayBuffer),
      directory: Directory.Cache,
      recursive: true,
    });

    await Share.share({
      title: "Resume PDF",
      text: "Save or share your resume",
      url: result.uri,
      dialogTitle: "Save or share PDF",
    });

    return { success: true, filePath: fileName };
  } catch (error) {
    return {
      success: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

async function saveResumeData(data) {
  try {
    const value = JSON.stringify(data);
    if (isNative) {
      await Preferences.set({ key: RESUME_DATA_KEY, value });
    } else {
      localStorage.setItem(RESUME_DATA_KEY, value);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

async function loadResumeData() {
  try {
    const value = isNative
      ? (await Preferences.get({ key: RESUME_DATA_KEY })).value
      : localStorage.getItem(RESUME_DATA_KEY);

    if (!value) {
      return { success: false, reason: "no-data" };
    }

    return { success: true, data: JSON.parse(value) };
  } catch (error) {
    return {
      success: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

window.electronAPI = {
  selectDirectory: async () => ({
    success: true,
    directory: "Choose location when exporting",
  }),
  checkFileExists: async () => false,
  savePDF,
  saveResumeData,
  loadResumeData,
  openFile: async () => "",
  scanDuplicates: async () => ({
    success: false,
    reason:
      "Folder duplicate scanning is available only in the desktop version.",
  }),
  onScanProgress: () => () => {},
};

function setMobileView(app, view) {
  app.dataset.mobileView = view;
  document.querySelectorAll(".ios-view-button").forEach((button) => {
    const selected = button.dataset.view === view;
    button.classList.toggle("ios-view-button-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });

  if (view === "preview") {
    requestAnimationFrame(updatePreviewScale);
  }
}

function updatePreviewScale() {
  const panel = document.querySelector(".preview-panel");
  const pages = document.querySelector(".resume-pages");
  if (!panel || !pages || window.innerWidth > 767) {
    return;
  }

  const availableWidth = Math.max(280, panel.clientWidth - 24);
  const a4WidthInPixels = 793.7;
  const scale = Math.min(1, availableWidth / a4WidthInPixels);
  pages.style.setProperty("--ios-preview-scale", scale.toFixed(4));
}

function disableDesktopOnlyTools() {
  document.querySelectorAll(".tools-dropdown-item").forEach((button) => {
    if (!button.textContent.includes("Duplication")) {
      return;
    }

    button.disabled = true;
    button.textContent = "Duplicate Check (desktop only)";
    button.title =
      "iOS does not allow recursive scanning of arbitrary folders.";
  });
}

function installMobileInterface() {
  if (window.innerWidth > 767) {
    return false;
  }

  const app = document.querySelector(".app");
  const appBody = document.querySelector(".app-body");
  if (!app || !appBody || document.querySelector(".ios-view-toggle")) {
    return false;
  }

  document.body.classList.add("ios-mobile");

  const toggle = document.createElement("div");
  toggle.className = "ios-view-toggle";
  toggle.setAttribute("role", "tablist");
  toggle.setAttribute("aria-label", "Resume view");

  for (const [view, label] of [
    ["edit", "Edit"],
    ["preview", "Preview"],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ios-view-button";
    button.dataset.view = view;
    button.textContent = label;
    button.setAttribute("role", "tab");
    button.addEventListener("click", () => setMobileView(app, view));
    toggle.appendChild(button);
  }

  app.insertBefore(toggle, appBody);
  setMobileView(app, "edit");
  updatePreviewScale();
  disableDesktopOnlyTools();
  return true;
}

const observer = new MutationObserver(() => {
  installMobileInterface();
  disableDesktopOnlyTools();
});

observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener("resize", updatePreviewScale);
window.visualViewport?.addEventListener("resize", updatePreviewScale);

const legacyBundleUrl = new URL(
  "/assets/index-B0L7_lq3.js",
  window.location.href,
).href;
await import(/* @vite-ignore */ legacyBundleUrl);
