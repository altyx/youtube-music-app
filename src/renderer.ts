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

window.addEventListener('DOMContentLoaded', () => {
  const webview = document.getElementById('ytm') as Electron.WebviewTag;

  if (!webview) return console.error('Webview not found');

  // S'assure que la webview est chargée
  webview.addEventListener('did-finish-load', () => {
    console.log('Webview loaded, ready to bind controls.');

    // Play / Pause
    window.electronAPI?.onTogglePlayback(() => {
      console.log('Toggle playback clicked');
      webview.executeJavaScript(`
        document.querySelector('ytmusic-player-bar #play-pause-button')?.click();
      `);
    });

    // Next
    window.electronAPI?.onNextTrack(() => {
      webview.executeJavaScript(`
        document.querySelector('ytmusic-player-bar .next-button')?.click();
      `);
    });

    // Previous
    window.electronAPI?.onPrevTrack(() => {
      webview.executeJavaScript(`
        document.querySelector('ytmusic-player-bar .previous-button')?.click();
      `);
    });
  });
});
