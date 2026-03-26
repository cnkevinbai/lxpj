package com.daod.iov.modules.ota.api;

import com.daod.iov.modules.ota.api.dto.*;
import java.util.List;

/**
 * OTA 升级服务接口
 */
public interface OtaService {
    
    /**
     * 创建升级任务
     */
    OtaTask createTask(OtaTaskCreateRequest request);
    
    /**
     * 获取任务列表
     */
    List<OtaTask> getTaskList(String tenantId);
    
    /**
     * 获取任务详情
     */
    OtaTask getTaskDetail(String taskId);
    
    /**
     * 取消任务
     */
    void cancelTask(String taskId);
    
    /**
     * 上传固件
     */
    FirmwareInfo uploadFirmware(FirmwareUploadRequest request);
    
    /**
     * 获取固件列表
     */
    List<FirmwareInfo> getFirmwareList(String deviceModel);
    
    /**
     * 获取任务进度
     */
    OtaProgress getProgress(String taskId);
}