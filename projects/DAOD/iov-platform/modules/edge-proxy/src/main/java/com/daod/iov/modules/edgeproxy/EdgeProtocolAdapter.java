package com.daod.iov.modules.edgeproxy;

/**
 * 边缘协议适配器
 * 实现边缘协议的适配
 */
public class EdgeProtocolAdapter {
    
    /**
     * 协议适配
     */
    public void adapt(String protocol, EdgeProtocol edgeProtocol) {
        System.out.println("适配协议: " + protocol);
    }
}
