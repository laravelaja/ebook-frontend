import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aurabook.app',
  appName: 'Bimora',
  webDir: 'dist',
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
  },
  server: {
    androidScheme: 'https',
    allowNavigation: ['ebook-backend-theta.vercel.app', '*.supabase.co'],
  },
};

export default config;
