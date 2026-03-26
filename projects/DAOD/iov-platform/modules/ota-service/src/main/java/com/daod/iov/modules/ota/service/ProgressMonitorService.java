package com.daod.iov.modules.ota.service;

import com.daod.iov.modules.ota.entity.*;
import com.daod.iov.modules.ota.event.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

/**
 * 进度监控服务
 */
public class ProgressMonitorService {
    private final Map<String, UpgradeProgress> progressMap = new ConcurrentHashMap<>();
    private final List<ProgressListener> listeners = new CopyOnWriteArrayList<>();
    private volatile boolean running = false;
    
    public void start() {
        running = true;
    }
    
    public void stop() {
        running = false;
    }
    
    public UpgradeProgress getProgress(String taskId) {
        return progressMap.get(taskId);
    }
    
    public void updateProgress(String taskId, int progress) {
        UpgradeProgress existing = progressMap.get(taskId);
        UpgradeProgress newProgress = UpgradeProgress.builder()
            .taskId(taskId)
            .progress(progress)
            .status(progress >= 100 ? "COMPLETED" : "IN_PROGRESS")
            .lastUpdate(LocalDateTime.now())
            .build();
        
        progressMap.put(taskId, newProgress);
        
        listeners.forEach(listener -> listener.onProgress(newProgress));
    }
    
    public void addProgressListener(ProgressListener listener) {
        listeners.add(listener);
    }
    
    public interface ProgressListener {
        void onProgress(UpgradeProgress progress);
    }
}
