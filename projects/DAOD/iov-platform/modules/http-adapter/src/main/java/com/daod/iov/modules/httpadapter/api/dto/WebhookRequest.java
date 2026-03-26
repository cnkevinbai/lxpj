package com.daod.iov.modules.httpadapter.api.dto;

import java.util.Map;

/**
 * Webhook 请求
 */
public class WebhookRequest {
    
    /** 请求来源 */
    private String source;
    
    /** 事件类型 */
    private String eventType;
    
    /** 请求头 */
    private Map<String, String> headers;
    
    /** 请求体 */
    private byte[] body;
    
    /** JSON 请求体 */
    private Map<String, Object> jsonBody;
    
    /** 时间戳 */
    private long timestamp;
    
    /** 签名 */
    private String signature;
    
    // Getters and Setters
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    
    public Map<String, String> getHeaders() { return headers; }
    public void setHeaders(Map<String, String> headers) { this.headers = headers; }
    
    public byte[] getBody() { return body; }
    public void setBody(byte[] body) { this.body = body; }
    
    public Map<String, Object> getJsonBody() { return jsonBody; }
    public void setJsonBody(Map<String, Object> jsonBody) { this.jsonBody = jsonBody; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    
    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
}