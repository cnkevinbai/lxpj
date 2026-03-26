package com.daod.iov.modules.planning.api;

import com.daod.iov.modules.planning.api.dto.*;
import java.util.List;

/**
 * 资源推荐服务接口
 * 
 * 智能推荐充电站、加油站、服务区等资源点
 */
public interface ResourceRecommender {
    
    /**
     * 推荐资源点
     * 
     * @param request 推荐请求
     * @return 推荐结果
     */
    ResourceRecommendResult recommend(ResourceRecommendRequest request);
    
    /**
     * 搜索资源点
     * 
     * @param request 搜索请求
     * @return 资源点列表
     */
    List<ResourcePoint> search(ResourceSearchRequest request);
    
    /**
     * 获取资源点详情
     * 
     * @param resourceId 资源点ID
     * @return 资源点详情
     */
    ResourcePoint getDetail(String resourceId);
    
    /**
     * 批量获取资源点详情
     * 
     * @param resourceIds 资源点ID列表
     * @return 资源点列表
     */
    List<ResourcePoint> batchGetDetails(List<String> resourceIds);
}