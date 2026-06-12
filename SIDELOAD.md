# Sideloading Resume Maker onto your iPhone from Windows

Windows cannot compile an iOS app, so we build the `.ipa` on a free GitHub
Actions **macOS** runner in the cloud, download it, and install it from your PC
with **Sideloadly**, which signs it using your own Apple ID.

You need:

- A GitHub account (the project must live in a GitHub repo).
- An **Apple ID** (a free one works; see the 7-day note at the bottom).
- **iTunes** and **iCloud** installed on Windows — install the versions from
  **apple.com**, *not* the Microsoft Store versions. Sideloadly needs these for
  device communication and signing.
- A USB cable for the iPhone.

---

## Step 1 — Get the project onto GitHub

If you used the helper in this session this is already done. Otherwise, from the
project folder:

```powershell
git init
git add .
git commit -m "Resume Maker iOS"
gh repo create resume-maker-ios --private --source . --push
```

## Step 2 — Build the IPA in the cloud

1. On GitHub, open the repo's **Actions** tab.
2. Select **Build unsigned iOS IPA**.
3. Click **Run workflow** (it also runs automatically on every push to `main`).
4. Wait for the green check (~5–10 minutes).
5. Open the finished run and download the **ResumeMaker-unsigned-ipa**
   artifact from the **Artifacts** section.
6. Unzip it. Inside is `ResumeMaker.ipa`.

> The IPA is intentionally **unsigned**. Sideloadly signs it on your PC, so no
> Apple certificates are ever stored in GitHub.

## Step 3 — Install Sideloadly

1. Download from <https://sideloadly.io/> and install it.
2. Install **iTunes** and **iCloud** from apple.com if you haven't.
3. Connect and unlock your iPhone. Tap **Trust** if prompted, and enter your
   passcode.

## Step 4 — Sideload the app

1. Open Sideloadly.
2. Your iPhone should appear in the **device** dropdown at the top.
3. Drag `ResumeMaker.ipa` onto the Sideloadly window (or use the **IPA** field).
4. Enter your **Apple ID** in the Apple account field.
5. Click **Start**.
6. Enter your Apple ID password when asked. If you have two-factor auth, you may
   need an **app-specific password** from
   <https://account.apple.com/account/manage> → *App-Specific Passwords*.
7. Sideloadly registers the app, signs it, and installs it. Watch for
   **"Done"** at the bottom.

## Step 5 — Trust the developer profile on the iPhone

1. On the iPhone: **Settings → General → VPN & Device Management**.
2. Under *Developer App*, tap your Apple ID email, then **Trust**.

## Step 6 — Enable Developer Mode (iOS 16+)

1. **Settings → Privacy & Security → Developer Mode → On**.
2. The phone restarts; confirm after it reboots.
3. Launch **Resume Maker** from the Home Screen.

---

## The 7-day limit (free Apple ID)

Apps signed with a **free** Apple ID expire after **7 days** and the bundle ID
can only have a limited number of apps. To renew, just re-run Sideloadly with
the same IPA before or after it expires. Sideloadly's **"Sideload after
reboot"** / auto-resign helpers can reduce the manual work.

A **paid Apple Developer account ($99/yr)** raises the signing period to
**1 year** and removes most of these limits.

## If the bundle identifier is rejected

The app uses `com.resumemaker.mobile`. If Apple says it's unavailable, change it
in two places and rebuild:

- `capacitor.config.json` → `appId`
- `ios/App/App.xcodeproj/project.pbxproj` → both `PRODUCT_BUNDLE_IDENTIFIER`
  lines

Then commit, push, and re-run the workflow.

## Alternative: AltStore / SideStore

AltStore (<https://altstore.io/>) does the same job and **auto-refreshes** the
7-day signature over Wi-Fi via a background helper on your PC, so you don't have
to re-sideload manually each week. Install AltServer on Windows, then open the
downloaded IPA with **AltStore → My Apps → +**. Same Apple ID rules apply.

## Troubleshooting

- **"App could not be installed"** — make sure iTunes + iCloud are the
  apple.com builds, not the Microsoft Store ones.
- **Device not detected** — unlock the phone, tap Trust, try a different cable
  or USB port.
- **Workflow build failed** — open the failed step's log in the Actions run.
  The most common cause is a dependency hiccup; re-run the job.
- **App opens to a blank screen** — confirm the run's `npm run build` step
  succeeded; the web assets are bundled from `dist/`.
