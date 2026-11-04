# Attendance — Android app

Your existing app, wrapped as a real Android app with:
- **Background reminders** via Capacitor Local Notifications. Android schedules upcoming reminders natively, so they can fire with the app closed.
- **Home screen widget** via a native Android `AppWidgetProvider` (overall % + up to 4 subjects, tap to open the app).
- The Android widget reads a small snapshot stored locally on the phone; it does not need the Netlify sync endpoint.
- Attendance date keys use the device's local calendar date.

## Easiest way to get the APK (no installs, free)
1. Make a free account at github.com and create a **new repository** (private is fine).
2. Click **Add file -> Upload files**, drag in everything from this folder, commit.
   - The `.github` folder is hidden on some phones/PCs. If it didn't upload: **Add file -> Create new file**,
     name it `.github/workflows/build-apk.yml`, and paste in the contents of that file.
3. Open the **Actions** tab -> "Build Android APK" runs automatically (~5-8 min).
   If it doesn't, click it -> **Run workflow**.
4. When it's green, open the run -> **Artifacts -> attendance-apk** -> download, unzip, copy `app-debug.apk` to your phone and install
   (allow "Install unknown apps" when asked).

## Moving your existing data
Old data lives inside the browser/PWA, not in the app. In the **old** app: Settings -> Export JSON.
In the **new** app: Settings -> Import data from file.

## Using it
- Reminders: Settings -> Reminders -> On (allow notifications when Android asks). The app schedules up to 14 future local-date reminders and skips today if attendance is already logged. The schedule is refreshed when the app opens, when reminder settings change, and when attendance is saved. Android/OEM battery management can still delay delivery; on OPPO, set app battery usage to **Allow background activity / Unrestricted** and allow auto-launch if that option is present.
- Widget: long-press the home screen -> Widgets -> Attendance. It refreshes after attendance/settings changes and when the app returns to the foreground. Android launchers control their own refresh cadence.
- Widget: long-press home screen -> Widgets -> Attendance.

## Build status and limitations
This folder is a source project, not a prebuilt APK. The APK must be produced by a successful Android Gradle build. The GitHub Actions workflow builds a **debug APK** for personal installation; it is not Play Store-signed. Notifications are scheduled for the next 14 days when the app runs and are not a guarantee of exact-to-the-minute delivery. Reopen the app periodically so the rolling schedule is replenished after the initial window. A device reboot / force-stop can affect scheduled delivery depending on Android and OEM behavior.

## Building locally instead
Needs Node 20, JDK 17, Android SDK (including platform/build-tools):
```
pip install pillow && npm install
npx cap add android
python3 scripts/patch_android.py
npx cap sync android
cd android && ./gradlew assembleDebug
```
APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## Editing the app later
Edit `www/index.html`, push to GitHub, download the new APK. Keep the debug APK signing the same machine/workflow if you want updates
to install over the old one (debug keys differ between machines — if install says "conflict", uninstall first, after exporting your data).
