package com.daod.iov.modules.httpadapter.api.dto;

import java.util.Map;

/**
 * 指令信息
 */
public class CommandInfo {
    
    /** 指令 ID */
    private String commandId;
    
    /** 指令类型 */
    private String commandType;
    
    /** 指令参数 */
    private Map<String, Object> params;
    
    /** 优先级 */
    private int priority;
    
    /** 创建时间 */
    private long createTime;
    
    /** 超时时间 (秒) */
    private int timeout;
    
    // 指令类型常量
    public static final String TYPE_TEXT = "text";
    public static final String TYPE_PARAM_SET = "param_set";
    public static final String TYPE_LOCK = "lock";
    public static final String TYPE_UNLOCK = "unlock";
    public static final String TYPE_REBOOT = "reboot";
    public static final String TYPE_OTA = "ota";
    
    // Getters and Setters
    public String getCommandId() { return commandId; }
    public void setCommandId(String commandId) { this.commandId = commandId; }
    
    public String getCommandType() { return commandType; }
    public void setCommandType(String commandType) { this.commandType = commandType; }
    
    public Map<String, Object> getParams() { return params; }
    public void setParams(Map<String, Object> params) { this.params = params; }
    
    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }
    
    public long getCreateTime() { return createTime; }
    public void setCreateTime(long createTime) { this.createTime = createTime; }
    
    public int getTimeout() { return timeout; }
    public void setTimeout(int timeout) { this.timeout = timeout; }
}