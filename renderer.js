// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log("hello from  view");
const { ipcRenderer, shell } = require('electron');
const { remote,nativeImage,clipboard } = require('electron');
// const { dialog } = remote;

document.getElementById('button1').addEventListener('click', (e) => {
    ipcRenderer.send('channel1', 'hello from main window');
    let response = ipcRenderer.sendSync('sync-message', 'sync hello');
    console.log(response);
})

ipcRenderer.on('channel-respond1',(e, args) => {
    console.log(args);
})

// setTimeout(() => {
//     dialog.showMessageBox({
//         message: 'dialogfrom renderer',
//         buttons:['one','two']
//     }).then(res => {
//         console.log(res);
//     })
// }, 2000)

document.getElementById("button2").addEventListener("click", (e) => {
    ipcRenderer.invoke('ask-fruit').then(answer => {
        console.log(answer);
    });
});
    
document.getElementById("button3").addEventListener("click", (e) => {
    shell.openExternal('https://wp.pl');    
});

document.getElementById("button4").addEventListener("click", (e) => {
  shell.openPath(`${__dirname}/splash.png`);
});

document.getElementById("button5").addEventListener("click", (e) => {
    console.log(clipboard.readText());
});


const splash = nativeImage.createFromPath("./splash.png");
console.log(splash.getSize());

setInterval(() => {
    console.log(navigator.onLine);
}, 3000)

new Notification('Electron App', {
    body: "some notyfication"
})