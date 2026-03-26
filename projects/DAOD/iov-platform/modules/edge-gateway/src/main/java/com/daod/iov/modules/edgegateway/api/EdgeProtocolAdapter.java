package com.daod.iov.modules.edgegateway.api;

import com.daod.iov.modules.edgegateway.api.dto.*;

/**
 * 边缘协议适配器接口
 * 
 * 支持不同边缘设备的协议转换
 */
public interface EdgeProtocolAdapter {
    
    /**
     * 解析设备数据
     * 
     * @param rawData 原始数据
     * @return 解析后的数据
     */
    EdgeData parse(byte[] rawData);
    
    /**
     * 编码指令数据
     * 
     * @param command 指令
     * @return 编码后的数据
     */
    byte[] encode(EdgeCommand command);
    
    /**
     * 获取支持的协议类型
     * 
     * @return 协议类型
     */
    String getProtocolType();
    
    /**
     * 获取协议版本
     * 
     * @return 协议版本
     */
    String getProtocolVersion();
}