package com.daod.iov.modules.httpadapter.api.dto;

/**
 * API Token 信息
 */
public class ApiTokenInfo {
    
    /** Token ID */
    private String tokenId;
    
    /** 终端 ID */
    private String terminalId;
    
    /** 租户 ID */
    private String tenantId;
    
    /** 过期时间 */
    private long expiresAt;
    
    /** 创建时间 */
    private long createdAt;
    
    /** 权限范围 */
    private String[] scopes;
    
    /** 是否有效 */
    public boolean isValid() {
        return System.currentTimeMillis() < expiresAt;
    }
    
    // Getters and Setters
    public String getTokenId() { return tokenId; }
    public void setTokenId(String tokenId) { this.tokenId = tokenId; }
    
    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String terminalId) { this.terminalId = terminalId; }
    
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    
    public long getExpiresAt() { return expiresAt; }
    public void setExpiresAt(long expiresAt) { this.expiresAt = expiresAt; }
    
    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
    
    public String[] getScopes() { return scopes; }
    public void setScopes(String[] scopes) { this.scopes = scopes; }
}