// Preload script pour le menu tray
import { contextBridge, ipcRenderer } from 'electron';

// Exposer une API sécurisée pour le tray menu

contextBridge.exposeInMainWorld('electronAPI', {
  play: () => ipcRenderer.send('tray:play'),
  next: () => ipcRenderer.send('tray:next'),
  prev: () => ipcRenderer.send('tray:prev'),
  quit: () => ipcRenderer.send('tray:quit'),
});

// Empêcher l'accès direct à ipcRenderer et autres APIs dangereuses
delete (window as any).require;
delete (window as any).exports;

