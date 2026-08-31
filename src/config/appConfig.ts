/**
 * NeedHub Application Configuration
 * Fully portable across any hosting platform or custom domain.
 */
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch (e) {
    // Ignore in browser-only runtime
  }
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {
    // Ignore
  }
  return fallback;
};

const getOrigin = (): string => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return '';
};

export const APP_CONFIG = {
  appName: getEnvVar('VITE_APP_NAME', 'NeedHub'),
  tagline: getEnvVar('VITE_APP_TAGLINE', 'Fresh Groceries & Home Services Delivered'),
  appVersion: '1.0.0',
  versionCode: 1,
  packageId: 'com.needhub.app',
  productionUrl: getEnvVar('VITE_APP_URL', getOrigin()),
  apkDownloadUrl: getEnvVar('VITE_APK_DOWNLOAD_URL', '/NeedHub_v1.0.apk')
};

