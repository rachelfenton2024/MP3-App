const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchSongs: (playlistURL) => ipcRenderer.invoke('fetch-songs', playlistURL),
  searchYouTube: (query) => ipcRenderer.invoke('search-youtube', query),
  downloadSongs: (urls) => ipcRenderer.invoke('download-songs', urls),
});
