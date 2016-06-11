const path = require('path');
const electron = require('electron');
require(path.join(__dirname, 'main-process/socket.js'));

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const debug = /--debug/.test(process.argv[2]);

let mainWindow;

function initialize() {
  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 750,
    });

    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));

    if (debug) {
      mainWindow.webContents.openDevTools();
      mainWindow.maximize();
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
}

initialize();
