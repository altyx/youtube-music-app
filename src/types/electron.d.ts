export interface ElectronAPI {
  onTogglePlayback: (callback: () => void) => void;
  onNextTrack: (callback: () => void) => void;
  onPrevTrack: (callback: () => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
