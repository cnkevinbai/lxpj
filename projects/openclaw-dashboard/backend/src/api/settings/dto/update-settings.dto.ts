export class UpdateSettingsDto {
  theme?: 'light' | 'dark' | 'system';
  language?: 'zh' | 'en';
  notifications?: {
    enabled?: boolean;
    sound?: boolean;
    email?: boolean;
  };
  apiKeys?: {
    openai?: string;
    anthropic?: string;
  };
}
