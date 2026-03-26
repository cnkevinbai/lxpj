package com.daod.iov.plugin.sandbox;

import java.util.ArrayList;
import java.util.List;

/**
 * 文件系统策略
 */
public class FileSystemPolicy {
    
    private boolean allowRead;        // 允许读取
    private boolean allowWrite;       // 允许写入
    private boolean allowDelete;      // 允许删除
    private boolean allowExecute;     // 允许执行
    
    private List<String> readOnlyPaths;   // 只读路径
    private List<String> readWritePaths;  // 读写路径
    private List<String> deniedPaths;     // 拒绝访问路径
    
    public static final FileSystemPolicy READ_ONLY = new FileSystemPolicy()
        .setAllowRead(true)
        .setAllowWrite(false)
        .setAllowDelete(false)
        .setAllowExecute(false);
    
    public static final FileSystemPolicy READ_WRITE = new FileSystemPolicy()
        .setAllowRead(true)
        .setAllowWrite(true)
        .setAllowDelete(false)
        .setAllowExecute(false);
    
    public static final FileSystemPolicy FULL_ACCESS = new FileSystemPolicy()
        .setAllowRead(true)
        .setAllowWrite(true)
        .setAllowDelete(true)
        .setAllowExecute(true);
    
    public static final FileSystemPolicy NO_ACCESS = new FileSystemPolicy()
        .setAllowRead(false)
        .setAllowWrite(false)
        .setAllowDelete(false)
        .setAllowExecute(false);
    
    public FileSystemPolicy() {
        this.readOnlyPaths = new ArrayList<>();
        this.readWritePaths = new ArrayList<>();
        this.deniedPaths = new ArrayList<>();
    }
    
    /**
     * 检查路径是否可读
     */
    public boolean canRead(String path) {
        if (!allowRead) return false;
        if (isDenied(path)) return false;
        return true;
    }
    
    /**
     * 检查路径是否可写
     */
    public boolean canWrite(String path) {
        if (!allowWrite) return false;
        if (isDenied(path)) return false;
        if (isReadOnly(path)) return false;
        return true;
    }
    
    /**
     * 检查路径是否可删除
     */
    public boolean canDelete(String path) {
        if (!allowDelete) return false;
        if (isDenied(path)) return false;
        return true;
    }
    
    /**
     * 检查路径是否可执行
     */
    public boolean canExecute(String path) {
        if (!allowExecute) return false;
        if (isDenied(path)) return false;
        return true;
    }
    
    private boolean isDenied(String path) {
        return deniedPaths.stream().anyMatch(path::startsWith);
    }
    
    private boolean isReadOnly(String path) {
        return readOnlyPaths.stream().anyMatch(path::startsWith);
    }
    
    // Getters and Setters
    public boolean isAllowRead() { return allowRead; }
    public FileSystemPolicy setAllowRead(boolean allowRead) { this.allowRead = allowRead; return this; }
    
    public boolean isAllowWrite() { return allowWrite; }
    public FileSystemPolicy setAllowWrite(boolean allowWrite) { this.allowWrite = allowWrite; return this; }
    
    public boolean isAllowDelete() { return allowDelete; }
    public FileSystemPolicy setAllowDelete(boolean allowDelete) { this.allowDelete = allowDelete; return this; }
    
    public boolean isAllowExecute() { return allowExecute; }
    public FileSystemPolicy setAllowExecute(boolean allowExecute) { this.allowExecute = allowExecute; return this; }
    
    public List<String> getReadOnlyPaths() { return readOnlyPaths; }
    public void setReadOnlyPaths(List<String> readOnlyPaths) { this.readOnlyPaths = readOnlyPaths; }
    
    public List<String> getReadWritePaths() { return readWritePaths; }
    public void setReadWritePaths(List<String> readWritePaths) { this.readWritePaths = readWritePaths; }
    
    public List<String> getDeniedPaths() { return deniedPaths; }
    public void setDeniedPaths(List<String> deniedPaths) { this.deniedPaths = deniedPaths; }
}