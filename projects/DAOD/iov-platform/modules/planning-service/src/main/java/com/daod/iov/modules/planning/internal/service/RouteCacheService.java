package com.daod.iov.modules.planning.internal.service;

import com.daod.iov.modules.planning.api.dto.RoutePlanResult;
import java.util.concurrent.*;

/**
 * 路径缓存服务
 */
public class RouteCacheService {
    
    private final Cache<String, RoutePlanResult> cache;
    private final PlanningConfig config;
    
    public RouteCacheService(PlanningConfig config) {
        this.config = config;
        this.cache = Caffeine.newBuilder()
            .maximumSize(config.getCacheMaxSize())
            .expireAfterWrite(config.getCacheTtlMinutes(), TimeUnit.MINUTES)
            .build();
    }
    
    public RoutePlanResult get(String key) {
        return cache.getIfPresent(key);
    }
    
    public void put(String key, RoutePlanResult result) {
        cache.put(key, result);
    }
    
    public void invalidate(String key) {
        cache.invalidate(key);
    }
    
    public void clear() {
        cache.invalidateAll();
    }
    
    public long size() {
        return cache.estimatedSize();
    }
}