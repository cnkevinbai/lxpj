import api from './api'
import type { RemoteSupport, RemoteMessage, PhoneCall, RemoteCompletionReport, RemoteSupportStatistics } from '../types/remote-support'

/**
 * 远程指导服务
 */
export const remoteSupportService = {
  // ==================== 远程指导会话 ====================
  
  /**
   * 创建远程指导会话
   */
  createSupport: async (ticketId: string) => {
    return api.post('/service/remote/support', { ticketId })
  },

  /**
   * 获取远程指导会话详情
   */
  getSupportById: async (supportId: string) => {
    return api.get(`/service/remote/support/${supportId}`)
  },

  /**
   * 获取工单的远程指导会话
   */
  getSupportByTicketId: async (ticketId: string) => {
    return api.get(`/service/tickets/${ticketId}/remote/support`)
  },

  /**
   * 获取远程指导列表
   */
  getSupportList: async (params?: {
    page?: number
    pageSize?: number
    status?: string
    engineerId?: string
    startDate?: string
    endDate?: string
  }) => {
    return api.get('/service/remote/support', { params })
  },

  /**
   * 开始远程指导
   */
  startSupport: async (supportId: string) => {
    return api.post(`/service/remote/support/${supportId}/start`)
  },

  /**
   * 取消远程指导
   */
  cancelSupport: async (supportId: string, reason: string) => {
    return api.post(`/service/remote/support/${supportId}/cancel`, { reason })
  },

  // ==================== 电话指导 ====================
  
  /**
   * 创建通话记录
   */
  createPhoneCall: async (data: {
    ticketId: string
    supportId?: string
    customerPhone: string
    startTime: string
    endTime?: string
    notes: string
  }) => {
    return api.post('/service/remote/calls', data)
  },

  /**
   * 更新通话记录
   */
  updatePhoneCall: async (callId: string, data: {
    endTime?: string
    notes?: string
    recordingUrl?: string
  }) => {
    return api.put(`/service/remote/calls/${callId}`, data)
  },

  /**
   * 获取通话记录列表
   */
  getPhoneCalls: async (ticketId: string, params?: {
    page?: number
    pageSize?: number
  }) => {
    return api.get(`/service/tickets/${ticketId}/remote/calls`, { params })
  },

  /**
   * 删除通话记录
   */
  deletePhoneCall: async (callId: string) => {
    return api.delete(`/service/remote/calls/${callId}`)
  },

  /**
   * 上传通话录音
   */
  uploadRecording: async (callId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/service/remote/calls/${callId}/recording`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // ==================== 图文指导 ====================
  
  /**
   * 发送消息
   */
  sendMessage: async (data: {
    supportId: string
    ticketId: string
    type: 'text' | 'image' | 'file'
    content: string
    fileName?: string
  }) => {
    return api.post('/service/remote/messages', data)
  },

  /**
   * 获取消息历史
   */
  getMessages: async (supportId: string, params?: {
    page?: number
    pageSize?: number
    since?: string  // 获取此时间之后的消息
  }) => {
    return api.get(`/service/remote/support/${supportId}/messages`, { params })
  },

  /**
   * 上传文件
   */
  uploadFile: async (supportId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/service/remote/support/${supportId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /**
   * 上传图片
   */
  uploadImage: async (supportId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/service/remote/support/${supportId}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /**
   * 标记消息已读
   */
  markMessageRead: async (messageId: string) => {
    return api.post(`/service/remote/messages/${messageId}/read`)
  },

  /**
   * 标记全部已读
   */
  markAllRead: async (supportId: string) => {
    return api.post(`/service/remote/support/${supportId}/read-all`)
  },

  /**
   * 撤回消息
   */
  recallMessage: async (messageId: string) => {
    return api.post(`/service/remote/messages/${messageId}/recall`)
  },

  // ==================== 完成指导 ====================
  
  /**
   * 完成远程指导
   */
  completeSupport: async (supportId: string, data: {
    resolved: boolean
    resolutionNotes: string
    customerSatisfaction?: number
    serviceAttitudeRating?: number
    technicalSkillRating?: number
    responseSpeedRating?: number
    ratingComment?: string
    ratingTags?: string[]
  }) => {
    return api.post(`/service/remote/support/${supportId}/complete`, data)
  },

  /**
   * 提交完成报告
   */
  submitCompletionReport: async (supportId: string, report: Partial<RemoteCompletionReport>) => {
    return api.post(`/service/remote/support/${supportId}/report`, report)
  },

  /**
   * 获取完成报告
   */
  getCompletionReport: async (supportId: string) => {
    return api.get(`/service/remote/support/${supportId}/report`)
  },

  // ==================== 统计分析 ====================
  
  /**
   * 获取远程指导统计
   */
  getStatistics: async (params?: {
    startDate?: string
    endDate?: string
    engineerId?: string
  }) => {
    return api.get('/service/remote/statistics', { params })
  },

  /**
   * 获取工程师远程指导统计
   */
  getEngineerStatistics: async (engineerId: string, params?: {
    startDate?: string
    endDate?: string
  }) => {
    return api.get(`/service/remote/engineers/${engineerId}/statistics`, { params })
  },

  /**
   * 获取解决率统计
   */
  getResolutionRate: async (params?: {
    startDate?: string
    endDate?: string
    type?: string
  }) => {
    return api.get('/service/remote/resolution-rate', { params })
  },

  /**
   * 获取满意度统计
   */
  getSatisfactionRate: async (params?: {
    startDate?: string
    endDate?: string
    engineerId?: string
  }) => {
    return api.get('/service/remote/satisfaction-rate', { params })
  },
}

/**
 * 远程指导快捷方法
 */
export const remoteSupport = {
  /**
   * 开始电话指导
   */
  async startPhoneCall(ticketId: string, customerPhone: string) {
    // 1. 创建或获取远程指导会话
    let support = await remoteSupportService.getSupportByTicketId(ticketId)
    if (!support) {
      support = await remoteSupportService.createSupport(ticketId)
    }

    // 2. 开始会话（如果未开始）
    if (support.status === 'pending') {
      await remoteSupportService.startSupport(support.id)
    }

    // 3. 创建通话记录
    const call = await remoteSupportService.createPhoneCall({
      ticketId,
      supportId: support.id,
      customerPhone,
      startTime: new Date().toISOString(),
      notes: '开始电话指导',
    })

    return { support, call }
  },

  /**
   * 结束电话指导
   */
  async endPhoneCall(callId: string, notes: string) {
    // 1. 更新通话记录
    return await remoteSupportService.updatePhoneCall(callId, {
      endTime: new Date().toISOString(),
      notes,
    })
  },

  /**
   * 发送文字消息
   */
  async sendTextMessage(supportId: string, ticketId: string, content: string) {
    return await remoteSupportService.sendMessage({
      supportId,
      ticketId,
      type: 'text',
      content,
    })
  },

  /**
   * 发送图片消息
   */
  async sendImageMessage(supportId: string, ticketId: string, file: File) {
    // 1. 上传图片
    const uploadResult = await remoteSupportService.uploadImage(supportId, file)
    
    // 2. 发送消息
    return await remoteSupportService.sendMessage({
      supportId,
      ticketId,
      type: 'image',
      content: uploadResult.url,
      fileName: file.name,
    })
  },

  /**
   * 发送文件消息
   */
  async sendFileMessage(supportId: string, ticketId: string, file: File) {
    // 1. 上传文件
    const uploadResult = await remoteSupportService.uploadFile(supportId, file)
    
    // 2. 发送消息
    return await remoteSupportService.sendMessage({
      supportId,
      ticketId,
      type: 'file',
      content: uploadResult.url,
      fileName: file.name,
    })
  },

  /**
   * 完成远程指导
   */
  async completeRemoteSupport(supportId: string, data: {
    resolved: boolean
    resolutionNotes: string
    customerSatisfaction: number
    ratingComment?: string
  }) {
    return await remoteSupportService.completeSupport(supportId, data)
  },
}

export default remoteSupportService
