# Attendance
Test
A local-first attendance tracker for students, packaged as a PWA and an Android app with
[Capacitor](https://capacitorjs.com/). It answers one question well: **how many classes can I
skip, or how many do I need to attend, to stay above my target?**

Everything is stored on-device. There is no account, server, tracking, or analytics.

## Features

- Per-subject attendance with a configurable target percentage.
- "Can skip / must attend" math shown front and center.
- Swipe a subject card left to mark present, right to mark absent; buttons work too.
- Backfill past dates and edit/remove individual marks.
- Stats: trend graph, 84-day heatmap, weekly recap with a shareable image, day log, reordering.
- Reminders via Android Local Notifications (or Web Notifications in the browser).
- Native Android home-screen widget (overall % + up to 4 subjects).
- Export/import JSON, CSV, PDF, and Excel. On Android these are written to app storage and
  opened through the system share sheet; on the web they download normally.
- Light/dark themes with multiple UI styles and accent colors.

## Install the Android APK

1. Open the **Actions** tab and wait for the **Build Android APK** workflow.
2. Open the latest green run and download the **attendance-apk** artifact.
3. Unzip it and copy `app-debug.apk` to your phone, then install it (allow "Install unknown
   apps" when asked).

The workflow runs automatically on every push. You can also trigger it manually with
**Run workflow**.

### App updates and signing

The APK is signed with the debug keystore committed at `keystore/debug.keystore` (alias
`androiddebugkey`, password `android`). This makes every CI build use the **same** signing key,
so new debug APKs install over old ones. It is a debug key for personal use only - replace it
with your own private release keystore before publishing anywhere.

If you lose local data: the app stores data in the WebView's local storage. Export a JSON
backup before uninstalling. Uninstalling always deletes app data.

## Build locally

Requirements: Node 20+, JDK 17, Android SDK with a platform and build-tools, and Python 3
with Pillow.

```bash
npm ci                    # installs deps + vendors jsPDF/SheetJS into www/vendor
npx cap add android
python3 scripts/patch_android.py
npx cap sync android
cd android && ./gradlew assembleDebug
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

To preview the web app, serve the `www/` directory with any static server. It is a single-page
app with no build step.

## Data and privacy

- Attendance data lives in `localStorage` inside the app/WebView and never leaves the device.
- The app does not contact any backend and sends no analytics. The only optional network
  request is the Google Fonts stylesheet; offline it falls back to system fonts. All export
  libraries (jsPDF, SheetJS) are bundled locally, not loaded from a CDN.
- Backups are user-initiated files. Treat an exported JSON backup as personal data.

## Known limitations

- The APK is a debug build, not Play Store-signed or Play Store-ready.
- Reminder delivery depends on Android/OEM battery management. On aggressive OEMs (for
  example OPPO/Realme), set battery usage to **Unrestricted** and allow auto-launch.
- Reminders are scheduled for a rolling 14-day window when the app runs. Reopen the app
  periodically to replenish the window. A force-stop or reboot can affect pending deliveries.
- The launcher controls widget refresh cadence; the widget also refreshes when the app writes data.
- The UI is one large `www/index.html` file. It works, but it is the main thing to refactor if
  you want to contribute substantially.

## Project layout

```
www/                  single-page web app (HTML/CSS/JS) + icons
  vendor/             generated at install time (jsPDF, SheetJS) - not committed
overlay/              native Android sources/resources copied into the Capacitor project
scripts/patch_android.py   injects widget, permissions, and icons after `cap add android`
scripts/vendor_libs.js      copies offline JS libs into www/vendor
keystore/debug.keystore     stable debug signing key (personal use only)
.github/workflows/    CI that builds the debug APK
```

## Contributing

Issues and pull requests are welcome. Keep changes focused, test on a real Android device when
touching the native widget or notifications, and export a backup before testing import/export.

## License

MIT - see [LICENSE](LICENSE).
