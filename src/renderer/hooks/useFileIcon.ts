import { useState, useEffect } from 'react';
import { getElectronAPI } from '@/lib/ipc';

// ─── モジュールレベルキャッシュ (再マウントしても維持) ────────────
const iconCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();

/**
 * ファイルパスから OS のアイコンを非同期取得するフック。
 * 結果はモジュールレベルでキャッシュされ、同じパスの重複リクエストも抑制される。
 */
export function useFileIcon(filePath: string | undefined): string | null {
  const cached = filePath ? iconCache.get(filePath) ?? null : null;
  const [icon, setIcon] = useState<string | null>(cached);

  useEffect(() => {
    if (!filePath) return;

    const hit = iconCache.get(filePath);
    if (hit) {
      setIcon(hit);
      return;
    }

    let cancelled = false;

    const load = async () => {
      // 同じパスへの同時リクエストを共有
      let promise = pendingRequests.get(filePath);
      if (!promise) {
        promise = getElectronAPI()?.getFileIcon(filePath) ?? Promise.resolve(null);
        pendingRequests.set(filePath, promise);
      }

      const result = await promise;
      pendingRequests.delete(filePath);

      if (result) {
        iconCache.set(filePath, result);
      }
      if (!cancelled) {
        setIcon(result);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [filePath]);

  return icon;
}
