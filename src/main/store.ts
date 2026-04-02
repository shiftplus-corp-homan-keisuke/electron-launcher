import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { LauncherItem, AppSettings } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/constants';

function getStorePath(filename: string): string {
  return path.join(app.getPath('userData'), filename);
}

// ─────────────────────────────────────────────────────────────
// アイテムストア
// ─────────────────────────────────────────────────────────────
export class ItemStore {
  private readonly filePath: string;
  private items: LauncherItem[] = [];

  constructor() {
    this.filePath = getStorePath('items.json');
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.items = JSON.parse(raw) as LauncherItem[];
      }
    } catch {
      this.items = [];
    }
  }

  private save(): void {
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.items, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save items:', err);
    }
  }

  getAll(): LauncherItem[] {
    return [...this.items];
  }

  add(item: Omit<LauncherItem, 'id' | 'createdAt'>): LauncherItem {
    const newItem: LauncherItem = {
      ...item,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    this.items.push(newItem);
    this.save();
    return newItem;
  }

  update(item: LauncherItem): boolean {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index === -1) return false;
    this.items[index] = item;
    this.save();
    return true;
  }

  delete(id: string): boolean {
    const before = this.items.length;
    this.items = this.items.filter((i) => i.id !== id);
    if (this.items.length < before) {
      this.save();
      return true;
    }
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 設定ストア
// ─────────────────────────────────────────────────────────────
export class SettingsStore {
  private readonly filePath: string;
  private settings: AppSettings;

  constructor() {
    this.filePath = getStorePath('settings.json');
    this.settings = { ...DEFAULT_SETTINGS };
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.settings = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  private save(): void {
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.settings, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  }

  get(): AppSettings {
    return { ...this.settings };
  }

  set(settings: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...settings };
    this.save();
    return this.get();
  }
}

export const itemStore = new ItemStore();
export const settingsStore = new SettingsStore();
