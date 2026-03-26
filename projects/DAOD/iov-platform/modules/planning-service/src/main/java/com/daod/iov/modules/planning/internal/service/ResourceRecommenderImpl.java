package com.daod.iov.modules.planning.internal.service;

import com.daod.iov.modules.planning.api.dto.*;

/**
 * 资源推荐服务实现
 */
public class ResourceRecommenderImpl implements ResourceRecommender {
    
    private final RoutePlanner routePlanner;
    
    public ResourceRecommenderImpl(RoutePlanner routePlanner) {
        this.routePlanner = routePlanner;
    }
    
    @Override
    public ResourceRecommendResult recommend(ResourceRecommendRequest request) {
        // 搜索附近资源点
        java.util.List<ResourcePoint> candidates = searchNearby(
            request.getCurrentLocation(),
            request.getSearchRadius(),
            request.getResourceType()
        );
        
        // 排序并返回
        candidates.sort((a, b) -> {
            double distA = request.getCurrentLocation().distanceTo(a.getLocation());
            double distB = request.getCurrentLocation().distanceTo(b.getLocation());
            return Double.compare(distA, distB);
        });
        
        // 限制返回数量
        if (candidates.size() > request.getLimit()) {
            candidates = candidates.subList(0, request.getLimit());
        }
        
        ResourceRecommendResult result = new ResourceRecommendResult();
        result.setCandidates(candidates);
        result.setTotalFound(candidates.size());
        
        return result;
    }
    
    @Override
    public java.util.List<ResourcePoint> search(ResourceSearchRequest request) {
        return searchNearby(request.getLocation(), request.getRadius(), request.getType());
    }
    
    @Override
    public ResourcePoint getDetail(String resourceId) {
        // 查询资源点详情
        return null;
    }
    
    @Override
    public java.util.List<ResourcePoint> batchGetDetails(java.util.List<String> resourceIds) {
        java.util.List<ResourcePoint> results = new java.util.ArrayList<>();
        for (String id : resourceIds) {
            results.add(getDetail(id));
        }
        return results;
    }
    
    private java.util.List<ResourcePoint> searchNearby(GeoPoint center, double radius, ResourceType type) {
        // 简化实现：返回模拟数据
        java.util.List<ResourcePoint> results = new java.util.ArrayList<>();
        
        // 实际实现需要查询数据库或第三方 API
        ResourcePoint mock = new ResourcePoint();
        mock.setId("mock-1");
        mock.setName("模拟充电站");
        mock.setLocation(new GeoPoint(center.getLat() + 0.01, center.getLng() + 0.01));
        mock.setType(type);
        mock.setRating(4.5);
        mock.setDistance(center.distanceTo(mock.getLocation()));
        
        results.add(mock);
        
        return results;
    }
}