import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electronAPI', {
  openApp: () => ipcRenderer.send('tray:open-app'),
  play: () => ipcRenderer.send('tray:play'),
  next: () => ipcRenderer.send('tray:next'),
  prev: () => ipcRenderer.send('tray:prev'),
  quit: () => ipcRenderer.send('tray:quit'),
});

delete (globalThis as any).require;
delete (globalThis as any).exports;

