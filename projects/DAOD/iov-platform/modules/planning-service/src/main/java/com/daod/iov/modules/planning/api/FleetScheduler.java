package com.daod.iov.modules.planning.api;

import com.daod.iov.modules.planning.api.dto.*;
import java.util.List;

/**
 * 车队调度服务接口
 * 
 * 解决 VRP 问题，将任务最优分配给车辆
 */
public interface FleetScheduler {
    
    /**
     * 执行车队调度
     * 
     * @param request 调度请求
     * @return 调度结果
     * @throws PlanningException 调度失败
     */
    FleetScheduleResult schedule(FleetScheduleRequest request) throws PlanningException;
    
    /**
     * 重新调度
     * 
     * @param scheduleId 原调度ID
     * @param options 重调度选项
     * @return 新调度结果
     */
    FleetScheduleResult reschedule(String scheduleId, RescheduleOptions options);
    
    /**
     * 获取调度方案
     * 
     * @param scheduleId 调度ID
     * @return 调度结果
     */
    FleetScheduleResult getSchedule(String scheduleId);
    
    /**
     * 取消调度
     * 
     * @param scheduleId 调度ID
     */
    void cancelSchedule(String scheduleId);
}