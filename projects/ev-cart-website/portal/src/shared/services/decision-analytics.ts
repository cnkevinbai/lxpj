import api from './api'

/**
 * 决策分析报表服务
 */
export const decisionAnalyticsService = {
  // ==================== 决策统计 ====================
  
  /**
   * 获取决策统计
   */
  getDecisionStatistics: async (params?: {
    startDate?: string
    endDate?: string
    serviceType?: string
    engineerId?: string
  }) => {
    return api.get('/service/analytics/decisions', { params })
  },

  /**
   * 获取决策趋势
   */
  getDecisionTrend: async (params?: {
    startDate?: string
    endDate?: string
    granularity?: 'day' | 'week' | 'month'
  }) => {
    return api.get('/service/analytics/decisions/trend', { params })
  },

  /**
   * 获取决策分布
   */
  getDecisionDistribution: async (params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/analytics/decisions/distribution', { params })
  },

  // ==================== 服务方式分析 ====================
  
  /**
   * 获取服务方式统计
   */
  getServiceTypeStatistics: async (params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/analytics/service-types', { params })
  },

  /**
   * 获取服务方式转化率
   */
  getServiceTypeConversion: async (params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/analytics/service-types/conversion', { params })
  },

  /**
   * 获取服务方式成本分析
   */
  getServiceTypeCostAnalysis: async (params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/analytics/service-types/cost', { params })
  },

  // ==================== 规则效果分析 ====================
  
  /**
   * 获取规则效果统计
   */
  getRuleEffectiveness: async (params?: {
    startDate?: string
    endDate?: string
    ruleId?: string
  }) => {
    return api.get('/service/analytics/rules', { params })
  },

  /**
   * 获取规则命中率
   */
  getRuleHitRate: async (params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/analytics/rules/hit-rate', { params })
  },

  /**
   * 获取规则成功率
   */
  getRuleSuccessRate: async (params?: {
    startDate?: string
    endDate?: string
    ruleId?: string
  }) => {
    return api.get('/service/analytics/rules/success-rate', { params })
  },

  // ==================== 工程师绩效分析 ====================
  
  /**
   * 获取工程师绩效统计
   */
  getEngineerPerformance: async (params?: {
    startDate?: string
    endDate?: string
    engineerId?: string
  }) => {
    return api.get('/service/analytics/engineers', { params })
  },

  /**
   * 获取工程师服务方式偏好
   */
  getEngineerServiceTypePreference: async (params?: {
    engineerId?: string
  }) => {
    return api.get('/service/analytics/engineers/preference', { params })
  },

  /**
   * 获取工程师效率排名
   */
  getEngineerEfficiencyRanking: async (params?: {
    startDate?: string
    endDate?: string
    limit?: number
  }) => {
    return api.get('/service/analytics/engineers/ranking', { params })
  },

  // ==================== 客户分析 ====================
  
  /**
   * 获取客户分布统计
   */
  getCustomerDistribution: async (params?: {
    startDate?: string
    endDate?: string
    region?: string
  }) => {
    return api.get('/service/analytics/customers', { params })
  },

  /**
   * 获取客户满意度分析
   */
  getCustomerSatisfaction: async (params?: {
    startDate?: string
    endDate?: string
    serviceType?: string
  }) => {
    return api.get('/service/analytics/customers/satisfaction', { params })
  },

  /**
   * 获取客户偏好分析
   */
  getCustomerPreference: async (params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/analytics/customers/preference', { params })
  },

  // ==================== 成本效益分析 ====================
  
  /**
   * 获取成本效益统计
   */
  getCostBenefitAnalysis: async (params?: {
    startDate?: string
    endDate?: string
    serviceType?: string
  }) => {
    return api.get('/service/analytics/cost-benefit', { params })
  },

  /**
   * 获取 ROI 分析
   */
  getROIAnalysis: async (params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/analytics/roi', { params })
  },

  /**
   * 获取成本节约分析
   */
  getCostSavingAnalysis: async (params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/analytics/cost-saving', { params })
  },

  // ==================== 导出报表 ====================
  
  /**
   * 导出决策分析报表
   */
  exportDecisionReport: async (params?: {
    startDate?: string
    endDate?: string
    format?: 'pdf' | 'excel' | 'csv'
  }) => {
    return api.post('/service/analytics/export/decisions', params, {
      responseType: 'blob',
    })
  },

  /**
   * 导出工程师绩效报表
   */
  exportEngineerReport: async (params?: {
    startDate?: string
    endDate?: string
    format?: 'pdf' | 'excel' | 'csv'
  }) => {
    return api.post('/service/analytics/export/engineers', params, {
      responseType: 'blob',
    })
  },

  /**
   * 导出成本效益报表
   */
  exportCostReport: async (params?: {
    startDate?: string
    endDate?: string
    format?: 'pdf' | 'excel' | 'csv'
  }) => {
    return api.post('/service/analytics/export/cost', params, {
      responseType: 'blob',
    })
  },
}

/**
 * 决策分析数据类型
 */
export interface DecisionStatistics {
  // 总体统计
  totalDecisions: number
  byServiceType: {
    onsite: number
    mail: number
    remote: number
  }
  
  // 决策质量
  avgConfidence: number
  highConfidenceRate: number  // 置信度>80% 的比例
  
  // 解决情况
  resolutionRate: number
  byServiceTypeResolution: {
    onsite: number
    mail: number
    remote: number
  }
  
  // 客户满意度
  avgSatisfaction: number
  byServiceTypeSatisfaction: {
    onsite: number
    mail: number
    remote: number
  }
  
  // 成本分析
  totalCost: number
  avgCostPerTicket: number
  byServiceTypeCost: {
    onsite: number
    mail: number
    remote: number
  }
  
  // 成本节约
  estimatedSaving: number
  savingRate: number
}

/**
 * 决策趋势数据
 */
export interface DecisionTrend {
  date: string
  totalDecisions: number
  byServiceType: {
    onsite: number
    mail: number
    remote: number
  }
  resolutionRate: number
  avgSatisfaction: number
  avgCost: number
}

/**
 * 规则效果数据
 */
export interface RuleEffectiveness {
  ruleId: string
  ruleName: string
  usageCount: number
  hitRate: number
  successRate: number
  avgConfidence: number
  avgSatisfaction: number
  costSaving: number
}

/**
 * 工程师绩效数据
 */
export interface EngineerPerformance {
  engineerId: string
  engineerName: string
  totalTickets: number
  byServiceType: {
    onsite: number
    mail: number
    remote: number
  }
  resolutionRate: number
  avgSatisfaction: number
  avgResponseTime: number
  avgCompletionTime: number
  totalRevenue: number
  costSaving: number
}

export default decisionAnalyticsService
