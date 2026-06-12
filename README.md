# Resume Maker for iPhone

This project repackages the existing Electron renderer as a Capacitor iOS app.

## Included iPhone adaptations

- Resume data is stored with Capacitor Preferences.
- PDF export opens the native iOS share sheet. Choose **Save to Files** to keep
  the PDF on the iPhone.
- The desktop two-column layout becomes separate **Edit** and **Preview** views.
- Safe-area spacing is included for iPhones with a Dynamic Island or notch.

The desktop duplicate-folder scanner is disabled on iPhone. iOS apps cannot
recursively scan arbitrary folders selected outside their sandbox.

## Build the web app

```powershell
npm install
npm run build
```

## Create or update the Xcode project

```powershell
npx cap add ios
npm run ios:sync
```

The generated Xcode project is at `ios/App/App.xcodeproj`.
The sync command also normalizes Swift Package Manager paths when it is run on
Windows, so the generated project remains portable to macOS.

## Sign and install on an iPhone

Apple's iOS toolchain only runs on macOS. Copy this project to a Mac, install
Xcode, then:

1. Run `npm install` and `npm run ios:sync`.
2. Open `ios/App/App.xcodeproj` in Xcode.
3. Select the **App** target, then **Signing & Capabilities**.
4. Choose your Apple Developer team and use a unique bundle identifier if
   `com.resumemaker.mobile` is unavailable.
5. Connect the iPhone, select it as the run destination, and press **Run**.

A free Apple ID signs development installs for a limited period. A paid Apple
Developer account is required for longer-lived Ad Hoc distribution and for
installing on registered devices outside Xcode.
