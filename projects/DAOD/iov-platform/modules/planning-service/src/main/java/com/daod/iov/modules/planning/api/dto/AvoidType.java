package com.daod.iov.modules.planning.api.dto;

/**
 * 避让类型枚举
 */
public enum AvoidType {
    
    /** 高速公路 */
    HIGHWAY("highway"),
    
    /** 收费路段 */
    TOLL("toll"),
    
    /** 轮渡 */
    FERRY("ferry"),
    
    /** 隧道 */
    TUNNEL("tunnel"),
    
    /** 未铺装道路 */
    UNPAVED("unpaved");
    
    private final String code;
    
    AvoidType(String code) {
        this.code = code;
    }
    
    public String getCode() {
        return code;
    }
}