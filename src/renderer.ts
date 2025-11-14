/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */


import './index.css';

let webview: Electron.WebviewTag | null = null;

window.electronAPI.onTogglePlayback(() => {
  if (webview) {
    webview.executeJavaScript(`
      document.querySelector('ytmusic-player-bar #play-pause-button')?.click();
    `).catch(err => console.error('Erreur toggle playback:', err));
  } else {
    console.warn('⚠️ Webview pas encore disponible');
  }
});

window.electronAPI.onNextTrack(() => {
  if (webview) {
    webview.executeJavaScript(`
      document.querySelector('ytmusic-player-bar .next-button')?.click();
    `).catch(err => console.error('Erreur next track:', err));
  } else {
    console.warn('⚠️ Webview pas encore disponible');
  }
});

window.electronAPI.onPrevTrack(() => {
  if (webview) {
    webview.executeJavaScript(`
      document.querySelector('ytmusic-player-bar .previous-button')?.click();
    `).catch(err => console.error('Erreur prev track:', err));
  } else {
    console.warn('⚠️ Webview pas encore disponible');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  webview = document.getElementById('ytm') as Electron.WebviewTag;

  if (!webview) {
    console.error('❌ Webview not found');
    return;
  }
});
