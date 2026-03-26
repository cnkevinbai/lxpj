package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 绑定统计信息
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class BindingStatistics {
    
    /** 绑定总数 */
    private long totalBindings;
    
    /** 在线设备数 */
    private long onlineDevices;
    
    /** 离线设备数 */
    private long offlineDevices;
    
    /** JT/T 808 绑定数 */
    private long jtt808Bindings;
    
    /** MQTT 绑定数 */
    private long mqttBindings;
    
    /** HTTP 绑定数 */
    private long httpBindings;
    
    /** 待确认绑定数 */
    private long pendingBindings;
    
    /** 异常绑定数 */
    private long errorBindings;
    
    /** 今日新增绑定数 */
    private long todayNewBindings;
    
    /** 今日解绑数 */
    private long todayUnbindings;
    
    /** 绑定成功率 (%) */
    private double successRate;
    
    /** 平均绑定耗时 (ms) */
    private double avgBindDuration;
    
    // ==================== 计算方法 ====================
    
    /**
     * 获取在线率
     */
    public double getOnlineRate() {
        if (totalBindings == 0) {
            return 0;
        }
        return (double) onlineDevices / totalBindings * 100;
    }
    
    /**
     * 获取离线率
     */
    public double getOfflineRate() {
        if (totalBindings == 0) {
            return 0;
        }
        return (double) offlineDevices / totalBindings * 100;
    }
    
    // ==================== Getters and Setters ====================
    
    public long getTotalBindings() {
        return totalBindings;
    }
    
    public void setTotalBindings(long totalBindings) {
        this.totalBindings = totalBindings;
    }
    
    public long getOnlineDevices() {
        return onlineDevices;
    }
    
    public void setOnlineDevices(long onlineDevices) {
        this.onlineDevices = onlineDevices;
    }
    
    public long getOfflineDevices() {
        return offlineDevices;
    }
    
    public void setOfflineDevices(long offlineDevices) {
        this.offlineDevices = offlineDevices;
    }
    
    public long getJtt808Bindings() {
        return jtt808Bindings;
    }
    
    public void setJtt808Bindings(long jtt808Bindings) {
        this.jtt808Bindings = jtt808Bindings;
    }
    
    public long getMqttBindings() {
        return mqttBindings;
    }
    
    public void setMqttBindings(long mqttBindings) {
        this.mqttBindings = mqttBindings;
    }
    
    public long getHttpBindings() {
        return httpBindings;
    }
    
    public void setHttpBindings(long httpBindings) {
        this.httpBindings = httpBindings;
    }
    
    public long getPendingBindings() {
        return pendingBindings;
    }
    
    public void setPendingBindings(long pendingBindings) {
        this.pendingBindings = pendingBindings;
    }
    
    public long getErrorBindings() {
        return errorBindings;
    }
    
    public void setErrorBindings(long errorBindings) {
        this.errorBindings = errorBindings;
    }
    
    public long getTodayNewBindings() {
        return todayNewBindings;
    }
    
    public void setTodayNewBindings(long todayNewBindings) {
        this.todayNewBindings = todayNewBindings;
    }
    
    public long getTodayUnbindings() {
        return todayUnbindings;
    }
    
    public void setTodayUnbindings(long todayUnbindings) {
        this.todayUnbindings = todayUnbindings;
    }
    
    public double getSuccessRate() {
        return successRate;
    }
    
    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }
    
    public double getAvgBindDuration() {
        return avgBindDuration;
    }
    
    public void setAvgBindDuration(double avgBindDuration) {
        this.avgBindDuration = avgBindDuration;
    }
}