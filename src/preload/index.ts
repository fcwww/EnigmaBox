import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("enigmabox", {
  platform: process.platform,
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  ai: {
    getSettings: () => ipcRenderer.invoke("ai:get-settings"),
    saveSettings: (input: unknown) => ipcRenderer.invoke("ai:save-settings", input)
  },
  wordSearch: {
    searchNutrimatic: (query: string) => ipcRenderer.invoke("word-search:nutrimatic", query),
    analyzeCandidates: (input: unknown) => ipcRenderer.invoke("word-search:analyze", input)
  }
});

