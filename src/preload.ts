// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  onTogglePlayback: (callback: () => void) => {
    ipcRenderer.removeAllListeners('toggle-playback')
    ipcRenderer.on('toggle-playback', () => callback())
  },
  onNextTrack: (callback: () => void) => {
    ipcRenderer.removeAllListeners('next-track')
    ipcRenderer.on('next-track', () => callback())
  },
  onPrevTrack: (callback: () => void) => {
    ipcRenderer.removeAllListeners('prev-track')
    ipcRenderer.on('prev-track', () => callback())
  }
})

