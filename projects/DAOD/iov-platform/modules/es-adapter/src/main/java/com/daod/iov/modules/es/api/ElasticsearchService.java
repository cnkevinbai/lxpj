package com.daod.iov.modules.es.api;

import com.daod.iov.modules.es.api.dto.*;

import java.util.List;
import java.util.Map;

/**
 * Elasticsearch 服务接口
 * 
 * 提供日志检索、轨迹搜索、全文检索能力
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public interface ElasticsearchService {
    
    // ==================== 日志检索 ====================
    
    /**
     * 索引日志
     * 
     * @param logEntry 日志条目
     */
    void indexLog(LogEntry logEntry);
    
    /**
     * 批量索引日志
     * 
     * @param logEntries 日志条目列表
     */
    void bulkIndexLogs(List<LogEntry> logEntries);
    
    /**
     * 搜索日志
     * 
     * @param request 搜索请求
     * @return 搜索结果
     */
    LogSearchResult searchLogs(LogSearchRequest request);
    
    /**
     * 聚合日志统计
     * 
     * @param request 聚合请求
     * @return 聚合结果
     */
    Map<String, Object> aggregateLogs(LogAggregationRequest request);
    
    // ==================== 轨迹搜索 ====================
    
    /**
     * 索引轨迹点
     * 
     * @param trajectoryPoint 轨迹点
     */
    void indexTrajectory(TrajectoryPointDocument trajectoryPoint);
    
    /**
     * 批量索引轨迹点
     * 
     * @param points 轨迹点列表
     */
    void bulkIndexTrajectories(List<TrajectoryPointDocument> points);
    
    /**
     * 搜索轨迹
     * 
     * @param request 搜索请求
     * @return 搜索结果
     */
    TrajectorySearchResult searchTrajectories(TrajectorySearchRequest request);
    
    /**
     * 按时间范围查询轨迹
     * 
     * @param vin 车辆VIN
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 轨迹点列表
     */
    List<TrajectoryPointDocument> getTrajectoryByTimeRange(String vin, long startTime, long endTime);
    
    // ==================== 全文检索 ====================
    
    /**
     * 索引文档
     * 
     * @param index 索引名
     * @param id 文档ID
     * @param document 文档内容
     */
    void indexDocument(String index, String id, Map<String, Object> document);
    
    /**
     * 批量索引文档
     * 
     * @param index 索引名
     * @param documents 文档列表 (id -> document)
     */
    void bulkIndexDocuments(String index, Map<String, Map<String, Object>> documents);
    
    /**
     * 搜索文档
     * 
     * @param index 索引名
     * @param query 查询条件
     * @param from 分页起始
     * @param size 分页大小
     * @return 搜索结果
     */
    DocumentSearchResult searchDocuments(String index, Map<String, Object> query, int from, int size);
    
    /**
     * 全文搜索
     * 
     * @param index 索引名
     * @param field 字段名
     * @param keyword 关键词
     * @param from 分页起始
     * @param size 分页大小
     * @return 搜索结果
     */
    DocumentSearchResult fullTextSearch(String index, String field, String keyword, int from, int size);
    
    /**
     * 删除文档
     * 
     * @param index 索引名
     * @param id 文档ID
     */
    void deleteDocument(String index, String id);
    
    // ==================== 告警检索 ====================
    
    /**
     * 索引告警
     * 
     * @param alarm 告警文档
     */
    void indexAlarm(AlarmDocument alarm);
    
    /**
     * 搜索告警
     * 
     * @param request 搜索请求
     * @return 搜索结果
     */
    AlarmSearchResult searchAlarms(AlarmSearchRequest request);
    
    // ==================== 索引管理 ====================
    
    /**
     * 创建索引
     * 
     * @param index 索引名
     * @param mapping 索引映射
     */
    void createIndex(String index, Map<String, Object> mapping);
    
    /**
     * 删除索引
     * 
     * @param index 索引名
     */
    void deleteIndex(String index);
    
    /**
     * 检查索引是否存在
     * 
     * @param index 索引名
     * @return 是否存在
     */
    boolean indexExists(String index);
}