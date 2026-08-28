import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.TraceProduct.com', // Android application indentifier, Whenever somebody opens traceproduct://wallet, launch my application
  appName: 'TraceProduct',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
  },
};

export default config;