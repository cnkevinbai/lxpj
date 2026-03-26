package com.daod.iov.modules.httpadapter.api.dto;

import java.util.List;

/**
 * 指令列表结果
 */
public class CommandListResult {
    
    /** 是否成功 */
    private boolean success;
    
    /** 指令列表 */
    private List<CommandInfo> commands;
    
    /** 服务器时间 */
    private long serverTime;
    
    /** 等待间隔 (毫秒) */
    private long pollInterval;
    
    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public List<CommandInfo> getCommands() { return commands; }
    public void setCommands(List<CommandInfo> commands) { this.commands = commands; }
    
    public long getServerTime() { return serverTime; }
    public void setServerTime(long serverTime) { this.serverTime = serverTime; }
    
    public long getPollInterval() { return pollInterval; }
    public void setPollInterval(long pollInterval) { this.pollInterval = pollInterval; }
}