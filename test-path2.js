const { app } = require('electron');
// forge start 時に productName を設定する
app.setName('kurimanjuu-launcher');
app.whenReady().then(() => {
  console.log('name:', app.getName());
  console.log('userData:', app.getPath('userData'));
  app.quit();
});
