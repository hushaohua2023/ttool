const { app, BrowserWindow, ipcMain, session, dialog, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1066,
        height: 600,
        frame: false, // 无边框窗口
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL('https://www.datocan.com/test.html'); 

    // 处理文件下载
    session.defaultSession.on('will-download', (event, item, webContents) => {
        const filePath = path.join(app.getPath('downloads'), item.getFilename());
        console.log(`Downloading file to: ${filePath}`);
        item.setSavePath(filePath);

        item.on('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully');

                // 弹出提示框，通知用户下载完成
                dialog.showMessageBox({
                    type: 'info',
                    title: '下载完成',
                    message: `文件已成功下载到: ${filePath}`,
                    buttons: ['打开', '确认']
                }).then(result => {
                    if (result.response === 0) { // 如果用户点击了“打开”
                        shell.openPath(filePath); // 打开下载的文件
                    }
                });

            } else {
                console.log(`Download failed: ${state}`);
                dialog.showErrorBox('下载失败', `文件下载失败: ${state}`);
            }
        });
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

ipcMain.on('download-file', (event, downloadUrl) => {
    console.log('Received download-file event for URL:', downloadUrl);
    if (mainWindow) {
        mainWindow.webContents.downloadURL(downloadUrl);
    }
});

ipcMain.on('app-close', () => {
    if (mainWindow) {
        mainWindow.close(); // 关闭窗口
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});







