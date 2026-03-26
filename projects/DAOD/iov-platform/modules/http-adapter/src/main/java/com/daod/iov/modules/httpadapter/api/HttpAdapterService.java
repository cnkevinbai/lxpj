package com.daod.iov.modules.httpadapter.api;

import com.daod.iov.modules.httpadapter.api.dto.*;

/**
 * HTTP 适配器服务接口
 * 
 * 提供 HTTP/HTTPS 方式的数据上报、指令下发、Webhook 对接能力
 */
public interface HttpAdapterService {
    
    // ==================== 数据上报 ====================
    
    /**
     * 处理终端数据上报
     * 
     * @param request 数据上报请求
     * @return 处理结果
     */
    DataReportResult handleDataReport(DataReportRequest request);
    
    /**
     * 批量数据上报
     */
    BatchReportResult handleBatchReport(BatchReportRequest request);
    
    // ==================== 位置上报 ====================
    
    /**
     * 处理位置数据上报
     */
    PositionReportResult handlePositionReport(PositionReportRequest request);
    
    // ==================== 指令管理 ====================
    
    /**
     * 获取待执行指令
     * 
     * @param terminalId 终端 ID
     * @return 指令列表
     */
    CommandListResult getPendingCommands(String terminalId);
    
    /**
     * 上报指令执行结果
     */
    CommandResultReport reportCommandResult(CommandResultReportRequest request);
    
    // ==================== Webhook ====================
    
    /**
     * 注册 Webhook 处理器
     */
    void registerWebhookHandler(String path, WebhookHandler handler);
    
    /**
     * 处理 Webhook 回调
     */
    WebhookResult handleWebhook(String path, WebhookRequest request);
    
    // ==================== 认证 ====================
    
    /**
     * 验证 API Token
     */
    ApiTokenInfo validateToken(String token);
    
    /**
     * 生成 API Token
     */
    String generateToken(String terminalId, long expiresIn);
    
    // ==================== 状态查询 ====================
    
    /**
     * 获取连接统计
     */
    ConnectionStats getConnectionStats();
}