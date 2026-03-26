package com.daod.iov.modules.ota.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 升级任务查询参数
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class TaskQuery {
    private String status;
    private String firmwareId;
    private String vehicleId;
    private String createdBy;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer page;
    private Integer size;
    
    // Getters with defaults
    public Integer getPage() {
        return page != null ? page : 1;
    }
    
    public Integer getSize() {
        return size != null ? size : 20;
    }
}
