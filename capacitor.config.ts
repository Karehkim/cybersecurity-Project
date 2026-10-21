import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.passwordstrengthchecker',
  appName: 'Password Strength Checker',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
