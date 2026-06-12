# Resume Maker — Continue Here

## Goal
Get Resume Maker onto the iPhone from this **Windows** PC (no Mac). Path chosen:
**cloud macOS build → unsigned IPA → install with AltStore (auto-refresh)**.
Sideloadly is set up too as a manual fallback.

## DONE (all committed + pushed)
- GitHub repo (public): https://github.com/CSAtechnologies/resume-maker-ios
- GitHub Actions builds an **unsigned IPA** on a macOS runner. Verified: builds
  pass in ~2 min.
- Each build publishes a **GitHub Release** (`latest`) + an AltStore source.
  Verified live:
  - Source URL: `https://github.com/CSAtechnologies/resume-maker-ios/releases/latest/download/apps.json`
  - IPA URL:    `https://github.com/CSAtechnologies/resume-maker-ios/releases/latest/download/ResumeMaker.ipa`
- A copy of the IPA is also at `ipa-out/ResumeMaker.ipa` (for Sideloadly).
- Guides: `ALTSTORE.md` (recommended) and `SIDELOAD.md` (fallback).
- iTunes + iCloud downloaded on Windows (must be the **apple.com** versions).

## RESTARTING PC NOW
Rebooting to finish the iCloud install. Nothing pending — repo is clean.

## NEXT STEPS AFTER REBOOT (AltStore route)
1. Install **AltServer** from https://altstore.io/ , launch it (lives in the
   system tray, click the `^` arrow).
2. Plug in + unlock the iPhone, tap **Trust**.
3. AltServer tray icon → **Install AltStore → [iPhone]**. Sign in with Apple ID
   (use an app-specific password if 2FA is on:
   https://account.apple.com/account/manage).
4. On iPhone: **Settings → General → VPN & Device Management** → trust the
   Apple ID profile. Enable **Developer Mode** if asked, then reboot phone.
5. Open **AltStore → Sources → +** and paste the source URL above. Install
   **Resume Maker**.
6. Auto-refresh: iPhone **Settings → General → Background App Refresh → On**;
   keep **AltServer running** on the PC (launch at startup) and iPhone on the
   **same Wi-Fi**. AltStore re-signs the 7-day cert automatically.

## To rebuild after any code change
`git push` (or Actions tab → Run workflow). New version appears as an update in
AltStore → My Apps. Version is `1.0.<build number>`.

## Open optional item
GitHub flagged the workflow's `actions/*` steps run on Node 20 (retired from
runners Sept 16, 2026). Builds fine until then; can bump to Node-24 versions
later.
