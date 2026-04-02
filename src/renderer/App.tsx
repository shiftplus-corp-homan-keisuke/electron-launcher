import { useEffect, useState } from 'react';
import { getElectronAPI } from './lib/ipc';
import LauncherView from './components/LauncherView';
import ManagementView from './components/ManagementView';

export default function App() {
  const [view, setView] = useState<'launcher' | 'management'>('launcher');

  useEffect(() => {
    // URL ハッシュでどちらのビューか判断
    const hash = window.location.hash.replace('#', '');
    if (hash === 'management') {
      setView('management');
    } else {
      setView('launcher');
    }
  }, []);

  useEffect(() => {
    const api = getElectronAPI();
    if (!api) return;

    // テーマ変更対応
    const unsubscribe = api.onThemeChanged((theme) => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    });

    // 初期テーマ設定
    void api.getNativeTheme().then((theme) => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    });

    return unsubscribe;
  }, []);

  if (view === 'management') {
    return <ManagementView />;
  }

  return <LauncherView />;
}
