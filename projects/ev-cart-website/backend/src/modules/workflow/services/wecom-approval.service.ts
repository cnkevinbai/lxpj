import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

/**
 * 企业微信审批服务
 */
@Injectable()
export class WecomApprovalService {
  private readonly logger = new Logger(WecomApprovalService.name);
  private accessToken: string = '';
  private tokenExpiresAt: Date = null;

  constructor(
    private httpService: HttpService,
  ) {}

  /**
   * 获取访问令牌
   */
  async getAccessToken(corpId: string, corpSecret: string): Promise<string> {
    // 检查 token 是否过期
    if (this.accessToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${corpSecret}`;
      
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;

      if (data.errcode === 0) {
        this.accessToken = data.access_token;
        this.tokenExpiresAt = new Date(Date.now() + (data.expires_in - 60) * 1000);
        this.logger.log('企业微信 access_token 获取成功');
        return this.accessToken;
      } else {
        throw new Error(`企业微信 token 获取失败：${data.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`企业微信 token 获取失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 发起审批申请
   */
  async createApproval(
    accessToken: string,
    data: WecomApprovalData,
  ): Promise<string> {
    try {
      const url = `https://qyapi.weixin.qq.com/cgi-bin/oa/applyevent?access_token=${accessToken}`;

      const payload = {
        creator_userid: data.creatorUserId, // 申请人
        template_id: data.templateId, // 模板 ID
        use_template_approver: data.useTemplateApprover, // 使用模板审批人
        approver: data.approver, // 审批人信息
        notifier: data.notifier, // 抄送人
        apply_data: {
          contents: data.applyData.contents, // 表单内容
        },
      };

      const response = await this.httpService.axiosRef.post(url, payload);
      const result = response.data;

      if (result.errcode === 0) {
        this.logger.log(`企业微信审批创建成功：${result.sp_no}`);
        return result.sp_no; // 审批单号
      } else {
        throw new Error(`企业微信审批创建失败：${result.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`企业微信审批创建失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 获取审批申请状态
   */
  async getApprovalStatus(
    accessToken: string,
    spNo: string,
  ): Promise<WecomApprovalStatus> {
    try {
      const url = `https://qyapi.weixin.qq.com/cgi-bin/oa/getapprovaldetail?access_token=${accessToken}`;

      const response = await this.httpService.axiosRef.post(url, {
        sp_no: spNo,
      });

      const result = response.data;

      if (result.errcode === 0) {
        const info = result.info;
        return {
          status: info.status, // 1-审批中 2-已同意 3-已驳回 4-已转审
          applyTime: info.apply_time,
          applyer: info.applyer,
          approvers: info.approvers,
          notifier: info.notifier,
        };
      } else {
        throw new Error(`企业微信审批状态查询失败：${result.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`企业微信审批状态查询失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 获取审批模板详情
   */
  async getTemplateDetail(
    accessToken: string,
    templateId: string,
  ): Promise<any> {
    try {
      const url = `https://qyapi.weixin.qq.com/cgi-bin/oa/gettemplate详情?access_token=${accessToken}`;

      const response = await this.httpService.axiosRef.post(url, {
        template_id: templateId,
      });

      const result = response.data;

      if (result.errcode === 0) {
        return result.template_config;
      } else {
        throw new Error(`企业微信模板详情查询失败：${result.errmsg}`);
      }
    } catch (error) {
      this.logger.error(`企业微信模板详情查询失败：${error.message}`);
      throw error;
    }
  }

  /**
   * 发送审批通知
   */
  async sendApprovalNotification(
    accessToken: string,
    userId: string,
    data: WecomNotificationData,
  ): Promise<void> {
    try {
      const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`;

      const payload = {
        touser: userId,
        msgtype: 'templatecard',
        agentid: data.agentId,
        templatecard: {
          title: data.title,
          description: data.description,
          btn: {
            txt: data.btnText,
            action_url: data.actionUrl,
          },
        },
      };

      await this.httpService.axiosRef.post(url, payload);
      this.logger.log(`企业微信审批通知发送成功：${userId}`);
    } catch (error) {
      this.logger.error(`企业微信审批通知发送失败：${error.message}`);
      throw error;
    }
  }
}

// ========== 类型定义 ==========

interface WecomApprovalData {
  creatorUserId: string; // 申请人
  templateId: string; // 模板 ID
  useTemplateApprover: number; // 1-使用模板 2-自定义
  approver: {
    attr: number;
    userid: string[];
  };
  notifier: string[]; // 抄送人
  applyData: {
    contents: Array<{
      control: string; // 控件类型
      id: string;
      value: string[];
    }>;
  };
}

interface WecomApprovalStatus {
  status: number; // 1-审批中 2-已同意 3-已驳回 4-已转审
  applyTime: number;
  applyer: { userid: string; party: number[] };
  approvers: Array<{
    attr: number;
    userid: string;
    party: number[];
    speech: string;
    status: number;
    updatetime: number;
  }>;
  notifier: string[];
}

interface WecomNotificationData {
  agentId: number;
  title: string;
  description: string;
  btnText: string;
  actionUrl: string;
}
