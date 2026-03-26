package com.daod.iov.modules.edgegateway.api.dto;

/**
 * 边缘数据
 */
public class EdgeData {
    
    /** 数据 ID */
    private String id;
    
    /** 设备 ID */
    private String deviceId;
    
    /** 数据类型 */
    private String dataType;
    
    /** 时间戳 */
    private long timestamp;
    
    /** 数据内容 */
    private byte[] payload;
    
    /** 元数据 */
    private java.util.Map<String, String> metadata;
    
    /** 来源 */
    private String source;
    
    // Getters and Setters
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    
    public byte[] getPayload() { return payload; }
    public void setPayload(byte[] payload) { this.payload = payload; }
    
    public java.util.Map<String, String> getMetadata() { return metadata; }
    public void setMetadata(java.util.Map<String, String> metadata) { this.metadata = metadata; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}