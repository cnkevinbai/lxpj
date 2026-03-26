package com.daod.iov.modules.es.internal.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.daod.iov.modules.es.api.ElasticsearchService;
import com.daod.iov.modules.es.api.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Elasticsearch 服务实现
 * 
 * 提供日志检索、轨迹搜索、全文检索、告警检索的完整实现
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Slf4j
@Service
public class ElasticsearchServiceImpl implements ElasticsearchService {
    
    @Autowired
    private ElasticsearchClient client;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    // 索引名称常量
    private static final String LOG_INDEX = "iov-logs";
    private static final String TRAJECTORY_INDEX = "iov-trajectory";
    private static final String ALARM_INDEX = "iov-alarms";
    
    // ==================== 日志检索 ====================
    
    @Override
    public void indexLog(LogEntry logEntry) {
        try {
            String indexName = LOG_INDEX + "-" + logEntry.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
            
            client.index(i -> i
                .index(indexName)
                .id(logEntry.getId())
                .document(logEntry)
            );
            
            log.debug("索引日志成功: id={}", logEntry.getId());
        } catch (IOException e) {
            log.error("索引日志失败: {}", e.getMessage());
            throw new RuntimeException("索引日志失败", e);
        }
    }
    
    @Override
    public void bulkIndexLogs(List<LogEntry> logEntries) {
        if (logEntries == null || logEntries.isEmpty()) {
            return;
        }
        
        try {
            // 按日期分组
            Map<String, List<LogEntry>> groupedByDate = new HashMap<>();
            for (LogEntry entry : logEntries) {
                String indexName = LOG_INDEX + "-" + entry.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
                groupedByDate.computeIfAbsent(indexName, k -> new ArrayList<>()).add(entry);
            }
            
            // 批量索引
            for (Map.Entry<String, List<LogEntry>> entry : groupedByDate.entrySet()) {
                String indexName = entry.getKey();
                List<LogEntry> entries = entry.getValue();
                
                client.bulk(b -> {
                    for (LogEntry log : entries) {
                        b.operations(op -> op
                            .index(idx -> idx
                                .index(indexName)
                                .id(log.getId())
                                .document(log)
                            )
                        );
                    }
                    return b;
                });
            }
            
            log.info("批量索引日志成功: count={}", logEntries.size());
        } catch (IOException e) {
            log.error("批量索引日志失败: {}", e.getMessage());
            throw new RuntimeException("批量索引日志失败", e);
        }
    }
    
    @Override
    public LogSearchResult searchLogs(LogSearchRequest request) {
        try {
            // 构建查询条件
            List<Query> mustQueries = new ArrayList<>();
            
            if (request.getKeyword() != null) {
                mustQueries.add(Query.of(q -> q
                    .match(m -> m
                        .field("message")
                        .query(request.getKeyword())
                    )
                ));
            }
            
            if (request.getLevel() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("level").value(request.getLevel()))
                ));
            }
            
            if (request.getService() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("service").value(request.getService()))
                ));
            }
            
            if (request.getTraceId() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("traceId").value(request.getTraceId()))
                ));
            }
            
            if (request.getTenantId() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("tenantId").value(request.getTenantId()))
                ));
            }
            
            // 时间范围
            if (request.getStartTime() != null || request.getEndTime() != null) {
                RangeQuery.Builder rangeBuilder = new RangeQuery.Builder().field("timestamp");
                if (request.getStartTime() != null) {
                    rangeBuilder.gte(request.getStartTime().toString());
                }
                if (request.getEndTime() != null) {
                    rangeBuilder.lte(request.getEndTime().toString());
                }
                mustQueries.add(Query.of(q -> q.range(rangeBuilder.build())));
            }
            
            // 执行搜索
            SearchResponse<LogEntry> response = client.search(s -> {
                s.index(LOG_INDEX + "-*")
                    .query(Query.of(q -> q.bool(b -> b.must(mustQueries))))
                    .from(request.getFrom())
                    .size(request.getSize());
                
                if (request.getSortField() != null) {
                    s.sort(sort -> sort
                        .field(f -> f
                            .field(request.getSortField())
                            .order("desc".equals(request.getSortOrder()) ? SortOrder.Desc : SortOrder.Asc)
                        )
                    );
                }
                
                return s;
            }, LogEntry.class);
            
            // 构建结果
            LogSearchResult result = new LogSearchResult();
            result.setTotal(response.hits().total().value());
            
            List<LogEntry> logs = new ArrayList<>();
            for (Hit<LogEntry> hit : response.hits().hits()) {
                logs.add(hit.source());
            }
            result.setLogs(logs);
            
            return result;
        } catch (IOException e) {
            log.error("搜索日志失败: {}", e.getMessage());
            throw new RuntimeException("搜索日志失败", e);
        }
    }
    
    @Override
    public Map<String, Object> aggregateLogs(LogAggregationRequest request) {
        try {
            // 构建聚合查询
            SearchResponse<Void> response = client.search(s -> {
                s.index(LOG_INDEX + "-*")
                    .size(0)
                    .aggregations("by_field", agg -> agg
                        .terms(t -> t
                            .field(request.getField())
                            .size(100)
                        )
                        .aggregations("over_time", dateAgg -> dateAgg
                            .dateHistogram(dh -> dh
                                .field("timestamp")
                                .calendarInterval(convertInterval(request.getInterval()))
                            )
                        )
                    );
                
                return s;
            }, Void.class);
            
            // 解析聚合结果
            Map<String, Object> result = new HashMap<>();
            Map<String, Long> fieldCounts = new HashMap<>();
            Map<String, Map<String, Long>> timeSeries = new HashMap<>();
            
            if (response.aggregations() != null && response.aggregations().containsKey("by_field")) {
                var byFieldAgg = response.aggregations().get("by_field");
                if (byFieldAgg != null && byFieldAgg._get() instanceof co.elastic.clients.elasticsearch._types.aggregations.StringTermsAggregate) {
                    var stringTerms = (co.elastic.clients.elasticsearch._types.aggregations.StringTermsAggregate) byFieldAgg._get();
                    
                    for (var bucket : stringTerms.buckets().array()) {
                        String key = bucket.key();
                        long count = bucket.docCount();
                        fieldCounts.put(key, count);
                        
                        // 解析时间序列
                        if (bucket.aggregations() != null && bucket.aggregations().containsKey("over_time")) {
                            Map<String, Long> timeData = new LinkedHashMap<>();
                            var overTimeAgg = bucket.aggregations().get("over_time");
                            if (overTimeAgg != null && overTimeAgg._get() instanceof co.elastic.clients.elasticsearch._types.aggregations.DateHistogramAggregate) {
                                var dateHistogram = (co.elastic.clients.elasticsearch._types.aggregations.DateHistogramAggregate) overTimeAgg._get();
                                for (var timeBucket : dateHistogram.buckets().array()) {
                                    timeData.put(timeBucket.keyAsString(), timeBucket.docCount());
                                }
                            }
                            timeSeries.put(key, timeData);
                        }
                    }
                }
            }
            
            result.put("fieldCounts", fieldCounts);
            result.put("timeSeries", timeSeries);
            result.put("totalFields", fieldCounts.size());
            
            return result;
        } catch (IOException e) {
            log.error("聚合日志失败: {}", e.getMessage());
            throw new RuntimeException("聚合日志失败", e);
        }
    }
    
    // ==================== 轨迹搜索 ====================
    
    @Override
    public void indexTrajectory(TrajectoryPointDocument trajectoryPoint) {
        try {
            String indexName = TRAJECTORY_INDEX + "-" + 
                trajectoryPoint.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
            
            client.index(i -> i
                .index(indexName)
                .id(trajectoryPoint.getId())
                .document(trajectoryPoint)
            );
            
            log.debug("索引轨迹点成功: id={}", trajectoryPoint.getId());
        } catch (IOException e) {
            log.error("索引轨迹点失败: {}", e.getMessage());
            throw new RuntimeException("索引轨迹点失败", e);
        }
    }
    
    @Override
    public void bulkIndexTrajectories(List<TrajectoryPointDocument> points) {
        if (points == null || points.isEmpty()) {
            return;
        }
        
        try {
            // 按日期分组
            Map<String, List<TrajectoryPointDocument>> groupedByDate = new HashMap<>();
            for (TrajectoryPointDocument point : points) {
                String indexName = TRAJECTORY_INDEX + "-" + 
                    point.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
                groupedByDate.computeIfAbsent(indexName, k -> new ArrayList<>()).add(point);
            }
            
            // 批量索引
            for (Map.Entry<String, List<TrajectoryPointDocument>> entry : groupedByDate.entrySet()) {
                client.bulk(b -> {
                    for (TrajectoryPointDocument point : entry.getValue()) {
                        b.operations(op -> op
                            .index(idx -> idx
                                .index(entry.getKey())
                                .id(point.getId())
                                .document(point)
                            )
                        );
                    }
                    return b;
                });
            }
            
            log.info("批量索引轨迹点成功: count={}", points.size());
        } catch (IOException e) {
            log.error("批量索引轨迹点失败: {}", e.getMessage());
            throw new RuntimeException("批量索引轨迹点失败", e);
        }
    }
    
    @Override
    public TrajectorySearchResult searchTrajectories(TrajectorySearchRequest request) {
        try {
            List<Query> mustQueries = new ArrayList<>();
            
            if (request.getVin() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("vin").value(request.getVin()))
                ));
            }
            
            if (request.getStartTime() != null || request.getEndTime() != null) {
                RangeQuery.Builder rangeBuilder = new RangeQuery.Builder().field("timestamp");
                if (request.getStartTime() != null) {
                    rangeBuilder.gte(request.getStartTime().toString());
                }
                if (request.getEndTime() != null) {
                    rangeBuilder.lte(request.getEndTime().toString());
                }
                mustQueries.add(Query.of(q -> q.range(rangeBuilder.build())));
            }
            
            // 执行搜索
            SearchResponse<TrajectoryPointDocument> response = client.search(s -> s
                .index(TRAJECTORY_INDEX + "-*")
                .query(Query.of(q -> q.bool(b -> b.must(mustQueries))))
                .from(request.getFrom())
                .size(request.getSize())
                .sort(sort -> sort.field(f -> f.field("timestamp").order(SortOrder.Asc)))
            , TrajectoryPointDocument.class);
            
            TrajectorySearchResult result = new TrajectorySearchResult();
            result.setTotal(response.hits().total().value());
            
            List<TrajectoryPointDocument> points = new ArrayList<>();
            for (Hit<TrajectoryPointDocument> hit : response.hits().hits()) {
                points.add(hit.source());
            }
            result.setPoints(points);
            
            return result;
        } catch (IOException e) {
            log.error("搜索轨迹失败: {}", e.getMessage());
            throw new RuntimeException("搜索轨迹失败", e);
        }
    }
    
    @Override
    public List<TrajectoryPointDocument> getTrajectoryByTimeRange(String vin, long startTime, long endTime) {
        TrajectorySearchRequest request = new TrajectorySearchRequest();
        request.setVin(vin);
        request.setStartTime(LocalDateTime.ofEpochSecond(startTime / 1000, 0, null));
        request.setEndTime(LocalDateTime.ofEpochSecond(endTime / 1000, 0, null));
        request.setFrom(0);
        request.setSize(10000);
        
        return searchTrajectories(request).getPoints();
    }
    
    // ==================== 全文检索 ====================
    
    @Override
    public void indexDocument(String index, String id, Map<String, Object> document) {
        try {
            client.index(i -> i
                .index(index)
                .id(id)
                .document(document)
            );
            log.debug("索引文档成功: index={}, id={}", index, id);
        } catch (IOException e) {
            log.error("索引文档失败: {}", e.getMessage());
            throw new RuntimeException("索引文档失败", e);
        }
    }
    
    @Override
    public void bulkIndexDocuments(String index, Map<String, Map<String, Object>> documents) {
        if (documents == null || documents.isEmpty()) {
            return;
        }
        
        try {
            client.bulk(b -> {
                for (Map.Entry<String, Map<String, Object>> entry : documents.entrySet()) {
                    b.operations(op -> op
                        .index(idx -> idx
                            .index(index)
                            .id(entry.getKey())
                            .document(entry.getValue())
                        )
                    );
                }
                return b;
            });
            
            log.info("批量索引文档成功: index={}, count={}", index, documents.size());
        } catch (IOException e) {
            log.error("批量索引文档失败: {}", e.getMessage());
            throw new RuntimeException("批量索引文档失败", e);
        }
    }
    
    @Override
    public DocumentSearchResult searchDocuments(String index, Map<String, Object> query, int from, int size) {
        try {
            // 构建查询条件
            List<Query> mustQueries = new ArrayList<>();
            for (Map.Entry<String, Object> entry : query.entrySet()) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field(entry.getKey()).value(entry.getValue().toString()))
                ));
            }
            
            SearchResponse<Map> response = client.search(s -> s
                .index(index)
                .query(Query.of(q -> q.bool(b -> b.must(mustQueries))))
                .from(from)
                .size(size)
            , Map.class);
            
            DocumentSearchResult result = new DocumentSearchResult();
            result.setTotal(response.hits().total().value());
            
            List<Map<String, Object>> documents = new ArrayList<>();
            for (Hit<Map> hit : response.hits().hits()) {
                documents.add(hit.source());
            }
            result.setDocuments(documents);
            
            return result;
        } catch (IOException e) {
            log.error("搜索文档失败: {}", e.getMessage());
            throw new RuntimeException("搜索文档失败", e);
        }
    }
    
    @Override
    public DocumentSearchResult fullTextSearch(String index, String field, String keyword, int from, int size) {
        try {
            SearchResponse<Map> response = client.search(s -> s
                .index(index)
                .query(Query.of(q -> q
                    .match(m -> m
                        .field(field)
                        .query(keyword)
                    )
                ))
                .from(from)
                .size(size)
                .highlight(h -> h
                    .fields(field, hf -> hf)
                )
            , Map.class);
            
            DocumentSearchResult result = new DocumentSearchResult();
            result.setTotal(response.hits().total().value());
            
            List<Map<String, Object>> documents = new ArrayList<>();
            for (Hit<Map> hit : response.hits().hits()) {
                Map<String, Object> doc = hit.source();
                if (hit.highlight().containsKey(field)) {
                    doc.put("highlight", hit.highlight().get(field));
                }
                documents.add(doc);
            }
            result.setDocuments(documents);
            
            return result;
        } catch (IOException e) {
            log.error("全文搜索失败: {}", e.getMessage());
            throw new RuntimeException("全文搜索失败", e);
        }
    }
    
    @Override
    public void deleteDocument(String index, String id) {
        try {
            client.delete(d -> d.index(index).id(id));
            log.debug("删除文档成功: index={}, id={}", index, id);
        } catch (IOException e) {
            log.error("删除文档失败: {}", e.getMessage());
            throw new RuntimeException("删除文档失败", e);
        }
    }
    
    // ==================== 告警检索 ====================
    
    @Override
    public void indexAlarm(AlarmDocument alarm) {
        try {
            String indexName = ALARM_INDEX + "-" + 
                alarm.getOccurTime().format(DateTimeFormatter.ofPattern("yyyy.MM"));
            
            client.index(i -> i
                .index(indexName)
                .id(alarm.getId())
                .document(alarm)
            );
            
            log.debug("索引告警成功: id={}", alarm.getId());
        } catch (IOException e) {
            log.error("索引告警失败: {}", e.getMessage());
            throw new RuntimeException("索引告警失败", e);
        }
    }
    
    @Override
    public AlarmSearchResult searchAlarms(AlarmSearchRequest request) {
        try {
            List<Query> mustQueries = new ArrayList<>();
            
            if (request.getVin() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("vin").value(request.getVin()))
                ));
            }
            
            if (request.getAlarmCode() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("alarmCode").value(request.getAlarmCode()))
                ));
            }
            
            if (request.getAlarmLevel() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("alarmLevel").value(request.getAlarmLevel()))
                ));
            }
            
            if (request.getStatus() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("status").value(request.getStatus()))
                ));
            }
            
            if (request.getTenantId() != null) {
                mustQueries.add(Query.of(q -> q
                    .term(t -> t.field("tenantId").value(request.getTenantId()))
                ));
            }
            
            SearchResponse<AlarmDocument> response = client.search(s -> s
                .index(ALARM_INDEX + "-*")
                .query(Query.of(q -> q.bool(b -> b.must(mustQueries))))
                .from(request.getFrom())
                .size(request.getSize())
                .sort(sort -> sort.field(f -> f.field("occurTime").order(SortOrder.Desc)))
            , AlarmDocument.class);
            
            AlarmSearchResult result = new AlarmSearchResult();
            result.setTotal(response.hits().total().value());
            
            List<AlarmDocument> alarms = new ArrayList<>();
            for (Hit<AlarmDocument> hit : response.hits().hits()) {
                alarms.add(hit.source());
            }
            result.setAlarms(alarms);
            
            return result;
        } catch (IOException e) {
            log.error("搜索告警失败: {}", e.getMessage());
            throw new RuntimeException("搜索告警失败", e);
        }
    }
    
    // ==================== 索引管理 ====================
    
    @Override
    public void createIndex(String index, Map<String, Object> mapping) {
        try {
            client.indices().create(c -> c
                .index(index)
                .mappings(m -> m
                    .properties(mapping)
                )
            );
            log.info("创建索引成功: index={}", index);
        } catch (IOException e) {
            log.error("创建索引失败: {}", e.getMessage());
            throw new RuntimeException("创建索引失败", e);
        }
    }
    
    @Override
    public void deleteIndex(String index) {
        try {
            client.indices().delete(d -> d.index(index));
            log.info("删除索引成功: index={}", index);
        } catch (IOException e) {
            log.error("删除索引失败: {}", e.getMessage());
            throw new RuntimeException("删除索引失败", e);
        }
    }
    
    @Override
    public boolean indexExists(String index) {
        try {
            return client.indices().exists(e -> e.index(index)).value();
        } catch (IOException e) {
            log.error("检查索引是否存在失败: {}", e.getMessage());
            return false;
        }
    }
    
    // ==================== 辅助方法 ====================
    
    private co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval convertInterval(String interval) {
        if (interval == null) {
            return co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval.Day;
        }
        
        switch (interval.toLowerCase()) {
            case "hour":
                return co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval.Hour;
            case "day":
                return co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval.Day;
            case "week":
                return co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval.Week;
            case "month":
                return co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval.Month;
            default:
                return co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval.Day;
        }
    }
}