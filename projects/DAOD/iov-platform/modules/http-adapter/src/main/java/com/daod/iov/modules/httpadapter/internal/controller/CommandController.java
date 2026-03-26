package com.daod.iov.modules.httpadapter.internal.controller;

import com.daod.iov.modules.httpadapter.api.HttpAdapterService;
import com.daod.iov.modules.httpadapter.api.dto.*;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 指令控制器
 * 
 * 提供终端设备 HTTP 方式获取和响应指令的 API
 */
@RestController
@RequestMapping("/api/v1")
public class CommandController {
    
    @Resource
    private HttpAdapterService httpAdapterService;
    
    /**
     * 获取待执行指令
     * 
     * GET /api/v1/terminal/{terminalId}/commands
     */
    @GetMapping("/terminal/{terminalId}/commands")
    public CommandListResult getCommands(
            @PathVariable String terminalId,
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        
        return httpAdapterService.getPendingCommands(terminalId);
    }
    
    /**
     * 长轮询获取指令
     * 
     * GET /api/v1/terminal/{terminalId}/commands/poll
     */
    @GetMapping("/terminal/{terminalId}/commands/poll")
    public CommandListResult pollCommands(
            @PathVariable String terminalId,
            @RequestParam(value = "timeout", defaultValue = "30") int timeout) {
        
        CommandListResult result = httpAdapterService.getPendingCommands(terminalId);
        result.setPollInterval(timeout * 1000L);
        return result;
    }
    
    /**
     * 上报指令执行结果
     * 
     * POST /api/v1/terminal/{terminalId}/command/{commandId}/result
     */
    @PostMapping("/terminal/{terminalId}/command/{commandId}/result")
    public CommandResultReport reportResult(
            @PathVariable String terminalId,
            @PathVariable String commandId,
            @RequestBody CommandResultReportRequest request) {
        
        request.setTerminalId(terminalId);
        request.setCommandId(commandId);
        
        return httpAdapterService.reportCommandResult(request);
    }
    
    /**
     * 确认指令接收
     * 
     * POST /api/v1/terminal/{terminalId}/command/{commandId}/ack
     */
    @PostMapping("/terminal/{terminalId}/command/{commandId}/ack")
    public AckResult ackCommand(
            @PathVariable String terminalId,
            @PathVariable String commandId) {
        
        AckResult result = new AckResult();
        result.setSuccess(true);
        result.setMessage("指令已确认");
        return result;
    }
}