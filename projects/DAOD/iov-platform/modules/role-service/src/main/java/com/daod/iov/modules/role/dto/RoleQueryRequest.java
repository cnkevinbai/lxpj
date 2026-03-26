package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 角色查询请求
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RoleQueryRequest {
    /**
     * 租户ID
     */
    private String tenantId;
    
    /**
     * 角色名称（模糊查询）
     */
    private String name;
    
    /**
     * 角色编码
     */
    private String code;
    
    /**
     * 角色类型
     */
    private String type;
    
    /**
     * 是否默认角色
     */
    private Boolean defaultRole;
    
    /**
     * 是否禁用
     */
    private Boolean disabled;
    
    /**
     * 父角色ID
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
    
    /**
     * 排序字段
     */
    private String sortBy = "createdAt";
    
    /**
     * 排序方式
     */
    private String sortOrder = "desc";
}
