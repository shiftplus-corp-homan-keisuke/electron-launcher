import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      // electron と native モジュールはバンドルせず実行時に require する
      external: ['electron', 'uiohook-napi'],
      output: {
        entryFileNames: 'main.js',
      },
    },
  },
});
