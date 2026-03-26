package com.daod.iov.plugin;

/**
 * 模块权限定义
 * 用于沙箱安全控制
 */
public enum Permission {
    
    // ==================== 文件系统权限 ====================
    
    /** 文件读取 */
    FILE_READ("file.read", "文件读取"),
    
    /** 文件写入 */
    FILE_WRITE("file.write", "文件写入"),
    
    /** 文件删除 */
    FILE_DELETE("file.delete", "文件删除"),
    
    /** 文件执行 */
    FILE_EXECUTE("file.execute", "文件执行"),
    
    // ==================== 网络权限 ====================
    
    /** 网络连接 (出站) */
    NETWORK_CONNECT("network.connect", "网络连接"),
    
    /** 网络监听 (入站) */
    NETWORK_BIND("network.bind", "网络监听"),
    
    /** 多播 */
    NETWORK_MULTICAST("network.multicast", "多播"),
    
    /** HTTP 客户端 */
    HTTP_CLIENT("http.client", "HTTP客户端"),
    
    /** HTTP 服务端 */
    HTTP_SERVER("http.server", "HTTP服务端"),
    
    // ==================== 系统权限 ====================
    
    /** 创建进程 */
    SYSTEM_PROCESS("system.process", "创建进程"),
    
    /** 访问环境变量 */
    SYSTEM_ENVIRONMENT("system.environment", "访问环境变量"),
    
    /** 访问系统属性 */
    SYSTEM_PROPERTY("system.property", "访问系统属性"),
    
    /** 关闭系统 */
    SYSTEM_SHUTDOWN("system.shutdown", "关闭系统"),
    
    // ==================== JVM 权限 ====================
    
    /** 创建类加载器 */
    CLASSLOADER_CREATE("classloader.create", "创建类加载器"),
    
    /** 反射访问 */
    REFLECTION_ACCESS("reflection.access", "反射访问"),
    
    /** 加载本地库 */
    NATIVE_CODE("native.code", "加载本地库"),
    
    /** 动态代理 */
    DYNAMIC_PROXY("dynamic.proxy", "动态代理"),
    
    // ==================== 安全权限 ====================
    
    /** 加密操作 */
    SECURITY_CRYPTO("security.crypto", "加密操作"),
    
    /** 密钥访问 */
    SECURITY_KEYSTORE("security.keystore", "密钥访问"),
    
    /** 安全策略修改 */
    SECURITY_POLICY("security.policy", "安全策略修改"),
    
    // ==================== 资源权限 ====================
    
    /** 无限 CPU */
    RESOURCE_CPU_UNLIMITED("resource.cpu.unlimited", "无限CPU"),
    
    /** 无限内存 */
    RESOURCE_MEMORY_UNLIMITED("resource.memory.unlimited", "无限内存"),
    
    /** 创建线程 */
    THREAD_CREATE("thread.create", "创建线程");
    
    private final String code;
    private final String description;
    
    Permission(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() { return code; }
    public String getDescription() { return description; }
}