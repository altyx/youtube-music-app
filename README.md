Youtube music desktop application player

/!\ This is ***not*** affiliated to Youtube, Youtube Music is a trademark of Google Inc.

/!\ This project is still under development.

## Fonctionnalités

✅ **Touches multimédia du clavier** : Play/Pause, Next, Previous  
✅ **Raccourcis clavier** : Cmd+Shift+Space, Cmd+Shift+←/→  
✅ **System Tray** : Contrôles rapides depuis la barre de menu  
✅ **Intégration macOS** : Métadonnées et pochette dans le centre de contrôle

## Contrôles

### 🎹 Touches multimédia (clavier)

Les touches **Play/Pause**, **Next** et **Previous** de votre clavier fonctionnent automatiquement grâce à l'API Media Session intégrée.

> **Note** : Les touches multimédia doivent être détectées automatiquement sur macOS. Si elles ne fonctionnent pas, c'est probablement qu'une autre application (Spotify, Apple Music, etc.) les capture en priorité.

### ⌨️ Raccourcis clavier

- **⌘ + Shift + Space** : Play/Pause
- **⌘ + Shift + →** : Piste suivante
- **⌘ + Shift + ←** : Piste précédente

### 🎵 System Tray

Cliquez sur l'icône YouTube Music dans la barre de menu pour accéder aux contrôles rapides (Play/Pause, Next, Previous, Ouvrir l'app, Quitter).

## Installation

```bash
npm install
npm start
```

## Package

```bash
npm run package
```

## Comment ça marche ?

L'application injecte l'API **Media Session** directement dans la webview YouTube Music, ce qui permet :

1. ✅ De capturer les touches multimédia du clavier
2. ✅ D'afficher les métadonnées (titre, artiste, pochette) dans le centre de contrôle macOS
3. ✅ De synchroniser l'état de lecture (play/pause)

Cela fonctionne **nativement** sans bibliothèque externe, uniquement avec les API web standards.

