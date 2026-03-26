package com.daod.iov.modules.edgegateway.api;

import com.daod.iov.modules.edgegateway.api.dto.*;

/**
 * 边缘网关服务接口
 * 
 * 提供边缘计算、协议转换、数据预处理能力
 */
public interface EdgeGatewayService {
    
    /**
     * 获取网关状态
     * 
     * @return 网关状态
     */
    EdgeGatewayStatus getStatus();
    
    /**
     * 上报边缘数据
     * 
     * @param data 边缘数据
     * @return 处理结果
     */
    EdgeDataResult reportData(EdgeData data);
    
    /**
     * 批量上报数据
     * 
     * @param dataList 数据列表
     * @return 处理结果
     */
    BatchResult batchReport(java.util.List<EdgeData> dataList);
    
    /**
     * 订阅云端指令
     * 
     * @param callback 回调函数
     */
    void subscribeCommands(EdgeCommandCallback callback);
    
    /**
     * 获取连接状态
     * 
     * @return 连接状态
     */
    ConnectionStatus getConnectionStatus();
    
    /**
     * 重连云端
     */
    void reconnect();
}