import { Tray, Menu, nativeImage } from 'electron';
import fs from 'fs';
import { resolveResourcePath } from './resource-paths';

export class TrayManager {
  private tray: Tray | null = null;

  constructor(
    private readonly showLauncherFn: () => void,
    private readonly toggleLauncherFn: () => void,
    private readonly openManagementFn: () => void,
    private readonly quitFn: () => void,
    private readonly toggleAutoLaunchFn: () => void,
  ) {}

  init(): boolean {
    const iconPath = resolveResourcePath('tray-icon.png');
    const icon = fs.existsSync(iconPath)
      ? nativeImage.createFromPath(iconPath)
      : nativeImage.createEmpty();

    try {
      this.tray = new Tray(icon);
    } catch {
      this.tray = null;
      return false;
    }

    this.tray.setToolTip('らっこらんちゃー');

    // シングルクリックでランチャー表示
    this.tray.on('click', () => {
      this.toggleLauncherFn();
    });

    return true;
  }

  buildContextMenu(launchAtStartup: boolean): void {
    if (!this.tray) return;

    const menu = Menu.buildFromTemplate([
      {
        label: 'ランチャーを開く',
        click: () => this.showLauncherFn(),
      },
      {
        label: 'アイテム管理',
        click: () => this.openManagementFn(),
      },
      { type: 'separator' },
      {
        label: 'スタートアップに登録',
        type: 'checkbox',
        checked: launchAtStartup,
        click: () => this.toggleAutoLaunchFn(),
      },
      { type: 'separator' },
      {
        label: '終了',
        click: () => this.quitFn(),
      },
    ]);

    this.tray.setContextMenu(menu);
  }

  updateAutoLaunchMenuItem(enabled: boolean): void {
    this.buildContextMenu(enabled);
  }

  destroy(): void {
    this.tray?.destroy();
    this.tray = null;
  }
}
