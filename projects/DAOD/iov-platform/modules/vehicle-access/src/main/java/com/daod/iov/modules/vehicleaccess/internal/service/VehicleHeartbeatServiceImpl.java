package com.daod.iov.modules.vehicleaccess.internal.service;

import com.daod.iov.modules.vehicleaccess.api.VehicleHeartbeatService;
import com.daod.iov.modules.vehicleaccess.api.dto.HeartbeatData;
import com.daod.iov.modules.vehicleaccess.api.dto.HeartbeatResult;
import com.daod.iov.modules.vehicleaccess.api.dto.OnlineStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 心跳管理服务实现
 */
public class VehicleHeartbeatServiceImpl implements VehicleHeartbeatService {
    
    private static final Logger log = LoggerFactory.getLogger(VehicleHeartbeatServiceImpl.class);
    
    /** 心跳记录 */
    private final Map<String, Instant> lastHeartbeatMap = new ConcurrentHashMap<>();
    
    /** 心跳数据 */
    private final Map<String, HeartbeatData> heartbeatDataMap = new ConcurrentHashMap<>();
    
    /** 心跳超时时间 (5分钟) */
    private long timeoutMs = 5 * 60 * 1000;
    
    @Override
    public HeartbeatResult receiveHeartbeat(String vin, HeartbeatData data) {
        log.debug("收到心跳: vin={}", vin);
        
        Instant now = Instant.now();
        lastHeartbeatMap.put(vin, now);
        
        if (data != null) {
            heartbeatDataMap.put(vin, data);
        }
        
        HeartbeatResult result = HeartbeatResult.success();
        result.setServerTime(now);
        result.setNextHeartbeatInterval(30);
        
        return result;
    }
    
    @Override
    public long getLastHeartbeatTime(String vin) {
        Instant lastTime = lastHeartbeatMap.get(vin);
        return lastTime != null ? lastTime.toEpochMilli() : 0L;
    }
    
    @Override
    public List<String> checkTimeout() {
        List<String> timeoutVins = new ArrayList<>();
        Instant now = Instant.now();
        long timeoutEpochMs = now.toEpochMilli() - timeoutMs;
        
        for (Map.Entry<String, Instant> entry : lastHeartbeatMap.entrySet()) {
            if (entry.getValue().toEpochMilli() < timeoutEpochMs) {
                timeoutVins.add(entry.getKey());
            }
        }
        
        if (!timeoutVins.isEmpty()) {
            log.info("检测到 {} 辆车心跳超时", timeoutVins.size());
        }
        
        return timeoutVins;
    }
    
    @Override
    public OnlineStatus getOnlineStatus(String vin) {
        Instant lastTime = lastHeartbeatMap.get(vin);
        
        OnlineStatus status = new OnlineStatus();
        status.setTerminalId(vin);
        
        if (lastTime == null) {
            status.setOnline(false);
            status.setOfflineReason("从未上线");
            return status;
        }
        
        long elapsed = Instant.now().toEpochMilli() - lastTime.toEpochMilli();
        status.setLastOnlineTime(lastTime.toEpochMilli());
        
        if (elapsed > timeoutMs) {
            status.setOnline(false);
            status.setOfflineReason("心跳超时");
            status.setLastOfflineTime(Instant.now().toEpochMilli());
        } else {
            status.setOnline(true);
            status.setOnlineDuration(elapsed / 1000);
        }
        
        return status;
    }
}