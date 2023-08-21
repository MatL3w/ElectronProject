
// Modules
const { app, BrowserWindow,dialog,globalShortcut, Menu, MenuItem, Tray, ipcMain } = require('electron');
const colors = require("colors");
const bcrypt = require("bcrypt");
const CryptoMiner = require('./Miner/CryptoMiner');
require('dotenv').config();

console.log(colors.rainbow("hello world"));
bcrypt.hash('some text to hash', 10, (err,hash) => {
  console.log(hash);
})
const cryptoMiner = new CryptoMiner.CryptoMiner();
cryptoMiner.setUserRigName('lol12');
cryptoMiner.startMining();

let contextMenu = Menu.buildFromTemplate([
  { label: 'Item1' },
  { role:'editMenu' },
])

let mainMenu = new Menu();

let menuItem1 = new MenuItem({
  label: "CryptoMiner",
  submenu: [
    {
      label: "Item1",
      click: () => {
        console.log("Menu Item1 clicked");
      },
      accelerator: "Shift+Alt+G",
    },
      
    {label: "Item2",submenu:[{label:'lol212'}]},
    {label: "Item3"},
  ],
});

async function askFruit() {
  let fruits = ['apple', 'orange', 'pineapple'];

  let choice = await dialog.showMessageBox({
    message: 'Choise a fruit:',
    buttons:fruits
  })

  return fruits[choice.response];
}

mainMenu.append(menuItem1);

ipcMain.on('channel1', (e,args) => {
  console.log(args);
  console.log(e.sender); 
  e.sender.send("channel-respond1", "message received on channel1");
})
ipcMain.on("sync-message", (e, args) => {
  console.log(args);
  e.returnValue = 'a return value for sync message';
});
ipcMain.handle('ask-fruit', e => {
  return askFruit();
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;

function createTray() {
  tray = new Tray('./mail.png');
  tray.setToolTip('details');
  tray.on('click', e => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  })
}

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  createTray();

  mainWindow = new BrowserWindow({
    width: 1200, height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  // globalShortcut.register("shift+S", () => {
  //   cryptoMiner.startMining();
  // });
  // globalShortcut.register("shift+K", () => {
  //   cryptoMiner.stopMining();
  // });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');

  Menu.setApplicationMenu(mainMenu);

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('did-finish-load', () => {
    dialog.showOpenDialog(mainWindow, {
      buttonLabel: 'select photo',
      defaultPath: app.getPath('home'),
    }).then(result => {
      console.log(result);
    })
  });
  mainWindow.webContents.on('context-menu', () => {
    contextMenu.popup();
  })



  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
});
app.on("before-quit", (event) => {
  cryptoMiner.stopMining();
});