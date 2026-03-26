package com.daod.iov.modules.planning.internal.service;

import com.daod.iov.modules.planning.api.dto.*;

/**
 * 行程规划服务实现
 */
public class TripPlannerImpl implements TripPlanner {
    
    private final OrToolsSolver orToolsSolver;
    private final RoutePlanner routePlanner;
    
    public TripPlannerImpl(OrToolsSolver orToolsSolver, RoutePlanner routePlanner) {
        this.orToolsSolver = orToolsSolver;
        this.routePlanner = routePlanner;
    }
    
    @Override
    public TripPlanResult plan(TripPlanRequest request) throws PlanningException {
        // 构建 TSP 问题并求解
        return orToolsSolver.solveTSP(request);
    }
    
    @Override
    public java.util.List<TripPlanResult> batchPlan(java.util.List<TripPlanRequest> requests) {
        java.util.List<TripPlanResult> results = new java.util.ArrayList<>();
        for (TripPlanRequest request : requests) {
            try {
                results.add(plan(request));
            } catch (PlanningException e) {
                results.add(null);
            }
        }
        return results;
    }
    
    @Override
    public TripDurationEstimation estimateDuration(TripPlanRequest request) {
        // 简化实现：基于直线距离估算
        double totalDistance = 0;
        GeoPoint prev = request.getOrigin();
        
        for (TripWaypoint wp : request.getWaypoints()) {
            totalDistance += prev.distanceTo(wp.getLocation());
            prev = wp.getLocation();
        }
        totalDistance += prev.distanceTo(request.getDestination());
        
        TripDurationEstimation estimation = new TripDurationEstimation();
        estimation.setEstimatedDuration(totalDistance / 50.0); // 假设 50 m/s
        estimation.setDistance(totalDistance);
        
        return estimation;
    }
}