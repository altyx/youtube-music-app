Youtube music desktop application player

/!\ This is ***not*** affiliated with Youtube, Youtube Music is a trademark of Google Inc.

/!\ This project is still under development.

## Features

✅ **Media keyboard keys**: Play/Pause, Next, Previous  
✅ **Keyboard shortcuts**: Cmd+Shift+Space, Cmd+Shift+←/→  
✅ **System Tray**: Quick controls from the menu bar  
✅ **macOS Integration**: Metadata and artwork in the control center

## Controls

### 🎹 Media keys (keyboard)

The **Play/Pause**, **Next** and **Previous** keys on your keyboard work automatically thanks to the built-in Media Session API.

> **Note**: Media keys should be detected automatically on macOS. If they don't work, it's probably because another application (Spotify, Apple Music, etc.) is capturing them with priority.

### ⌨️ Keyboard shortcuts

- **⌘ + Shift + Space**: Play/Pause
- **⌘ + Shift + →**: Next track
- **⌘ + Shift + ←**: Previous track

### 🎵 System Tray

Click on the YouTube Music icon in the menu bar to access quick controls (Play/Pause, Next, Previous, Open app, Quit).

## Installation

```bash
npm install
npm start
```

## Package

```bash
npm run package
```

## How does it work?

The application injects the **Media Session** API directly into the YouTube Music webview, which allows:

1. ✅ Capturing media keyboard keys
2. ✅ Displaying metadata (title, artist, artwork) in the macOS control center
3. ✅ Synchronizing playback state (play/pause)

This works **natively** without external libraries, only using standard web APIs.

