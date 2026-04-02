const { app } = require('electron');
app.whenReady().then(async () => {
  console.log('APP NAME:', app.getName());
  console.log('USER DATA:', app.getPath('userData'));
  const fs = require('fs');
  const path = require('path');
  const itemsPath = path.join(app.getPath('userData'), 'items.json');
  console.log('ITEMS PATH:', itemsPath);
  console.log('EXISTS:', fs.existsSync(itemsPath));
  if (fs.existsSync(itemsPath)) {
    console.log('CONTENT:', fs.readFileSync(itemsPath, 'utf8'));
  }
  app.quit();
});
