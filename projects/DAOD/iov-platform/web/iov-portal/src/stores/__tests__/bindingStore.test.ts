/**
 * BindingStore 单元测试
 * 
 * @description 测试设备绑定状态管理
 * @author 渔晓白
 */

import { useBindingStore } from '../bindingStore'
import { act } from '@testing-library/react'

// Mock the binding service
jest.mock('@/services/binding', () => ({
  getPendingTerminals: jest.fn(),
  getBindings: jest.fn(),
  getBindingEvents: jest.fn(),
  getBindingStatistics: jest.fn(),
  bindDevice: jest.fn(),
  unbindDevice: jest.fn(),
}))

import * as bindingService from '@/services/binding'

const mockBindingService = bindingService as jest.Mocked<typeof bindingService>

describe('BindingStore', () => {
  beforeEach(() => {
    // 重置 store
    useBindingStore.setState({
      bindings: [],
      pendingTerminals: [],
      selectedBinding: null,
      bindingEvents: [],
      statistics: null,
      loading: false,
      pendingLoading: false,
      eventsLoading: false,
      filters: { keyword: '', status: undefined, protocol: undefined },
      totalBindings: 0,
      totalPending: 0,
    })
    
    // 清除 mock
    jest.clearAllMocks()
  })
  
  describe('fetchBindings', () => {
    it('应该成功获取绑定列表', async () => {
      const mockBindings = [
        {
          bindingId: 'BIND_001',
          deviceId: '13800001111',
          vin: 'LDA1234567890ABCD',
          status: 'BOUND' as const,
          protocol: 'JTT808' as const,
          bindTime: '2026-03-26 10:00:00',
          retryCount: 0,
        },
        {
          bindingId: 'BIND_002',
          deviceId: '13800002222',
          vin: 'LDA1234567890ABCE',
          status: 'BOUND' as const,
          protocol: 'MQTT' as const,
          bindTime: '2026-03-26 11:00:00',
          retryCount: 0,
        },
      ]
      
      mockBindingService.getBindings.mockResolvedValueOnce({
        list: mockBindings,
        total: 2,
        page: 1,
        pageSize: 20,
      })
      
      await act(async () => {
        await useBindingStore.getState().fetchBindings()
      })
      
      const state = useBindingStore.getState()
      
      expect(state.bindings).toHaveLength(2)
      expect(state.bindings[0].bindingId).toBe('BIND_001')
      expect(state.totalBindings).toBe(2)
      expect(state.loading).toBe(false)
    })
    
    it('应该处理获取失败的情况', async () => {
      mockBindingService.getBindings.mockRejectedValueOnce(new Error('Network Error'))
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      await act(async () => {
        await useBindingStore.getState().fetchBindings()
      })
      
      const state = useBindingStore.getState()
      
      expect(state.bindings).toHaveLength(0)
      expect(state.loading).toBe(false)
      
      consoleSpy.mockRestore()
    })
  })
  
  describe('fetchPendingTerminals', () => {
    it('应该成功获取待绑定终端列表', async () => {
      const mockTerminals = [
        {
          id: '1',
          terminalId: '13800001111',
          protocol: 'JTT808' as const,
          connectTime: '2026-03-26 10:00:00',
          status: 'pending' as const,
        },
      ]
      
      mockBindingService.getPendingTerminals.mockResolvedValueOnce({
        list: mockTerminals,
        total: 1,
      })
      
      await act(async () => {
        await useBindingStore.getState().fetchPendingTerminals()
      })
      
      const state = useBindingStore.getState()
      
      expect(state.pendingTerminals).toHaveLength(1)
      expect(state.pendingTerminals[0].terminalId).toBe('13800001111')
      expect(state.totalPending).toBe(1)
    })
  })
  
  describe('bindDevice', () => {
    it('应该成功绑定设备', async () => {
      const mockBinding = {
        bindingId: 'BIND_NEW',
        deviceId: '13800001111',
        vin: 'LDA1234567890ABCD',
        status: 'BOUND' as const,
        protocol: 'JTT808' as const,
        bindTime: '2026-03-26 12:00:00',
        retryCount: 0,
      }
      
      mockBindingService.bindDevice.mockResolvedValueOnce({
        success: true,
        message: '绑定成功',
        data: mockBinding,
      })
      
      // 先设置一个待绑定终端
      useBindingStore.setState({
        pendingTerminals: [{
          id: '1',
          terminalId: '13800001111',
          protocol: 'JTT808',
          connectTime: '2026-03-26 10:00:00',
          status: 'pending',
        }],
        totalPending: 1,
      })
      
      const result = await act(async () => {
        return await useBindingStore.getState().bindDevice('13800001111', {
          terminalId: '13800001111',
          vin: 'LDA1234567890ABCD',
        })
      })
      
      expect(result).toBe(true)
      
      const state = useBindingStore.getState()
      expect(state.bindings).toHaveLength(1)
      expect(state.bindings[0].bindingId).toBe('BIND_NEW')
      expect(state.pendingTerminals).toHaveLength(0)
    })
    
    it('应该处理绑定失败的情况', async () => {
      mockBindingService.bindDevice.mockResolvedValueOnce({
        success: false,
        message: '设备已绑定到其他车辆',
      })
      
      const result = await useBindingStore.getState().bindDevice('13800001111', {
        terminalId: '13800001111',
        vin: 'LDA1234567890ABCD',
      })
      
      expect(result).toBe(false)
    })
  })
  
  describe('unbindDevice', () => {
    it('应该成功解绑设备', async () => {
      mockBindingService.unbindDevice.mockResolvedValueOnce({
        success: true,
        message: '解绑成功',
      })
      
      // 设置一个已绑定的设备
      useBindingStore.setState({
        bindings: [{
          bindingId: 'BIND_001',
          deviceId: '13800001111',
          vin: 'LDA1234567890ABCD',
          status: 'BOUND',
          protocol: 'JTT808',
          bindTime: '2026-03-26 10:00:00',
          retryCount: 0,
        }],
      })
      
      const result = await act(async () => {
        return await useBindingStore.getState().unbindDevice('BIND_001', '测试解绑')
      })
      
      expect(result).toBe(true)
      
      const state = useBindingStore.getState()
      expect(state.bindings[0].status).toBe('UNBOUND')
    })
  })
  
  describe('updateBindingStatus', () => {
    it('应该更新绑定状态', () => {
      useBindingStore.setState({
        bindings: [{
          bindingId: 'BIND_001',
          deviceId: '13800001111',
          vin: 'LDA1234567890ABCD',
          status: 'BOUND',
          protocol: 'JTT808',
          bindTime: '2026-03-26 10:00:00',
          retryCount: 0,
        }],
      })
      
      act(() => {
        useBindingStore.getState().updateBindingStatus('BIND_001', 'EXPIRED')
      })
      
      const state = useBindingStore.getState()
      expect(state.bindings[0].status).toBe('EXPIRED')
    })
  })
  
  describe('getBindingsByProtocol', () => {
    beforeEach(() => {
      useBindingStore.setState({
        bindings: [
          { bindingId: 'BIND_001', deviceId: '1', vin: 'VIN1', status: 'BOUND', protocol: 'JTT808', bindTime: '', retryCount: 0 },
          { bindingId: 'BIND_002', deviceId: '2', vin: 'VIN2', status: 'BOUND', protocol: 'MQTT', bindTime: '', retryCount: 0 },
          { bindingId: 'BIND_003', deviceId: '3', vin: 'VIN3', status: 'BOUND', protocol: 'JTT808', bindTime: '', retryCount: 0 },
        ],
      })
    })
    
    it('应该按协议筛选绑定', () => {
      const jtt808Bindings = useBindingStore.getState().getBindingsByProtocol('JTT808')
      
      expect(jtt808Bindings).toHaveLength(2)
      expect(jtt808Bindings.every(b => b.protocol === 'JTT808')).toBe(true)
    })
    
    it('应该返回空数组如果没有匹配', () => {
      const httpBindings = useBindingStore.getState().getBindingsByProtocol('HTTP')
      
      expect(httpBindings).toHaveLength(0)
    })
  })
  
  describe('setFilters', () => {
    it('应该更新筛选条件', () => {
      act(() => {
        useBindingStore.getState().setFilters({ keyword: 'test', protocol: 'JTT808' })
      })
      
      const state = useBindingStore.getState()
      expect(state.filters.keyword).toBe('test')
      expect(state.filters.protocol).toBe('JTT808')
    })
  })
  
  describe('resetFilters', () => {
    it('应该重置筛选条件', () => {
      useBindingStore.setState({
        filters: { keyword: 'test', status: 'BOUND', protocol: 'JTT808' },
      })
      
      act(() => {
        useBindingStore.getState().resetFilters()
      })
      
      const state = useBindingStore.getState()
      expect(state.filters).toEqual({ keyword: '', status: undefined, protocol: undefined })
    })
  })
})