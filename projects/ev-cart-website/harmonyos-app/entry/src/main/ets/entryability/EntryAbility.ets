/**
 * 入口 Ability
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { Storage } from '@kit.ArkTS';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'DaodaApp', '%{public}s', 'Ability onCreate');
    
    // 初始化全局存储
    Storage.startSync();
  }

  onDestroy(): void {
    hilog.info(0x0000, 'DaodaApp', '%{public}s', 'Ability onDestroy');
  }

  async onWindowStageCreate(windowStage: window.WindowStage): Promise<void> {
    hilog.info(0x0000, 'DaodaApp', '%{public}s', 'Ability onWindowStageCreate');

    // 加载主页面
    windowStage.loadContent('pages/Index', (err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'DaodaApp', 'Failed to load content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      
      hilog.info(0x0000, 'DaodaApp', 'Succeeded in loading content. Data: %{public}s', JSON.stringify(data) ?? '');
    });
  }

  async onWindowStageDestroy(): Promise<void> {
    hilog.info(0x0000, 'DaodaApp', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground(): void {
    hilog.info(0x0000, 'DaodaApp', '%{public}s', 'Ability onForeground');
  }

  onBackground(): void {
    hilog.info(0x0000, 'DaodaApp', '%{public}s', 'Ability onBackground');
  }
}
