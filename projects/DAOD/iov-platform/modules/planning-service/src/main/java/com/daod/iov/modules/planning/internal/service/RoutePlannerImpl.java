package com.daod.iov.modules.planning.internal.service;

import com.daod.iov.modules.planning.api.*;
import com.daod.iov.modules.planning.api.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 路径规划服务实现
 */
public class RoutePlannerImpl implements RoutePlanner {
    
    private static final Logger log = LoggerFactory.getLogger(RoutePlannerImpl.class);
    
    private final GraphHopperEngine graphHopperEngine;
    private final PlanningConfig config;
    private final RouteCacheService cacheService;
    
    private final AtomicBoolean running = new AtomicBoolean(false);
    
    public RoutePlannerImpl(GraphHopperEngine graphHopperEngine, PlanningConfig config) {
        this.graphHopperEngine = graphHopperEngine;
        this.config = config;
        this.cacheService = new RouteCacheService(config);
    }
    
    public void start() {
        running.set(true);
        log.info("路径规划服务启动");
    }
    
    public void stop() {
        running.set(false);
        log.info("路径规划服务停止");
    }
    
    @Override
    public RoutePlanResult plan(RoutePlanRequest request) throws PlanningException {
        validateRequest(request);
        
        long startTime = System.currentTimeMillis();
        
        // 检查缓存
        String cacheKey = buildCacheKey(request);
        RoutePlanResult cached = cacheService.get(cacheKey);
        if (cached != null) {
            cached.setFromCache(true);
            return cached;
        }
        
        // 执行规划
        RoutePlanResult result = doPlan(request);
        
        // 缓存结果
        result.setPlanningTimeMs(System.currentTimeMillis() - startTime);
        cacheService.put(cacheKey, result);
        
        return result;
    }
    
    @Override
    public List<RoutePlanResult> batchPlan(List<RoutePlanRequest> requests) {
        List<RoutePlanResult> results = new ArrayList<>();
        for (RoutePlanRequest request : requests) {
            try {
                results.add(plan(request));
            } catch (PlanningException e) {
                log.warn("批量规划失败: {}", e.getMessage());
                results.add(null);
            }
        }
        return results;
    }
    
    @Override
    public long[][] computeDistanceMatrix(List<GeoPoint> points) {
        int n = points.size();
        long[][] matrix = new long[n][n];
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) {
                    matrix[i][j] = 0;
                } else {
                    // 使用直线距离作为近似
                    matrix[i][j] = (long) points.get(i).distanceTo(points.get(j));
                }
            }
        }
        
        return matrix;
    }
    
    @Override
    public boolean isReady() {
        return running.get() && graphHopperEngine != null && graphHopperEngine.isReady();
    }
    
    @Override
    public List<RouteStrategy> getSupportedStrategies() {
        return Arrays.asList(RouteStrategy.values());
    }
    
    // ==================== 私有方法 ====================
    
    private void validateRequest(RoutePlanRequest request) throws PlanningException {
        if (request.getOrigin() == null || request.getDestination() == null) {
            throw new PlanningException(PlanningException.INVALID_REQUEST, 
                "起点和终点不能为空");
        }
    }
    
    private String buildCacheKey(RoutePlanRequest request) {
        return String.format("%s-%s-%s-%s",
            request.getOrigin(),
            request.getDestination(),
            request.getStrategy(),
            request.getVehicleType()
        );
    }
    
    private RoutePlanResult doPlan(RoutePlanRequest request) throws PlanningException {
        // 调用 GraphHopper 引擎
        Route route = graphHopperEngine.route(
            request.getOrigin(),
            request.getDestination(),
            request.getStrategy(),
            request.getVehicleType()
        );
        
        if (route == null) {
            throw new PlanningException(PlanningException.NO_ROUTE, "无法找到可行路径");
        }
        
        RoutePlanResult result = new RoutePlanResult();
        result.setPlanId(UUID.randomUUID().toString());
        result.setRoutes(List.of(route));
        result.setMapVersion(graphHopperEngine.getMapVersion());
        
        return result;
    }
}