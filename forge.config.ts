import type { ForgeConfig } from '@electron-forge/shared-types';
import path from 'node:path';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { PublisherGithub } from '@electron-forge/publisher-github';

const packagedPathAllowlist = [
  '/.vite',
  '/node_modules/uiohook-napi',
  '/node_modules/node-gyp-build',
  '/node_modules/koffi',
];

const normalizePackagedPath = (filePath: string) => {
  const forwardSlashPath = filePath.replace(/\\/g, '/');

  if (forwardSlashPath.startsWith('/')) {
    return forwardSlashPath;
  }

  if (path.isAbsolute(filePath)) {
    return `/${path.relative(__dirname, filePath).replace(/\\/g, '/')}`;
  }

  return `/${forwardSlashPath}`;
};

const shouldIgnorePackagedPath = (filePath: string) => {
  const normalizedPath = normalizePackagedPath(filePath);

  if (normalizedPath === '/') {
    return false;
  }

  return !packagedPathAllowlist.some(
    (allowedPath) =>
      normalizedPath === allowedPath ||
      normalizedPath.startsWith(`${allowedPath}/`) ||
      allowedPath.startsWith(`${normalizedPath}/`),
  );
};

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: 'resources/icon',
    executableName: 'rakko-launcher',
    ignore: shouldIgnorePackagedPath,
    extraResource: [
      'resources/icon.png',
      'resources/tray-icon.png',
      'resources/tray-icon@2x.png',
    ],
    appCopyright: `Copyright © ${new Date().getFullYear()}`,
    win32metadata: {
      FileDescription: 'らっこらんちゃー',
      OriginalFilename: 'rakko-launcher.exe',
      ProductName: 'らっこらんちゃー',
    },
  },
  rebuildConfig: {
    // uiohook-napi はネイティブモジュールのため Electron 向けに再ビルド
    extraModules: ['uiohook-napi', 'koffi'],
  },
  makers: [
    new MakerSquirrel({
      name: 'rakko_launcher',
      setupIcon: 'resources/icon.ico',
      setupExe: 'RakkoLauncherSetup.exe',
    }),
    new MakerZIP({}),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'shiftplus-corp-homan-keisuke',
        name: 'electron-launcher',
      },
      prerelease: false,
      draft: true,
    }),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      build: [
        {
          entry: 'src/main/index.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/index.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
