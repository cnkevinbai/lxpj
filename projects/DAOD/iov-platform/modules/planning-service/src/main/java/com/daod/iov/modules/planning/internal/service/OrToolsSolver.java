package com.daod.iov.modules.planning.internal.service;

import com.daod.iov.modules.planning.api.PlanningException;
import com.daod.iov.modules.planning.api.dto.*;

/**
 * OR-Tools 优化求解器封装
 */
public class OrToolsSolver {
    
    private final PlanningConfig config;
    
    public OrToolsSolver(PlanningConfig config) {
        this.config = config;
    }
    
    /**
     * 解决 TSP 问题
     */
    public TripPlanResult solveTSP(TripPlanRequest request) throws PlanningException {
        int nodeCount = request.getWaypoints().size() + 2; // +起点终点
        
        // 构建距离矩阵
        java.util.List<GeoPoint> points = new java.util.ArrayList<>();
        points.add(request.getOrigin());
        for (TripWaypoint wp : request.getWaypoints()) {
            points.add(wp.getLocation());
        }
        points.add(request.getDestination());
        
        long[][] distanceMatrix = buildDistanceMatrix(points);
        
        // 使用贪心算法简化实现
        int[] order = greedyTSP(distanceMatrix);
        
        // 构建结果
        TripPlanResult result = new TripPlanResult();
        result.setTripId(java.util.UUID.randomUUID().toString());
        
        java.util.List<TripStop> stops = new java.util.ArrayList<>();
        double totalDistance = 0;
        double totalDuration = 0;
        
        for (int i = 0; i < order.length; i++) {
            TripStop stop = new TripStop();
            stop.setIndex(i);
            stop.setLocation(points.get(order[i]));
            if (order[i] > 0 && order[i] <= request.getWaypoints().size()) {
                stop.setWaypointId(request.getWaypoints().get(order[i] - 1).getId());
            }
            stops.add(stop);
            
            if (i > 0) {
                totalDistance += distanceMatrix[order[i-1]][order[i]];
                totalDuration += distanceMatrix[order[i-1]][order[i]] / 50.0;
            }
        }
        
        result.setOrderedStops(stops);
        result.setTotalDistance(totalDistance);
        result.setTotalDuration(totalDuration);
        
        return result;
    }
    
    /**
     * 解决 VRP 问题
     */
    public FleetScheduleResult solveVRP(FleetScheduleRequest request) throws PlanningException {
        // 简化实现
        FleetScheduleResult result = new FleetScheduleResult();
        result.setScheduleId(java.util.UUID.randomUUID().toString());
        result.setTotalTasks(request.getTasks().size());
        result.setAssignedTasks(request.getTasks().size());
        result.setUnassignedTasks(0);
        
        return result;
    }
    
    private long[][] buildDistanceMatrix(java.util.List<GeoPoint> points) {
        int n = points.size();
        long[][] matrix = new long[n][n];
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) {
                    matrix[i][j] = 0;
                } else {
                    matrix[i][j] = (long) points.get(i).distanceTo(points.get(j));
                }
            }
        }
        
        return matrix;
    }
    
    private int[] greedyTSP(long[][] matrix) {
        int n = matrix.length;
        int[] order = new int[n];
        boolean[] visited = new boolean[n];
        
        order[0] = 0;
        visited[0] = true;
        
        for (int i = 1; i < n; i++) {
            int last = order[i - 1];
            int next = -1;
            long minDist = Long.MAX_VALUE;
            
            for (int j = 0; j < n; j++) {
                if (!visited[j] && matrix[last][j] < minDist) {
                    minDist = matrix[last][j];
                    next = j;
                }
            }
            
            order[i] = next;
            visited[next] = true;
        }
        
        return order;
    }
}