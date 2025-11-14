import {app, BrowserWindow, globalShortcut, Tray, ipcMain, nativeImage } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

if (started) {
  app.quit();
}
let mainWindow: BrowserWindow | null = null
let trayWindow: BrowserWindow | null = null;

const createWindow = () => {
  const iconPath = getAppIconPath();
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/main_window/index.html'));
  }

  // Bloquer la navigation non autorisée
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    // Autoriser uniquement les URLs de développement et file://
    if (parsedUrl.origin !== 'file://' && !navigationUrl.startsWith(MAIN_WINDOW_VITE_DEV_SERVER_URL || '')) {
      event.preventDefault();
      console.warn('Navigation bloquée vers:', navigationUrl);
    }
  });

  // Empêcher l'ouverture de nouvelles fenêtres
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // ✅ icône du Dock (macOS uniquement)
  if (process.platform === 'darwin') {
    app.dock.setIcon(iconPath);
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => (mainWindow = null))
};

app.whenReady().then(() => {
  createWindow()
  createTray()
  registerMediaShortcuts()
})


function createTray() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'youtube_music.png')
    : path.join(process.cwd(), 'public', 'youtube_music.png');
  const trayIcon = nativeImage.createFromPath(iconPath);

  const tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  tray.setToolTip('YouTube Music');
  tray.on('click', () => {
    if (trayWindow?.isVisible()) {
      trayWindow.hide();
    } else {
      createOrShowTrayWindow(tray);
    }
  });
}
function getAppIconPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'youtube_music.icns');
  } else {
    return path.join(process.cwd(), 'public', 'youtube_music.png');
  }
}
function createOrShowTrayWindow(tray: Tray) {
  if (!trayWindow) {
    trayWindow = new BrowserWindow({
      width: 200,
      height: 150,
      show: false,
      frame: false,
      resizable: false,
      alwaysOnTop: true,
      transparent: true,
      webPreferences: {
        preload: path.join(__dirname, 'tray-menu.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        webSecurity: true,
      },
    });

    const trayHtmlPath = app.isPackaged
      ? path.join(process.resourcesPath, 'tray-menu.html')
      : path.join(process.cwd(), 'public', 'tray-menu.html');
    trayWindow.loadFile(trayHtmlPath);

  }

  const trayBounds = tray.getBounds();
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - 100);
  const y = Math.round(trayBounds.y + trayBounds.height);

  trayWindow.setPosition(x, y, false);
  trayWindow.show();
  trayWindow.focus();

  trayWindow.on('blur', () => {
    trayWindow.hide();
  })
}

// --- Contrôles reçus depuis le menu tray ---
ipcMain.on('tray:play', () => {
  console.log('play')
  mainWindow?.webContents.send('toggle-playback')
});
ipcMain.on('tray:next', () => {
  mainWindow?.webContents.send('next-track')
});
ipcMain.on('tray:prev', () => {
  mainWindow?.webContents.send('prev-track')
});

ipcMain.on('tray:quit', () => {
  BrowserWindow.getAllWindows().forEach(win => {
    win.removeAllListeners('close');
    win.destroy();
  });

  app.quit();
});

function registerMediaShortcuts() {
  globalShortcut.register('MediaPlayPause', () => {
    console.log('ici')
    mainWindow?.webContents.send('toggle-playback')
  })
  globalShortcut.register('MediaNextTrack', () => {
    mainWindow?.webContents.send('next-track')
  })
  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow?.webContents.send('prev-track')
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
