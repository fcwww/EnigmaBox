import { app, BrowserWindow, Menu } from "electron";
import path from "node:path";

function resolveRendererUrl(): { devUrl?: string; indexFile: string } {
  const devUrl = process.env.VITE_DEV_SERVER_URL;
  const indexFile = path.join(app.getAppPath(), "dist", "index.html");
  return { devUrl, indexFile };
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: "#0b0f17",
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist-electron", "preload", "index.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Remove the default application menu (File/Edit/...) on Windows.
  // Also hide the in-window menu bar just in case.
  if (process.platform === "win32") {
    Menu.setApplicationMenu(null);
    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);
  }

  const { devUrl, indexFile } = resolveRendererUrl();
  if (devUrl) {
    void win.loadURL(devUrl);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    void win.loadFile(indexFile);
  }
}

app.whenReady().then(() => {
  createMainWindow();
});

app.on("window-all-closed", () => {
  // Windows / Linux: close all windows => quit.
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  // macOS UX: click dock icon => recreate a window.
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
