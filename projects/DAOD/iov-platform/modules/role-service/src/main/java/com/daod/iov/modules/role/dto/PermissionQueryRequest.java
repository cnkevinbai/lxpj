package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 权限查询请求
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PermissionQueryRequest {
    /**
     * 租户ID
     */
    private String tenantId;
    
    /**
     * 权限名称（模糊查询）
     */
    private String name;
    
    /**
     * 权限编码
     */
    private String code;
    
    /**
     * 权限类型
     */
    private String type;
    
    /**
     * 父权限ID
     */
    private String parentId;
    
    /**
     * 分页参数
     */
    private Integer page = 1;
    
    /**
     * 分页大小
     */
    private Integer size = 10;
}
