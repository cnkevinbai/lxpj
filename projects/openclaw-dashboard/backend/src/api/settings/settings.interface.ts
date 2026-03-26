export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum Language {
  ZH = 'zh',
  EN = 'en',
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  email: boolean;
}

export interface ApiKeySettings {
  openai?: string;
  anthropic?: string;
}

export interface Settings {
  theme: Theme;
  language: Language;
  notifications: NotificationSettings;
  apiKeys: ApiKeySettings;
  lastModified: Date;
}
