// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log("hello from  view");
const { ipcRenderer } = require('electron');
const { remote } = require('electron');
const { dialog } = remote;

document.getElementById('button1').addEventListener('click', (e) => {
    ipcRenderer.send('channel1', 'hello from main window');
    let response = ipcRenderer.sendSync('sync-message', 'sync hello');
    console.log(response);
})

ipcRenderer.on('channel-respond1',(e, args) => {
    console.log(args);
})

setTimeout(() => {
    dialog.showMessageBox({
        message: 'dialogfrom renderer',
        buttons:['one','two']
    }).then(res => {
        console.log(res);
    })
},2000)