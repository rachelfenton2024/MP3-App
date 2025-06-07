const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadFile('index.html');
}

// Helper to run python script with args and get output
function runPython(action, arg) {
  return new Promise((resolve, reject) => {
    const pythonPath = 'python'; // Change to full path if needed
    const scriptPath = path.join(__dirname, '..', 'main.py');

    // Make sure arg is string; if multiple args, adapt accordingly
    const args = [scriptPath, action];
    if (Array.isArray(arg)) {
      args.push(...arg);
    } else if (arg !== undefined) {
      args.push(arg);
    }

    const pyProc = spawn(pythonPath, args);

    let output = '';
    let errorOutput = '';

    pyProc.stdout.on('data', (data) => {
      output += data.toString();
    });

    pyProc.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pyProc.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Python exited with code ${code}. Error: ${errorOutput}`));
      }
    });
  });
}

// Setup IPC to listen for calls from renderer/preload and run python commands
ipcMain.handle('fetch-songs', async (event, playlistURL) => {
  const output = await runPython('fetch_songs', playlistURL);
  return JSON.parse(output);
});

ipcMain.handle('search-youtube', async (event, query) => {
  const output = await runPython('search_youtube', query);
  return JSON.parse(output);
});


ipcMain.handle('download-songs', async (event, urls) => {
  const output = await runPython('download_songs', urls);
  return JSON.parse(output);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  //if (process.platform !== 'darwin') 
  app.quit();
});
