# Resume Maker iPhone Handoff

## Current status

Completed on June 12, 2026:

- Converted the Windows Electron renderer into a Capacitor iOS project.
- Added iPhone Edit and Preview views.
- Added persistent resume storage with Capacitor Preferences.
- Added PDF export through the native iOS share sheet.
- Added the Resume Maker app icon.
- Generated the Xcode project in `ios/App/App.xcodeproj`.
- Tested the full workflow at a 390 x 844 iPhone viewport:
  editing, persistence after reload, preview rendering, and PDF generation.
- Tested the live web build successfully in Safari on the connected iPhone.

The native app has not been signed or installed because Xcode only runs on
macOS.

## Continue on a Mac

Install Xcode and Node.js 22 or newer, then open Terminal in this folder:

```bash
npm ci
npm run ios:sync
open ios/App/App.xcodeproj
```

In Xcode:

1. Select the **App** project and **App** target.
2. Open **Signing & Capabilities**.
3. Select your Apple Developer team.
4. Change `com.resumemaker.mobile` if Xcode says the identifier is unavailable.
5. Connect and unlock the iPhone, then trust the Mac if prompted.
6. Select the iPhone as the run destination and press **Run**.
7. If prompted on the iPhone, enable Developer Mode under
   **Settings > Privacy & Security > Developer Mode**.

With a free Apple ID, the development installation normally requires periodic
re-signing. Paid Apple Developer membership supports longer-lived distribution.

## Useful commands

```bash
npm run build
npm run ios:sync
npm run test:mobile
```

`npm run test:mobile` expects Chrome and a development server at
`http://127.0.0.1:4173/`. Start it with:

```bash
npm run dev -- --host 127.0.0.1 --port 4173
```

## Known limitation

Recursive duplicate-folder scanning remains desktop-only because iOS does not
allow arbitrary recursive access to external folders.
