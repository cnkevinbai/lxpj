package com.daod.iov.modules.vehicleaccess.controller;

import com.daod.iov.modules.vehicleaccess.VehicleAccessModule;
import com.daod.iov.modules.vehicleaccess.VehicleAccessModule.VehicleSession;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 车辆接入控制器
 */
@RestController
@RequestMapping("/api/v1/vehicles")
public class VehicleAccessController {
    
    private final VehicleAccessModule vehicleAccessModule;
    
    public VehicleAccessController(VehicleAccessModule vehicleAccessModule) {
        this.vehicleAccessModule = vehicleAccessModule;
    }
    
    /**
     * 获取在线车辆列表
     */
    @GetMapping("/online")
    public Map<String, Object> getOnlineVehicles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        
        List<VehicleSession> sessions = vehicleAccessModule.getOnlineSessions();
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 0);
        result.put("message", "success");
        
        Map<String, Object> data = new HashMap<>();
        data.put("list", sessions.subList(0, Math.min(pageSize, sessions.size())));
        data.put("total", sessions.size());
        data.put("page", page);
        data.put("pageSize", pageSize);
        
        result.put("data", data);
        return result;
    }
    
    /**
     * 终端注册
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> request) {
        String terminalId = request.get("terminalId");
        String plateNo = request.get("plateNo");
        String deviceModel = request.get("deviceModel");
        
        boolean success = vehicleAccessModule.register(terminalId, plateNo, deviceModel);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "注册成功" : "注册失败");
        return result;
    }
    
    /**
     * 终端认证
     */
    @PostMapping("/auth")
    public Map<String, Object> authenticate(@RequestBody Map<String, String> request) {
        String terminalId = request.get("terminalId");
        String authCode = request.get("authCode");
        
        boolean success = vehicleAccessModule.authenticate(terminalId, authCode);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "认证成功" : "认证失败");
        return result;
    }
    
    /**
     * 心跳
     */
    @PostMapping("/heartbeat")
    public Map<String, Object> heartbeat(@RequestBody Map<String, String> request) {
        String terminalId = request.get("terminalId");
        vehicleAccessModule.heartbeat(terminalId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 0);
        result.put("message", "success");
        return result;
    }
    
    /**
     * 获取统计数据
     */
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 0);
        result.put("message", "success");
        
        Map<String, Object> data = new HashMap<>();
        data.put("onlineCount", vehicleAccessModule.getOnlineCount());
        data.put("sessionCount", vehicleAccessModule.getOnlineSessions().size());
        
        result.put("data", data);
        return result;
    }
}