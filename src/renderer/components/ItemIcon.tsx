import { useState } from 'react';
import { FolderOpen, Monitor, Globe, FileText } from 'lucide-react';
import type { ItemType } from '@shared/types';
import { useFileIcon } from '@/hooks/useFileIcon';
import { cn } from '@/lib/utils';

function getFaviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return '';
  }
}

interface ItemIconProps {
  type: ItemType;
  path: string;
  className?: string;
}

// ─────────────────────────────────────────────────────────────
// フォルダアイコン
// ─────────────────────────────────────────────────────────────
function FolderIcon({ className }: { className?: string }) {
  return (
    <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30', className)}>
      <FolderOpen className="size-4 text-blue-600 dark:text-blue-400" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// アプリアイコン (実アイコンを取得、取得中/失敗時はフォールバック)
// ─────────────────────────────────────────────────────────────
function AppIcon({ path, className }: { path: string; className?: string }) {
  const icon = useFileIcon(path);

  if (icon) {
    return (
      <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/50', className)}>
        <img src={icon} alt="" className="size-5 object-contain" draggable={false} />
      </div>
    );
  }

  return (
    <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30', className)}>
      <Monitor className="size-4 text-green-600 dark:text-green-400" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// URLアイコン (ファビコンを表示)
// ─────────────────────────────────────────────────────────────
function UrlIcon({ path, className }: { path: string; className?: string }) {
  const [faviconError, setFaviconError] = useState(false);
  const faviconUrl = getFaviconUrl(path);

  if (faviconUrl && !faviconError) {
    return (
      <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-md bg-gray-50 dark:bg-gray-800 border border-border/50', className)}>
        <img
          src={faviconUrl}
          alt=""
          className="size-5 object-contain"
          draggable={false}
          onError={() => setFaviconError(true)}
        />
      </div>
    );
  }

  // フォールバック
  return (
    <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30', className)}>
      <Globe className="size-4 text-orange-500 dark:text-orange-400" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// スニペットアイコン
// ─────────────────────────────────────────────────────────────
function SnippetIcon({ className }: { className?: string }) {
  return (
    <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30', className)}>
      <FileText className="size-4 text-purple-600 dark:text-purple-400" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 公開コンポーネント
// ─────────────────────────────────────────────────────────────
export function ItemIcon({ type, path, className }: ItemIconProps) {
  if (type === 'folder') return <FolderIcon className={className} />;
  if (type === 'app') return <AppIcon path={path} className={className} />;
  if (type === 'snippet') return <SnippetIcon className={className} />;
  return <UrlIcon path={path} className={className} />;
}

export function typeLabel(type: ItemType): string {
  const labels: Record<ItemType, string> = {
    folder: 'フォルダ',
    app: 'アプリ',
    url: 'URL',
    snippet: 'スニペット',
  };
  return labels[type] ?? type;
}
