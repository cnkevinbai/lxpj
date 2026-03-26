package com.daod.iov.modules.role.dto;

import lombok.*;
import java.util.*;

/**
 * 分页响应
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PageResponse<T> {
    /**
     * 当前页码
     */
    private Integer page;
    
    /**
     * 每页大小
     */
    private Integer size;
    
    /**
     * 总记录数
     */
    private Long total;
    
    /**
     * 总页数
     */
    private Integer totalPages;
    
    /**
     * 数据列表
     */
    private List<T> records;
}
