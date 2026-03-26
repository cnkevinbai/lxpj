package com.daod.iov.modules.ota;

import java.util.*;
import com.daod.iov.modules.ota.entity.UpgradeTask;

/**
 * OTA升级策略接口
 */
public interface OtaStrategy {
    
    /**
     * 获取策略类型
     */
    String getType();
    
    /**
     * 获取策略名称
     */
    String getName();
    
    /**
     * 获取策略描述
     */
    String getDescription();
    
    /**
     * 执行升级
     */
    void execute(UpgradeTask task, UpgradeCallback callback) throws OtaException;
    
    /**
     * 检查兼容性
     */
    boolean isCompatible(String fromVersion, String toVersion);
    
    /**
     * 检查依赖
     */
    List<String> getDependencies(String version);
    
    /**
     * 获取升级区间
     */
    List<String> getUpgradeRange(String fromVersion, String toVersion);
    
    /**
     * 是否支持增量升级
     */
    boolean supportsIncremental();
    
    /**
     * 获取预计升级时间
     */
    long estimateUpgradeTime(String firmwareId, int vehicleCount);
}
