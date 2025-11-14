import {app, BrowserWindow, globalShortcut, Tray, ipcMain, nativeImage } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

if (started) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let trayWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

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

  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'file://' && !navigationUrl.startsWith(MAIN_WINDOW_VITE_DEV_SERVER_URL || '')) {
      event.preventDefault();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  if (process.platform === 'darwin') {
    try {
      app.dock.setIcon(iconPath);
    } catch (err) {
      console.warn('Could not set dock icon:', err);
    }
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => (mainWindow = null));
};

app.whenReady().then(() => {
  createWindow();
  createTray();
  registerMediaShortcuts();
});

function createTray() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'youtube.jpg')
    : path.join(process.cwd(), 'public', 'youtube.jpg');

  const trayIcon = nativeImage.createFromPath(iconPath);

  if (trayIcon.isEmpty()) {
    console.error('❌ Tray icon is empty! Path:', iconPath);
    console.error('Make sure youtube_music.png is in the resources folder');
    return;
  }

  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  tray.setToolTip('YouTube Music');

  tray.on('click', () => {
    if (trayWindow?.isVisible()) {
      trayWindow.hide();
    } else {
      if (tray) createOrShowTrayWindow(tray);
    }
  });
}

function getAppIconPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'youtube.icns');
  } else {
    return path.join(process.cwd(), 'public', 'youtube.jpg');
  }
}

function createOrShowTrayWindow(tray: Tray) {
  if (!trayWindow) {
    trayWindow = new BrowserWindow({
      width: 280,
      height: 120,
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

    trayWindow.webContents.setWindowOpenHandler(() => {
      return { action: 'deny' };
    });
    trayWindow.webContents.openDevTools()
  }

  const trayBounds = tray.getBounds();
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - 100);
  const y = Math.round(trayBounds.y + trayBounds.height);

  trayWindow.setPosition(x, y, false);
  trayWindow.show();
  trayWindow.focus();

  trayWindow.on('blur', () => {
    trayWindow.hide();
  });
}

ipcMain.on('tray:play', () => {
  mainWindow?.webContents.send('toggle-playback');
});

ipcMain.on('tray:open-app', () => {
  mainWindow?.show();
})

ipcMain.on('tray:next', () => {
  mainWindow?.webContents.send('next-track');
});

ipcMain.on('tray:prev', () => {
  mainWindow?.webContents.send('prev-track');
});

ipcMain.on('tray:quit', () => {
  for (const win of BrowserWindow.getAllWindows()) {
    win.removeAllListeners('close');
    win.destroy();
  }
  app.quit();
});

function registerMediaShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    mainWindow?.webContents.send('toggle-playback');
  });

  globalShortcut.register('CommandOrControl+Shift+Right', () => {
    mainWindow?.webContents.send('next-track');
  });

  globalShortcut.register('CommandOrControl+Shift+Left', () => {
    mainWindow?.webContents.send('prev-track');
  });
}

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

