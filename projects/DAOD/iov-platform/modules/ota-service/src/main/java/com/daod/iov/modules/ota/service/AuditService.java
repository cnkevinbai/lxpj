package com.daod.iov.modules.ota.service;

import com.daod.iov.modules.ota.entity.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

/**
 * 审计服务
 */
public class AuditService {
    private final List<AuditLog> auditLogs = new CopyOnWriteArrayList<>();
    
    public void logAudit(String operation, String targetId, String details) {
        String targetType;
        if (targetId.startsWith("Firmware")) {
            targetType = "FIRMWARE";
        } else if (targetId.contains("Task")) {
            targetType = "TASK";
        } else {
            targetType = "CONFIG";
        }
        
        AuditLog log = AuditLog.builder()
            .id(UUID.randomUUID().toString())
            .operation(operation)
            .targetType(targetType)
            .targetId(targetId)
            .details(details)
            .userId("system")
            .userName("System")
            .createdAt(LocalDateTime.now())
            .build();
        
        auditLogs.add(log);
    }
    
    public List<AuditLog> queryLogs(AuditQuery query) {
        return auditLogs.stream()
            .filter(l -> query.getOperation() == null || l.getOperation().equals(query.getOperation()))
            .filter(l -> query.getTargetType() == null || l.getTargetType().equals(query.getTargetType()))
            .filter(l -> query.getTargetId() == null || l.getTargetId().equals(query.getTargetId()))
            .collect(Collectors.toList());
    }
    
    public List<AuditLog> getAllLogs() {
        return new ArrayList<>(auditLogs);
    }
}
