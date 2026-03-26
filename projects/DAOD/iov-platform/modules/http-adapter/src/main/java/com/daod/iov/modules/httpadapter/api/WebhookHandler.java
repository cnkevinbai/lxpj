package com.daod.iov.modules.httpadapter.api;

import com.daod.iov.modules.httpadapter.api.dto.WebhookRequest;
import com.daod.iov.modules.httpadapter.api.dto.WebhookResult;

/**
 * Webhook 处理器接口
 * 
 * 用于处理第三方平台的回调请求
 */
public interface WebhookHandler {
    
    /**
     * 获取 Webhook 路径
     */
    String getPath();
    
    /**
     * 处理 Webhook 请求
     * 
     * @param request Webhook 请求
     * @return 处理结果
     */
    WebhookResult handle(WebhookRequest request);
    
    /**
     * 验证签名
     * 
     * @param signature 签名
     * @param payload 请求体
     * @return 是否验证通过
     */
    default boolean verifySignature(String signature, byte[] payload) {
        return true;
    }
}