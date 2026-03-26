import { Controller, Get, Patch, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getAllSettings() {
    return this.settingsService.getAll();
  }

  @Patch()
  async updateSettings(@Body() updateDto: UpdateSettingsDto) {
    return this.settingsService.update(updateDto);
  }

  @Post('reset')
  async resetSettings() {
    return this.settingsService.reset();
  }
}
