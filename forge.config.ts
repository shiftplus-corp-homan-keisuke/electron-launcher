import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { PublisherGithub } from '@electron-forge/publisher-github';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: 'resources/icon',
    executableName: 'kurimanjuu-launcher',
    extraResource: [
      'resources/icon.png',
      'resources/tray-icon.png',
      'resources/tray-icon@2x.png',
    ],
    appCopyright: `Copyright © ${new Date().getFullYear()}`,
    win32metadata: {
      FileDescription: 'くりまんじゅうらんちゃー',
      OriginalFilename: 'kurimanjuu-launcher.exe',
      ProductName: 'くりまんじゅうらんちゃー',
    },
  },
  rebuildConfig: {
    // uiohook-napi はネイティブモジュールのため Electron 向けに再ビルド
    extraModules: ['uiohook-napi', 'koffi'],
  },
  makers: [
    new MakerSquirrel({
      name: 'kurimanjuu_launcher',
      setupIcon: 'resources/icon.ico',
      setupExe: 'KurimanjiuLauncherSetup.exe',
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
