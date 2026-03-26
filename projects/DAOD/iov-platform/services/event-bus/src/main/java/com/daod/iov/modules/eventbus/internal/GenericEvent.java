package com.daod.iov.modules.eventbus.internal;

import com.daod.iov.modules.eventbus.api.Event;

import java.util.HashMap;
import java.util.Map;

/**
 * 通用事件实现
 */
public class GenericEvent implements Event {
    
    private final String type;
    private final String source;
    private final long timestamp;
    private final Object payload;
    private final String tenantId;
    private final Map<String, Object> metadata;
    
    public GenericEvent(String type, String source, Object payload, String tenantId) {
        this.type = type;
        this.source = source;
        this.timestamp = System.currentTimeMillis();
        this.payload = payload;
        this.tenantId = tenantId;
        this.metadata = new HashMap<>();
    }
    
    @Override
    public String getType() {
        return type;
    }
    
    @Override
    public String getSource() {
        return source;
    }
    
    @Override
    public long getTimestamp() {
        return timestamp;
    }
    
    @Override
    public Object getPayload() {
        return payload;
    }
    
    @Override
    public String getTenantId() {
        return tenantId;
    }
    
    public Map<String, Object> getMetadata() {
        return metadata;
    }
    
    public GenericEvent withMetadata(String key, Object value) {
        this.metadata.put(key, value);
        return this;
    }
    
    @Override
    public String toString() {
        return "GenericEvent{" +
            "type='" + type + '\'' +
            ", source='" + source + '\'' +
            ", timestamp=" + timestamp +
            ", tenantId='" + tenantId + '\'' +
            '}';
    }
}