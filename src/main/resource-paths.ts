import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export function getResourcesBasePath(): string {
  return app.isPackaged
    ? process.resourcesPath
    : path.join(__dirname, '../../resources');
}

export function resolveResourcePath(...segments: string[]): string {
  return path.join(getResourcesBasePath(), ...segments);
}

export function resolveExistingResourcePath(
  segments: string[],
  fallbackSegments: string[] = ['icon.png'],
): string | undefined {
  const resourcePath = resolveResourcePath(...segments);
  if (fs.existsSync(resourcePath)) {
    return resourcePath;
  }

  const fallbackPath = resolveResourcePath(...fallbackSegments);
  return fs.existsSync(fallbackPath) ? fallbackPath : undefined;
}
