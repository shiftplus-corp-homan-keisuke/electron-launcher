const { app } = require('electron');
// forge start 時に productName を設定する
app.setName('rakko-launcher');
app.whenReady().then(() => {
  console.log('name:', app.getName());
  console.log('userData:', app.getPath('userData'));
  app.quit();
});
