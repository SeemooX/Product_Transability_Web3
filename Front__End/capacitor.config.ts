import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.TraceProduct.com',
  appName: 'TraceProduct',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
  },
};

export default config;