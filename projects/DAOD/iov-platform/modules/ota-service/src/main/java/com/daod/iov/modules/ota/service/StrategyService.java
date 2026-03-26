package com.daod.iov.modules.ota.service;

import com.daod.iov.modules.ota.*;
import com.daod.iov.modules.ota.entity.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

/**
 * 策略服务
 */
public class StrategyService {
    private final Map<String, OtaStrategy> strategies = new ConcurrentHashMap<>();
    
    public StrategyService() {
        registerStrategy(new FullStrategy());
        registerStrategy(new IncrementalStrategy());
        registerStrategy(new DifferentialStrategy());
    }
    
    public void registerStrategy(OtaStrategy strategy) {
        strategies.put(strategy.getType(), strategy);
    }
    
    public OtaStrategy getStrategy(String strategyType) {
        return strategies.get(strategyType);
    }
    
    public List<OtaStrategy> getAllStrategies() {
        return new ArrayList<>(strategies.values());
    }
    
    public boolean supportsStrategy(String strategyType) {
        return strategies.containsKey(strategyType);
    }
    
    // 默认策略实现
    public static class FullStrategy implements OtaStrategy {
        @Override
        public String getType() { return "full"; }
        @Override
        public String getName() { return "全量升级"; }
        @Override
        public String getDescription() { return "全量固件升级，适用于首次升级或重大版本更新"; }
        
        @Override
        public void execute(UpgradeTask task, UpgradeCallback callback) throws OtaException {
            System.out.println("执行全量升级策略");
        }
        
        @Override
        public boolean isCompatible(String fromVersion, String toVersion) {
            return true;
        }
        
        @Override
        public List<String> getDependencies(String version) {
            return new ArrayList<>();
        }
        
        @Override
        public List<String> getUpgradeRange(String fromVersion, String toVersion) {
            return new ArrayList<>();
        }
        
        @Override
        public boolean supportsIncremental() {
            return false;
        }
        
        @Override
        public long estimateUpgradeTime(String firmwareId, int vehicleCount) {
            return 300000L * vehicleCount;
        }
    }
    
    public static class IncrementalStrategy implements OtaStrategy {
        @Override
        public String getType() { return "incremental"; }
        @Override
        public String getName() { return "增量升级"; }
        @Override
        public String getDescription() { return "增量固件升级，仅传输变更的固件部分"; }
        
        @Override
        public void execute(UpgradeTask task, UpgradeCallback callback) throws OtaException {
            System.out.println("执行增量升级策略");
        }
        
        @Override
        public boolean isCompatible(String fromVersion, String toVersion) {
            return true;
        }
        
        @Override
        public List<String> getDependencies(String version) {
            return new ArrayList<>();
        }
        
        @Override
        public List<String> getUpgradeRange(String fromVersion, String toVersion) {
            return new ArrayList<>();
        }
        
        @Override
        public boolean supportsIncremental() {
            return true;
        }
        
        @Override
        public long estimateUpgradeTime(String firmwareId, int vehicleCount) {
            return 120000L * vehicleCount;
        }
    }
    
    public static class DifferentialStrategy implements OtaStrategy {
        @Override
        public String getType() { return "differential"; }
        @Override
        public String getName() { return "差分升级"; }
        @Override
        public String getDescription() { return "差分固件升级，生成从基线版本到目标版本的差分包"; }
        
        @Override
        public void execute(UpgradeTask task, UpgradeCallback callback) throws OtaException {
            System.out.println("执行差分升级策略");
        }
        
        @Override
        public boolean isCompatible(String fromVersion, String toVersion) {
            return true;
        }
        
        @Override
        public List<String> getDependencies(String version) {
            return new ArrayList<>();
        }
        
        @Override
        public List<String> getUpgradeRange(String fromVersion, String toVersion) {
            return new ArrayList<>();
        }
        
        @Override
        public boolean supportsIncremental() {
            return true;
        }
        
        @Override
        public long estimateUpgradeTime(String firmwareId, int vehicleCount) {
            return 180000L * vehicleCount;
        }
    }
}
