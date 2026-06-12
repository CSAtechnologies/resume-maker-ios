# AltStore install + auto-refresh (Windows)

AltStore is the better long-term option than plain Sideloadly because it
**auto-refreshes** the 7-day signature in the background over Wi-Fi, so the app
keeps working without you manually re-installing it each week.

Every cloud build publishes a **GitHub Release** with the IPA and an AltStore
**source** file, so installs and updates are one tap.

- **Source URL to add in AltStore:**
  `https://github.com/CSAtechnologies/resume-maker-ios/releases/latest/download/apps.json`
- The IPA always lives at:
  `https://github.com/CSAtechnologies/resume-maker-ios/releases/latest/download/ResumeMaker.ipa`

You need: Windows PC, an Apple ID, **iTunes + iCloud from apple.com** (not the
Microsoft Store versions), and the iPhone on the **same Wi-Fi** as the PC.

---

## Step 1 — Install AltServer on Windows

1. Download AltServer from <https://altstore.io/> and install it.
2. Launch AltServer. It lives in the system tray (bottom-right, near the clock).
   You may need the "show hidden icons" arrow.
3. Plug in and unlock your iPhone. Tap **Trust** and enter your passcode.

## Step 2 — Install the AltStore app onto the iPhone

1. In the Windows tray, click the **AltServer** icon → **Install AltStore** →
   select your iPhone.
2. Enter your **Apple ID** and password (use an
   [app-specific password](https://account.apple.com/account/manage) if you have
   two-factor auth).
3. On the iPhone: **Settings → General → VPN & Device Management** → tap your
   Apple ID → **Trust**.
4. Enable **Developer Mode** if prompted: **Settings → Privacy & Security →
   Developer Mode → On**, then reboot.

## Step 3 — Add the Resume Maker source

1. Open **AltStore** on the iPhone → **Browse** (or **Sources**) tab.
2. Tap **+** (top-left/right) and paste the source URL:
   `https://github.com/CSAtechnologies/resume-maker-ios/releases/latest/download/apps.json`
3. Open the **Resume Maker (CSAtechnologies)** source and tap **GET / Install**
   on Resume Maker.

## Step 4 — Turn on auto-refresh

This is what removes the weekly manual re-signing:

1. On the iPhone: **Settings → General → Background App Refresh → On**, and make
   sure **AltStore** is allowed.
2. Keep **AltServer running** on the PC (let it start with Windows: tray icon →
   check "Launch at startup" if offered), and keep the iPhone on the **same
   Wi-Fi**.
3. In AltStore → **My Apps**, you'll see the days remaining. With AltServer
   reachable, AltStore re-signs in the background before it expires. You can
   also pull-to-refresh in **My Apps** to force it.

> Auto-refresh needs AltServer awake and reachable. If the PC is asleep/off for
> 7+ days straight, open AltStore with AltServer running and pull to refresh.

## Updating to a new build

Whenever a new build is pushed, the release at `latest` updates automatically.
In AltStore → **My Apps**, the new version appears as an **Update** — tap it.
(The version is `1.0.<build number>`, bumped on every CI run.)

## Free vs paid Apple ID

- **Free:** 7-day signature (auto-refreshed by AltStore), max 3 sideloaded apps,
  10 app IDs/week. Fine for one app.
- **Paid ($99/yr):** 1-year signature and far fewer limits.

## Troubleshooting

- **AltStore can't find AltServer** — same Wi-Fi? AltServer running? Try
  plugging the iPhone in via USB and refresh once.
- **"Unable to install" / Mail plugin prompt** — older AltServer asked to enable
  a Mail plug-in; current versions don't. Update AltServer to the latest.
- **iTunes/iCloud errors** — must be the apple.com downloads, not Microsoft
  Store. Reinstall those versions.
- **Source won't load** — confirm at least one CI build has finished so the
  `latest` release exists, then re-add the source URL.
