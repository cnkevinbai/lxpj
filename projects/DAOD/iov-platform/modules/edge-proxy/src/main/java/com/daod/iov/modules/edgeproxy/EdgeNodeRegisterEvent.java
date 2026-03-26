package com.daod.iov.modules.edgeproxy;

/**
 * 边缘节点注册事件
 */
public class EdgeNodeRegisterEvent {
    
    private String nodeId;
    private String name;
    private long timestamp;
    private String eventType;
    
    // Getters and Setters
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
}
