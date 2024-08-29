https://convertico.com/


set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
.npmrc 文件添加内容
electron_mirror=https://npmmirror.com/mirrors/electron/

生成运行壳
npm install --save-dev electron

打包
npm install --save-dev electron-builder

更新
npm install electron-updater --save


生成exe文件
npm run dist  