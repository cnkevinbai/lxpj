package com.daod.iov.modules.planning.internal.service;

/**
 * 规划历史服务
 */
public class PlanningHistoryService {
    
    public void saveHistory(Object plan) {
        // 保存规划历史到数据库
    }
    
    public Object getHistory(String planId) {
        // 查询规划历史
        return null;
    }
    
    public java.util.List<Object> listHistory(String vehicleId, int limit) {
        // 列出规划历史
        return new java.util.ArrayList<>();
    }
}