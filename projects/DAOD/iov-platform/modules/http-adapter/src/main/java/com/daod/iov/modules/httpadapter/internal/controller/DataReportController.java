package com.daod.iov.modules.httpadapter.internal.controller;

import com.daod.iov.modules.httpadapter.api.HttpAdapterService;
import com.daod.iov.modules.httpadapter.api.dto.*;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 数据上报控制器
 * 
 * 提供终端设备 HTTP 方式数据上报 API
 */
@RestController
@RequestMapping("/api/v1")
public class DataReportController {
    
    @Resource
    private HttpAdapterService httpAdapterService;
    
    /**
     * 终端数据上报
     * 
     * POST /api/v1/terminal/{terminalId}/data
     */
    @PostMapping("/terminal/{terminalId}/data")
    public DataReportResult reportData(
            @PathVariable String terminalId,
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody DataReportRequest request) {
        
        // 设置终端 ID
        request.setTerminalId(terminalId);
        
        // 设置默认时间戳
        if (request.getTimestamp() == null) {
            request.setTimestamp(System.currentTimeMillis());
        }
        
        return httpAdapterService.handleDataReport(request);
    }
    
    /**
     * 批量数据上报
     * 
     * POST /api/v1/terminal/{terminalId}/data/batch
     */
    @PostMapping("/terminal/{terminalId}/data/batch")
    public BatchReportResult reportBatch(
            @PathVariable String terminalId,
            @RequestBody BatchReportRequest request) {
        
        request.setTerminalId(terminalId);
        return httpAdapterService.handleBatchReport(request);
    }
    
    /**
     * 位置上报
     * 
     * POST /api/v1/terminal/{terminalId}/position
     */
    @PostMapping("/terminal/{terminalId}/position")
    public PositionReportResult reportPosition(
            @PathVariable String terminalId,
            @RequestBody PositionReportRequest request) {
        
        request.setTerminalId(terminalId);
        if (request.getTimestamp() == null) {
            request.setTimestamp(System.currentTimeMillis());
        }
        
        return httpAdapterService.handlePositionReport(request);
    }
    
    /**
     * 心跳上报
     * 
     * POST /api/v1/terminal/{terminalId}/heartbeat
     */
    @PostMapping("/terminal/{terminalId}/heartbeat")
    public HeartbeatResult heartbeat(
            @PathVariable String terminalId,
            @RequestBody(required = false) HeartbeatRequest request) {
        
        HeartbeatResult result = new HeartbeatResult();
        result.setSuccess(true);
        result.setServerTime(System.currentTimeMillis());
        result.setNextInterval(30);
        return result;
    }
}