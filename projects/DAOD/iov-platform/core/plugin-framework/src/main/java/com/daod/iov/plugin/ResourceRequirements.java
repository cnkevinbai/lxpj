package com.daod.iov.plugin;

/**
 * 资源需求定义
 * 用于沙箱资源配额控制
 */
public class ResourceRequirements {
    
    // ==================== CPU 资源 ====================
    
    private String cpuRequest;       // CPU 请求量 (如 "100m" = 0.1 核)
    private String cpuLimit;         // CPU 限制量 (如 "500m" = 0.5 核)
    
    // ==================== 内存资源 ====================
    
    private String memoryRequest;    // 内存请求量 (如 "128Mi")
    private String memoryLimit;      // 内存限制量 (如 "512Mi")
    
    // ==================== 网络资源 ====================
    
    private int maxConnections = 1000;        // 最大连接数
    private int maxConnectionsPerHost = 100;  // 单主机最大连接数
    private long maxBandwidth = -1;           // 最大带宽 (bytes/s, -1 表示无限制)
    
    // ==================== 存储资源 ====================
    
    private String diskRequest;      // 磁盘请求量 (如 "1Gi")
    private String diskLimit;        // 磁盘限制量
    private int maxFileDescriptors = 1024;  // 最大文件描述符数
    
    // ==================== 线程资源 ====================
    
    private int maxThreads = 200;    // 最大线程数
    private int maxThreadsPerCpu = 10; // 每 CPU 最大线程数
    
    // ==================== 执行资源 ====================
    
    private long executionTimeout = 30000;  // 执行超时 (ms)
    private int maxConcurrentRequests = 100; // 最大并发请求数
    
    public ResourceRequirements() {}
    
    /**
     * 创建默认资源需求
     */
    public static ResourceRequirements defaults() {
        return new ResourceRequirements()
            .cpuRequest("100m")
            .cpuLimit("500m")
            .memoryRequest("128Mi")
            .memoryLimit("256Mi");
    }
    
    /**
     * 创建小型资源需求
     */
    public static ResourceRequirements small() {
        return new ResourceRequirements()
            .cpuRequest("50m")
            .cpuLimit("200m")
            .memoryRequest("64Mi")
            .memoryLimit("128Mi")
            .maxConnections(100)
            .maxThreads(50);
    }
    
    /**
     * 创建大型资源需求
     */
    public static ResourceRequirements large() {
        return new ResourceRequirements()
            .cpuRequest("500m")
            .cpuLimit("2000m")
            .memoryRequest("512Mi")
            .memoryLimit("1Gi")
            .maxConnections(5000)
            .maxThreads(500);
    }
    
    // ==================== Builder 方法 ====================
    
    public ResourceRequirements cpuRequest(String cpuRequest) {
        this.cpuRequest = cpuRequest;
        return this;
    }
    
    public ResourceRequirements cpuLimit(String cpuLimit) {
        this.cpuLimit = cpuLimit;
        return this;
    }
    
    public ResourceRequirements memoryRequest(String memoryRequest) {
        this.memoryRequest = memoryRequest;
        return this;
    }
    
    public ResourceRequirements memoryLimit(String memoryLimit) {
        this.memoryLimit = memoryLimit;
        return this;
    }
    
    public ResourceRequirements maxConnections(int maxConnections) {
        this.maxConnections = maxConnections;
        return this;
    }
    
    public ResourceRequirements maxThreads(int maxThreads) {
        this.maxThreads = maxThreads;
        return this;
    }
    
    // ==================== Getters and Setters ====================
    
    public String getCpuRequest() { return cpuRequest; }
    public void setCpuRequest(String cpuRequest) { this.cpuRequest = cpuRequest; }
    
    public String getCpuLimit() { return cpuLimit; }
    public void setCpuLimit(String cpuLimit) { this.cpuLimit = cpuLimit; }
    
    public String getMemoryRequest() { return memoryRequest; }
    public void setMemoryRequest(String memoryRequest) { this.memoryRequest = memoryRequest; }
    
    public String getMemoryLimit() { return memoryLimit; }
    public void setMemoryLimit(String memoryLimit) { this.memoryLimit = memoryLimit; }
    
    public int getMaxConnections() { return maxConnections; }
    public void setMaxConnections(int maxConnections) { this.maxConnections = maxConnections; }
    
    public int getMaxConnectionsPerHost() { return maxConnectionsPerHost; }
    public void setMaxConnectionsPerHost(int maxConnectionsPerHost) { this.maxConnectionsPerHost = maxConnectionsPerHost; }
    
    public long getMaxBandwidth() { return maxBandwidth; }
    public void setMaxBandwidth(long maxBandwidth) { this.maxBandwidth = maxBandwidth; }
    
    public String getDiskRequest() { return diskRequest; }
    public void setDiskRequest(String diskRequest) { this.diskRequest = diskRequest; }
    
    public String getDiskLimit() { return diskLimit; }
    public void setDiskLimit(String diskLimit) { this.diskLimit = diskLimit; }
    
    public int getMaxFileDescriptors() { return maxFileDescriptors; }
    public void setMaxFileDescriptors(int maxFileDescriptors) { this.maxFileDescriptors = maxFileDescriptors; }
    
    public int getMaxThreads() { return maxThreads; }
    public void setMaxThreads(int maxThreads) { this.maxThreads = maxThreads; }
    
    public int getMaxThreadsPerCpu() { return maxThreadsPerCpu; }
    public void setMaxThreadsPerCpu(int maxThreadsPerCpu) { this.maxThreadsPerCpu = maxThreadsPerCpu; }
    
    public long getExecutionTimeout() { return executionTimeout; }
    public void setExecutionTimeout(long executionTimeout) { this.executionTimeout = executionTimeout; }
    
    public int getMaxConcurrentRequests() { return maxConcurrentRequests; }
    public void setMaxConcurrentRequests(int maxConcurrentRequests) { this.maxConcurrentRequests = maxConcurrentRequests; }
}