package com.daod.iov.modules.ota.api.dto;

/**
 * OTA 进度
 */
public class OtaProgress {
    private String taskId;
    private double progress;
    private int completedCount;
    private int totalCount;
    private String currentDevice;
    
    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }
    public double getProgress() { return progress; }
    public void setProgress(double progress) { this.progress = progress; }
    public int getCompletedCount() { return completedCount; }
    public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }
    public int getTotalCount() { return totalCount; }
    public void setTotalCount(int totalCount) { this.totalCount = totalCount; }
    public String getCurrentDevice() { return currentDevice; }
    public void setCurrentDevice(String currentDevice) { this.currentDevice = currentDevice; }
}