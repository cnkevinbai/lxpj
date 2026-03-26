import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface DecisionResult {
  serviceType: 'ONSITE' | 'MAIL' | 'REMOTE';
  confidence: number;
  reasons: string[];
  matchedRules: any[];
  alternativeTypes: Array<{
    serviceType: string;
    confidence: number;
    reasons: string[];
  }>;
}

@Injectable()
export class DecisionService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 推荐服务方式
   */
  async recommendServiceType(ticketData: {
    type: string;
    technicalDifficulty?: string;
    problemDescription?: string;
    needParts?: boolean;
    customerDistance?: number;
    customerTechnicalSkill?: string;
    productModel?: string;
  }): Promise<DecisionResult> {
    const scores = {
      ONSITE: 0,
      MAIL: 0,
      REMOTE: 0,
    };
    const reasons: string[] = [];
    const matchedRules: any[] = [];

    // 规则 1: 大型设备安装 → 现场
    if (
      ticketData.type === 'INSTALLATION' &&
      ticketData.productModel?.includes('大型')
    ) {
      scores.ONSITE += 100;
      reasons.push('大型设备需要现场安装');
      matchedRules.push({ id: 'rule_001', name: '大型设备安装' });
    }

    // 规则 2: 安全隐患 → 现场
    if (
      ticketData.problemDescription &&
      /漏电 | 短路 | 起火 | 爆炸 | 危险/.test(ticketData.problemDescription)
    ) {
      scores.ONSITE += 100;
      reasons.push('存在安全隐患，必须现场处理');
      matchedRules.push({ id: 'rule_002', name: '安全隐患' });
    }

    // 规则 3: 专家级难度 → 现场
    if (ticketData.technicalDifficulty === 'EXPERT') {
      scores.ONSITE += 90;
      reasons.push('专家级难度需要现场处理');
      matchedRules.push({ id: 'rule_003', name: '专家级难度' });
    }

    // 规则 4: 小配件更换 → 寄件
    if (
      ticketData.type === 'REPAIR' &&
      ticketData.needParts &&
      ticketData.problemDescription?.includes('小配件')
    ) {
      scores.MAIL += 85;
      reasons.push('小配件更换适合寄件');
      matchedRules.push({ id: 'rule_004', name: '小配件更换' });
    }

    // 规则 5: 客户技术能力强 → 寄件/远程
    if (ticketData.customerTechnicalSkill === 'high') {
      scores.MAIL += 30;
      scores.REMOTE += 30;
      reasons.push('客户技术能力强，可自行操作');
    }

    // 规则 6: 距离过远 → 寄件
    if (ticketData.customerDistance && ticketData.customerDistance > 500) {
      scores.MAIL += 40;
      reasons.push('距离过远，建议寄件');
    }

    // 规则 7: 软件配置问题 → 远程
    if (
      ticketData.type === 'CONSULTATION' ||
      /配置 | 设置 | 软件 | 系统/.test(ticketData.problemDescription || '')
    ) {
      scores.REMOTE += 90;
      reasons.push('软件配置问题适合远程指导');
      matchedRules.push({ id: 'rule_005', name: '软件配置问题' });
    }

    // 规则 8: 简单故障 → 远程
    if (
      ticketData.technicalDifficulty === 'SIMPLE' ||
      ticketData.technicalDifficulty === 'NORMAL'
    ) {
      scores.REMOTE += 20;
      reasons.push('简单故障可远程指导');
    }

    // 找出最高分
    const maxScore = Math.max(scores.ONSITE, scores.MAIL, scores.REMOTE);
    let serviceType: 'ONSITE' | 'MAIL' | 'REMOTE' = 'ONSITE';

    if (maxScore === scores.MAIL) {
      serviceType = 'MAIL';
    } else if (maxScore === scores.REMOTE) {
      serviceType = 'REMOTE';
    }

    // 计算置信度
    const totalScore = scores.ONSITE + scores.MAIL + scores.REMOTE;
    const confidence = totalScore > 0 ? Math.round((maxScore / totalScore) * 100) : 50;

    // 生成备选方案
    const alternativeTypes: Array<{
      serviceType: string;
      confidence: number;
      reasons: string[];
    }> = [];

    if (scores.ONSITE > 0 && serviceType !== 'ONSITE') {
      alternativeTypes.push({
        serviceType: 'ONSITE',
        confidence: Math.round((scores.ONSITE / totalScore) * 100),
        reasons: reasons.filter((r) => r.includes('现场')),
      });
    }

    if (scores.MAIL > 0 && serviceType !== 'MAIL') {
      alternativeTypes.push({
        serviceType: 'MAIL',
        confidence: Math.round((scores.MAIL / totalScore) * 100),
        reasons: reasons.filter((r) => r.includes('寄件')),
      });
    }

    if (scores.REMOTE > 0 && serviceType !== 'REMOTE') {
      alternativeTypes.push({
        serviceType: 'REMOTE',
        confidence: Math.round((scores.REMOTE / totalScore) * 100),
        reasons: reasons.filter((r) => r.includes('远程')),
      });
    }

    return {
      serviceType,
      confidence,
      reasons: [...new Set(reasons)],
      matchedRules,
      alternativeTypes,
    };
  }

  /**
   * 获取决策统计
   */
  async getStatistics(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    // TODO: 实现统计分析
    return {
      totalDecisions: 0,
      byServiceType: {
        ONSITE: 0,
        MAIL: 0,
        REMOTE: 0,
      },
      avgConfidence: 0,
      resolutionRate: 0,
    };
  }
}
