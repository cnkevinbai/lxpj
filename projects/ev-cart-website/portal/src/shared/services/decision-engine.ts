import type { ServiceTicket, ServiceType, TechnicalDifficulty } from '../types/service-ticket'

/**
 * 智能决策辅助引擎
 */
export const decisionEngine = {
  // ==================== 决策规则 ====================
  
  /**
   * 必须现场服务的情况
   */
  mustOnsiteRules: [
    '大型设备安装',
    '需要专用工具',
    '客户无法自行操作',
    '安全隐患',
    '系统调试',
    '复杂故障排查',
  ],

  /**
   * 可以寄件的情况
   */
  canMailRules: [
    '小配件更换',
    '客户有操作能力',
    '问题简单明确',
    '距离过远 (>500km)',
    '客户偏好寄件',
  ],

  /**
   * 可以远程指导的情况
   */
  canRemoteRules: [
    '软件问题',
    '配置问题',
    '操作指导',
    '简单故障排查',
    '客户技术能力强',
  ],

  // ==================== 智能推荐 ====================
  
  /**
   * 推荐服务方式
   */
  recommendServiceType(ticket: Partial<ServiceTicket>): {
    serviceType: ServiceType
    confidence: number
    reasons: string[]
  } {
    let scores = {
      onsite: 0,
      mail: 0,
      remote: 0,
    }
    const reasons: string[] = []

    // 1. 根据工单类型评分
    const typeScore = this.scoreByType(ticket.type)
    scores.onsite += typeScore.onsite
    scores.mail += typeScore.mail
    scores.remote += typeScore.remote
    reasons.push(...typeScore.reasons)

    // 2. 根据技术难度评分
    if (ticket.technicalDifficulty) {
      const difficultyScore = this.scoreByDifficulty(ticket.technicalDifficulty)
      scores.onsite += difficultyScore.onsite
      scores.mail += difficultyScore.mail
      scores.remote += difficultyScore.remote
      reasons.push(...difficultyScore.reasons)
    }

    // 3. 根据距离评分
    if (ticket.customerAddress) {
      const distanceScore = this.scoreByDistance(ticket.customerAddress)
      scores.onsite += distanceScore.onsite
      scores.mail += distanceScore.mail
      scores.remote += distanceScore.remote
      reasons.push(...distanceScore.reasons)
    }

    // 4. 根据客户能力评分
    if (ticket.customerTechnicalSkill) {
      const skillScore = this.scoreByCustomerSkill(ticket.customerTechnicalSkill)
      scores.mail += skillScore.mail
      scores.remote += skillScore.remote
      reasons.push(...skillScore.reasons)
    }

    // 5. 根据产品保修状态评分
    if (ticket.warrantyStatus) {
      scores.onsite += 10 // 保修期内优先现场服务
      reasons.push('产品在保修期内')
    }

    // 6. 根据优先级评分
    if (ticket.priority === 'urgent') {
      scores.onsite += 20 // 紧急工单优先现场
      reasons.push('紧急工单')
    }

    // 7. 检查必须现场规则
    const mustOnsite = this.checkMustOnsiteRules(ticket)
    if (mustOnsite.matched) {
      scores.onsite += 100 // 强制现场
      reasons.push(...mustOnsite.reasons)
    }

    // 找出最高分
    const maxScore = Math.max(scores.onsite, scores.mail, scores.remote)
    let serviceType: ServiceType = 'onsite'
    
    if (maxScore === scores.mail) {
      serviceType = 'mail'
    } else if (maxScore === scores.remote) {
      serviceType = 'remote'
    }

    // 计算置信度
    const totalScore = scores.onsite + scores.mail + scores.remote
    const confidence = totalScore > 0 ? (maxScore / totalScore) * 100 : 50

    return {
      serviceType,
      confidence: Math.round(confidence),
      reasons,
    }
  },

  /**
   * 根据工单类型评分
   */
  scoreByType(type?: string) {
    const scores = { onsite: 0, mail: 0, remote: 0 }
    const reasons: string[] = []

    switch (type) {
      case 'installation':
        scores.onsite += 40
        reasons.push('安装服务通常需要现场')
        break
      case 'maintenance':
        scores.onsite += 30
        scores.remote += 20
        reasons.push('维护服务可现场或远程')
        break
      case 'repair':
        scores.onsite += 20
        scores.mail += 30
        reasons.push('维修服务可现场或寄件')
        break
      case 'consultation':
        scores.remote += 40
        reasons.push('咨询服务适合远程')
        break
      case 'complaint':
        scores.onsite += 20
        scores.remote += 20
        reasons.push('投诉需根据情况处理')
        break
    }

    return { ...scores, reasons }
  },

  /**
   * 根据技术难度评分
   */
  scoreByDifficulty(difficulty: TechnicalDifficulty) {
    const scores = { onsite: 0, mail: 0, remote: 0 }
    const reasons: string[] = []

    switch (difficulty) {
      case 'simple':
        scores.remote += 30
        scores.mail += 20
        reasons.push('简单问题可远程解决')
        break
      case 'normal':
        scores.onsite += 20
        scores.mail += 20
        reasons.push('普通问题可现场或寄件')
        break
      case 'complex':
        scores.onsite += 40
        reasons.push('复杂问题需要现场')
        break
      case 'expert':
        scores.onsite += 50
        reasons.push('专家级问题必须现场')
        break
    }

    return { ...scores, reasons }
  },

  /**
   * 根据距离评分
   */
  scoreByDistance(address: string) {
    // TODO: 实际实现需要计算距离
    const scores = { onsite: 0, mail: 0, remote: 0 }
    const reasons: string[] = []

    // 模拟距离计算
    const distance = 100 // km

    if (distance < 50) {
      scores.onsite += 30
      reasons.push('距离近，适合现场')
    } else if (distance < 200) {
      scores.onsite += 20
      scores.mail += 10
      reasons.push('中等距离')
    } else if (distance < 500) {
      scores.mail += 30
      reasons.push('距离较远，建议寄件')
    } else {
      scores.mail += 40
      scores.remote += 20
      reasons.push('距离很远，优先寄件或远程')
    }

    return { ...scores, reasons }
  },

  /**
   * 根据客户技术能力评分
   */
  scoreByCustomerSkill(skill: 'high' | 'medium' | 'low') {
    const scores = { mail: 0, remote: 0 }
    const reasons: string[] = []

    switch (skill) {
      case 'high':
        scores.mail += 30
        scores.remote += 30
        reasons.push('客户技术能力强，可自行操作')
        break
      case 'medium':
        scores.mail += 10
        scores.remote += 20
        reasons.push('客户有一定技术能力')
        break
      case 'low':
        reasons.push('客户技术能力弱，需要现场')
        break
    }

    return { ...scores, reasons }
  },

  /**
   * 检查必须现场规则
   */
  checkMustOnsiteRules(ticket: Partial<ServiceTicket>) {
    const matched = false
    const reasons: string[] = []

    // 检查问题描述
    if (ticket.problemDescription) {
      for (const rule of this.mustOnsiteRules) {
        if (ticket.problemDescription.includes(rule)) {
          reasons.push(`匹配规则：${rule}`)
        }
      }
    }

    // 检查产品类型
    if (ticket.productModel && ticket.productModel.includes('大型')) {
      reasons.push('大型设备需要现场服务')
    }

    return {
      matched: reasons.length > 0,
      reasons,
    }
  },

  // ==================== 工程师匹配 ====================
  
  /**
   * 匹配最佳工程师
   */
  matchEngineer(ticket: ServiceTicket, engineers: any[]) {
    return engineers
      .map(engineer => ({
        ...engineer,
        score: this.calculateEngineerScore(engineer, ticket),
      }))
      .sort((a, b) => b.score - a.score)
  },

  /**
   * 计算工程师评分
   */
  calculateEngineerScore(engineer: any, ticket: ServiceTicket): number {
    let score = 0

    // 1. 技能匹配（40 分）
    if (engineer.skills && ticket.type) {
      if (engineer.skills.includes(ticket.type)) {
        score += 40
      }
    }

    // 2. 距离远近（30 分）
    if (engineer.location && ticket.customerAddress) {
      const distance = this.calculateDistance(engineer.location, ticket.customerAddress)
      score += Math.max(0, 30 - distance * 3)
    }

    // 3. 工作量（20 分）
    if (engineer.currentTickets !== undefined) {
      score += Math.max(0, 20 - engineer.currentTickets * 5)
    }

    // 4. 客户评分（10 分）
    if (engineer.rating) {
      score += engineer.rating * 2
    }

    // 5. 可用时间（加分）
    if (engineer.available && ticket.scheduledTime) {
      score += 10
    }

    return score
  },

  /**
   * 计算距离（简化版）
   */
  calculateDistance(loc1: any, loc2: any): number {
    // TODO: 实际实现需要使用地图 API
    return 0
  },
}

export default decisionEngine
