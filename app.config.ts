import type { ExpoConfig } from 'expo/config';

// Teil A läuft als Webapp; die Einstellungen für native Builds (Projekt-ID, runtimeVersion)
// werden erst in Teil B gebraucht. Die Projekt-ID von expo.dev kommt dann aus der Umgebung.
const projectId = process.env.EAS_PROJECT_ID;

const config: ExpoConfig = {
  name: 'Kleiderschrank',
  slug: 'kleiderschrank',
  scheme: 'kleiderschrank',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
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
  web: { output: 'single', favicon: './assets/favicon.png', name: 'Kleiderschrank' },
  plugins: ['expo-router'],
  ...(projectId
    ? {
        updates: { url: `https://u.expo.dev/${projectId}` },
        extra: { eas: { projectId } },
      }
    : {}),
};

export default config;
