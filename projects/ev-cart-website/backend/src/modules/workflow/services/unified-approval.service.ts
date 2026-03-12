import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalFlowInstance } from '../entities/approval-flow-instance.entity';
import { ApprovalFlowSetting } from '../entities/approval-flow-setting.entity';
import { DingtalkApprovalService } from './dingtalk-approval.service';
import { WecomApprovalService } from './wecom-approval.service';

/**
 * 统一审批服务
 * 支持内部审批 + 第三方审批（钉钉/企业微信）
 */
@Injectable()
export class UnifiedApprovalService {
  private readonly logger = new Logger(UnifiedApprovalService.name);

  constructor(
    @InjectRepository(ApprovalFlowSetting)
    private settingRepository: Repository<ApprovalFlowSetting>,
    @InjectRepository(ApprovalFlowInstance)
    private instanceRepository: Repository<ApprovalFlowInstance>,
    private dingtalkService: DingtalkApprovalService,
    private wecomService: WecomApprovalService,
  ) {}

  /**
   * 发起审批（自动选择审批平台）
   */
  async startApproval(data: StartApprovalData): Promise<ApprovalFlowInstance> {
    this.logger.log(`发起审批：${data.businessType}, 平台：${data.platformType || 'auto'}`);

    // 1. 创建系统审批实例
    const instance = await this.createInternalApproval(data);

    // 2. 根据配置同步到第三方平台
    if (data.platformType === 'auto') {
      // 自动选择审批平台
      const setting = await this.getDefaultSetting(data.businessType);
      if (setting) {
        await this.syncToExternalPlatform(instance, setting, data);
      }
    } else if (data.platformType !== 'internal') {
      // 指定审批平台
      const setting = await this.getSettingByType(data.platformType);
      if (setting) {
        await this.syncToExternalPlatform(instance, setting, data);
      }
    }

    return instance;
  }

  /**
   * 创建内部审批
   */
  private async createInternalApproval(data: StartApprovalData): Promise<ApprovalFlowInstance> {
    const instance = this.instanceRepository.create({
      instanceNo: this.generateInstanceNo(),
      flowId: data.flowId,
      businessType: data.businessType,
      businessId: data.businessId,
      businessData: data.businessData,
      status: 'approving',
      applicantId: data.applicantId,
      applicantComment: data.comment,
      submittedAt: new Date(),
    });

    await this.instanceRepository.save(instance);
    this.logger.log(`内部审批创建成功：${instance.instanceNo}`);

    return instance;
  }

  /**
   * 同步到第三方平台
   */
  private async syncToExternalPlatform(
    instance: ApprovalFlowInstance,
    setting: ApprovalFlowSetting,
    data: StartApprovalData,
  ): Promise<void> {
    try {
      let externalInstanceId: string = null;

      switch (setting.platformType) {
        case 'dingtalk':
          externalInstanceId = await this.syncToDingtalk(setting, instance, data);
          break;
        case 'wecom':
          externalInstanceId = await this.syncToWecom(setting, instance, data);
          break;
        case 'feishu':
          // TODO: 飞书审批
          break;
      }

      if (externalInstanceId) {
        // 保存外部审批实例 ID
        instance.externalInstanceId = externalInstanceId;
        instance.externalPlatform = setting.platformType;
        await this.instanceRepository.save(instance);

        this.logger.log(`审批同步到${setting.platformType}成功：${externalInstanceId}`);
      }
    } catch (error) {
      this.logger.error(`同步到第三方平台失败：${error.message}`);
      // 同步失败不影响内部审批
    }
  }

  /**
   * 同步到钉钉
   */
  private async syncToDingtalk(
    setting: ApprovalFlowSetting,
    instance: ApprovalFlowInstance,
    data: StartApprovalData,
  ): Promise<string> {
    // 转换审批数据为钉钉格式
    const dingtalkData = {
      processCode: setting.config?.processCode,
      approverUserIds: await this.getExternalUserIds(setting.platformType, data.approvers),
      formComponents: this.convertToFormComponents(instance.businessData),
      originatorUserId: await this.getExternalUserId(setting.platformType, data.applicantId),
    };

    return await this.dingtalkService.createApprovalInstance(setting, dingtalkData);
  }

  /**
   * 同步到企业微信
   */
  private async syncToWecom(
    setting: ApprovalFlowSetting,
    instance: ApprovalFlowInstance,
    data: StartApprovalData,
  ): Promise<string> {
    const accessToken = await this.wecomService.getAccessToken(
      setting.corpId,
      setting.appSecret,
    );

    const wecomData = {
      creatorUserId: await this.getExternalUserId(setting.platformType, data.applicantId),
      templateId: setting.config?.templateId,
      useTemplateApprover: 1,
      approver: { attr: 1, userid: await this.getExternalUserIds(setting.platformType, data.approvers) },
      notifier: [],
      applyData: {
        contents: this.convertToWecomContents(instance.businessData),
      },
    };

    return await this.wecomService.createApproval(accessToken, wecomData);
  }

  /**
   * 获取外部用户 ID
   */
  private async getExternalUserId(platform: string, systemUserId: string): Promise<string> {
    // TODO: 从用户映射表获取外部用户 ID
    // 这里简化处理，假设系统用户 ID 与外部用户 ID 有映射关系
    return systemUserId;
  }

  /**
   * 获取外部用户 ID 列表
   */
  private async getExternalUserIds(platform: string, systemUserIds: string[]): Promise<string[]> {
    const userIds = [];
    for (const userId of systemUserIds) {
      const externalId = await this.getExternalUserId(platform, userId);
      if (externalId) {
        userIds.push(externalId);
      }
    }
    return userIds;
  }

  /**
   * 转换表单组件为钉钉格式
   */
  private convertToFormComponents(businessData: any): Array<{ name: string; value: string }> {
    return Object.entries(businessData).map(([key, value]) => ({
      name: key,
      value: String(value),
    }));
  }

  /**
   * 转换表单内容为企业微信格式
   */
  private convertToWecomContents(businessData: any): Array<{
    control: string;
    id: string;
    value: string[];
  }> {
    return Object.entries(businessData).map(([key, value]) => ({
      control: 'Text',
      id: key,
      value: [String(value)],
    }));
  }

  /**
   * 获取默认审批设置
   */
  private async getDefaultSetting(businessType?: string): Promise<ApprovalFlowSetting> {
    const queryBuilder = this.settingRepository.createQueryBuilder('setting');
    queryBuilder.where('setting.isDefault = :isDefault', { isDefault: true });
    queryBuilder.andWhere('setting.status = :status', { status: 'active' });

    if (businessType) {
      queryBuilder.andWhere(
        '(setting.applicableBusinessType IS NULL OR setting.applicableBusinessType = :businessType)',
        { businessType },
      );
    }

    return queryBuilder.getOne();
  }

  /**
   * 根据平台类型获取设置
   */
  private async getSettingByType(platformType: string): Promise<ApprovalFlowSetting> {
    return this.settingRepository.findOne({
      where: {
        platformType,
        status: 'active',
      },
    });
  }

  /**
   * 生成审批实例编号
   */
  private generateInstanceNo(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `AP${year}${month}${day}${random}`;
  }

  /**
   * 同步外部审批状态
   */
  async syncExternalApprovalStatus(instanceId: string): Promise<void> {
    const instance = await this.instanceRepository.findOne({ where: { id: instanceId } });
    if (!instance || !instance.externalInstanceId) {
      return;
    }

    const setting = await this.settingRepository.findOne({
      where: { platformType: instance.externalPlatform, status: 'active' },
    });

    if (!setting) {
      return;
    }

    try {
      let externalStatus: string = null;
      let externalResult: string = null;

      switch (instance.externalPlatform) {
        case 'dingtalk':
          const dingtalkStatus = await this.dingtalkService.getApprovalInstanceStatus(
            setting,
            instance.externalInstanceId,
          );
          externalStatus = dingtalkStatus.status;
          externalResult = dingtalkStatus.result;
          break;
        case 'wecom':
          const accessToken = await this.wecomService.getAccessToken(setting.corpId, setting.appSecret);
          const wecomStatus = await this.wecomService.getApprovalStatus(
            accessToken,
            instance.externalInstanceId,
          );
          externalStatus = String(wecomStatus.status);
          externalResult = wecomStatus.status === 2 ? 'agree' : 'reject';
          break;
      }

      // 更新系统审批状态
      if (externalStatus === 'FINISH' || externalStatus === '2') {
        instance.status = 'approved';
        instance.completedAt = new Date();
      } else if (externalStatus === 'TERMINATED' || externalStatus === '3') {
        instance.status = 'rejected';
        instance.completedAt = new Date();
      }

      instance.externalStatus = externalStatus;
      instance.externalResult = externalResult;
      await this.instanceRepository.save(instance);

      this.logger.log(`外部审批状态同步成功：${instanceId}`);
    } catch (error) {
      this.logger.error(`外部审批状态同步失败：${error.message}`);
      throw error;
    }
  }
}

// ========== 类型定义 ==========

interface StartApprovalData {
  flowId: string;
  businessType: string;
  businessId?: string;
  businessData: any;
  applicantId: string;
  comment?: string;
  platformType?: 'internal' | 'dingtalk' | 'wecom' | 'feishu' | 'auto';
  approvers?: string[];
}
