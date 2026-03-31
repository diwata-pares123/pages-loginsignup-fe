import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type RuntimeEnvironment = 'development' | 'staging' | 'production';

export type AppConfig = {
  appName: string;
  environment: RuntimeEnvironment;
  apiBaseUrl: string;
};

type AppConfigExtra = Partial<AppConfig>;

const allowedEnvironments = new Set<RuntimeEnvironment>(['development', 'staging', 'production']);

export function resolveEnvironment(value: string | undefined): RuntimeEnvironment {
  if (value && allowedEnvironments.has(value as RuntimeEnvironment)) {
    return value as RuntimeEnvironment;
  }
  return 'development';
}

// Automatically switch localhost based on the simulator being used for local testing
const getLocalApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000'; // Android Emulator alias for localhost
  }
  return 'http://localhost:3000'; // iOS Simulator
};

export function getAppConfig(): AppConfig {
  const extra = Constants.expoConfig?.extra as AppConfigExtra | undefined;
  const appName = extra?.appName ?? process.env.EXPO_PUBLIC_APP_NAME ?? 'Template Repo Mobile Single';
  const environment = resolveEnvironment(extra?.environment ?? process.env.EXPO_PUBLIC_APP_ENV);
  
  // Default to local NestJS server if no env variable is set
  const apiBaseUrl = extra?.apiBaseUrl ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? getLocalApiUrl();

  return {
    appName,
    environment,
    apiBaseUrl,
  };
}