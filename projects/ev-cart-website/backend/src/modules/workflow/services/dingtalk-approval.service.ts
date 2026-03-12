import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApprovalFlowSetting } from '../entities/approval-flow-setting.entity';

/**
 * 钉钉审批服务
 */
@Injectable()
export class DingtalkApprovalService {
  private readonly logger = new Logger(DingtalkApprovalService.name);
  private accessToken: string = '';
  private tokenExpiresAt: Date = null;

  constructor(
    private httpService: HttpService,
  ) {}

  /**
   * 获取访问令牌
   */
  async getAccessToken(setting: ApprovalFlowSetting): Promise<string> {
    // 检查 token 是否过期
    if (this.accessToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const url = `https://oapi.dingtalk.com/gettoken?appkey=${setting.appId}&appsecret=${setting.appSecret}`;
      
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;

      if (data.errcode === 0) {
        this.accessToken = data.access_token;
        this.tokenExpiresAt = new Date(Date.now() + (data.expires_in - 60) * 1000);
        this.logger.log('钉钉 access_token 获取成功');
        return this.accessToken;
      } else {
        throw new Error(`钉钉 token 获取失败：${data.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`钉钉 token 获取失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 发起审批实例
   */
  async createApprovalInstance(
    setting: ApprovalFlowSetting,
    data: DingtalkApprovalData,
  ): Promise<string> {
    try {
      const accessToken = await this.getAccessToken(setting);
      const url = `https://oapi.dingtalk.com/topapi/processinstance/create?access_token=${accessToken}`;

      const payload = {
        process_code: data.processCode, // 审批码
        approver_userids: data.approverUserIds, // 审批人列表
        form_component_values: data.formComponents, // 表单组件值
        originator_user_id: data.originatorUserId, // 发起人 ID
        dept_id: data.deptId, // 部门 ID
      };

      const response = await this.httpService.axiosRef.post(url, payload);
      const result = response.data;

      if (result.errcode === 0) {
        this.logger.log(`钉钉审批实例创建成功：${result.process_instance_id}`);
        return result.process_instance_id;
      } else {
        throw new Error(`钉钉审批创建失败：${result.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`钉钉审批创建失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 获取审批实例状态
   */
  async getApprovalInstanceStatus(
    setting: ApprovalFlowSetting,
    processInstanceId: string,
  ): Promise<DingtalkApprovalStatus> {
    try {
      const accessToken = await this.getAccessToken(setting);
      const url = `https://oapi.dingtalk.com/topapi/processinstance/get?access_token=${accessToken}`;

      const response = await this.httpService.axiosRef.post(url, {
        process_instance_id: processInstanceId,
      });

      const result = response.data;

      if (result.errcode === 0) {
        return {
          status: result.process_instance.status, // FINISH/TERMINATED/PROCESSING
          result: result.process_instance.result, // agree/reject
          createTime: result.process_instance.create_time,
          finishTime: result.process_instance.finish_time,
          approvers: result.process_instance.operation_records,
        };
      } else {
        throw new Error(`钉钉审批状态查询失败：${result.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`钉钉审批状态查询失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 获取用户 ID
   */
  async getUserIdByUnionId(setting: ApprovalFlowSetting, unionId: string): Promise<string> {
    try {
      const accessToken = await this.getAccessToken(setting);
      const url = `https://oapi.dingtalk.com/user/get?access_token=${accessToken}&unionid=${unionId}`;

      const response = await this.httpService.axiosRef.get(url);
      const result = response.data;

      if (result.errcode === 0) {
        return result.userid;
      } else {
        throw new Error(`钉钉用户 ID 获取失败：${result.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`钉钉用户 ID 获取失败：${error.message}`);
      return null;
    }
  }

  /**
   * 发送审批通知
   */
  async sendApprovalNotification(
    setting: ApprovalFlowSetting,
    userId: string,
    data: NotificationData,
  ): Promise<void> {
    try {
      const accessToken = await this.getAccessToken(setting);
      const url = `https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=${accessToken}`;

      const payload = {
        userid_list: userId,
        agent_id: setting.agentId,
        msgtype: 'oa',
        oa: {
          message_url: data.messageUrl,
          head: {
            bgcolor: data.bgColor,
            text: data.headText,
          },
          body: {
            title: data.title,
            form: data.form,
            rich: {
              num: data.richNum,
              unit: data.richUnit,
            },
          },
        },
      };

      await this.httpService.axiosRef.post(url, payload);
      this.logger.log(`钉钉审批通知发送成功：${userId}`);
    } catch (error) {
      this.logger.error(`钉钉审批通知发送失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 同步钉钉审批状态到系统
   */
  async syncApprovalStatus(
    setting: ApprovalFlowSetting,
    processInstanceId: string,
    systemApprovalId: string,
  ): Promise<void> {
    try {
      const status = await this.getApprovalInstanceStatus(setting, processInstanceId);

      // TODO: 更新系统审批状态
      // await this.approvalService.updateApprovalStatus(systemApprovalId, {
      //   externalStatus: status.status,
      //   externalResult: status.result,
      //   externalFinishTime: status.finishTime,
      // });

      this.logger.log(`钉钉审批状态同步成功：${systemApprovalId}`);
    } catch (error) {
      this.logger.error(`钉钉审批状态同步失败：${error.message}`);
      throw error;
    }
  }
}

// ========== 类型定义 ==========

interface DingtalkApprovalData {
  processCode: string; // 审批码
  approverUserIds: string[]; // 审批人列表
  formComponents: Array<{
    name: string; // 组件名称
    value: string; // 组件值
  }>;
  originatorUserId: string; // 发起人 ID
  deptId?: number; // 部门 ID
}

interface DingtalkApprovalStatus {
  status: string; // FINISH/TERMINATED/PROCESSING
  result: string; // agree/reject
  createTime: string;
  finishTime: string;
  approvers: any[];
}

interface NotificationData {
  messageUrl: string;
  bgColor: string;
  headText: string;
  title: string;
  form: Array<{ key: string; value: string }>;
  richNum?: string;
  richUnit?: string;
}
