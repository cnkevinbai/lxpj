import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/update-settings.dto';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  notifications: {
    enabled: boolean;
    sound: boolean;
    email: boolean;
  };
  apiKeys: {
    openai?: string;
    anthropic?: string;
  };
  lastModified: Date;
}

@Injectable()
export class SettingsService {
  private settings: Settings;

  constructor() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings = {
      theme: 'system',
      language: 'zh',
      notifications: {
        enabled: true,
        sound: true,
        email: false,
      },
      apiKeys: {},
      lastModified: new Date(),
    };
  }

  async getAll(): Promise<Settings> {
    return this.settings;
  }

  async update(updateDto: UpdateSettingsDto): Promise<Settings> {
    const updatedSettings: Settings = {
      ...this.settings,
      ...updateDto,
      notifications: {
        ...this.settings.notifications,
        ...(updateDto.notifications || {}),
      },
      apiKeys: {
        ...this.settings.apiKeys,
        ...(updateDto.apiKeys || {}),
      },
      lastModified: new Date(),
    };

    this.settings = updatedSettings;
    return this.settings;
  }

  async reset(): Promise<Settings> {
    this.initializeSettings();
    return this.settings;
  }
}
