import type { ExpoConfig } from 'expo/config';

// Die Projekt-ID von expo.dev kommt aus der Umgebung (GitHub-Variable EAS_PROJECT_ID).
const projectId = process.env.EAS_PROJECT_ID;

const config: ExpoConfig = {
  name: 'Kleiderschrank',
  slug: 'kleiderschrank',
  scheme: 'kleiderschrank',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  // Expo Go lädt Updates mit der Laufzeit-Regel "appVersion" (ab SDK 49).
  runtimeVersion: { policy: 'appVersion' },
  ios: { supportsTablet: false },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
  },
  web: { favicon: './assets/favicon.png' },
  plugins: ['expo-router'],
  ...(projectId
    ? {
        updates: { url: `https://u.expo.dev/${projectId}` },
        extra: { eas: { projectId } },
      }
    : {}),
};

export default config;
