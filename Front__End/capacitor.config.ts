import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.TraceProduct.com',
  appName: 'TraceProduct',
  webDir: 'dist',

  // Just for testing, we will make it http. Later will be taken off
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
};

export default config;