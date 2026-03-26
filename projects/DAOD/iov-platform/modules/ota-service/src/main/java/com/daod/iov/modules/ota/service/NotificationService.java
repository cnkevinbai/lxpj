package com.daod.iov.modules.ota.service;

import com.daod.iov.modules.ota.entity.*;
import com.daod.iov.modules.ota.event.*;
import com.daod.iov.plugin.*;
import java.util.*;
import java.util.concurrent.*;

/**
 * 通知服务
 */
public class NotificationService {
    private final ModuleContext context;
    private final List<UpgradeListener> listeners = new CopyOnWriteArrayList<>();
    
    public NotificationService(ModuleContext context) {
        this.context = context;
    }
    
    public void sendUpgradeStatusNotification(UpgradeStatusChangeEvent event) {
        System.out.println("发送升级状态通知: " + event);
        listeners.forEach(listener -> listener.onUpgradeStatusChange(event));
    }
    
    public void sendProgressNotification(UpgradeProgressEvent event) {
        System.out.println("发送进度通知: " + event);
        listeners.forEach(listener -> listener.onProgressUpdate(event));
    }
    
    public void sendCompletionNotification(UpgradeCompletionEvent event) {
        System.out.println("发送完成通知: " + event);
        listeners.forEach(listener -> listener.onUpgradeComplete(event));
    }
    
    public void sendFailureNotification(UpgradeFailureEvent event) {
        System.out.println("发送失败通知: " + event);
        listeners.forEach(listener -> listener.onUpgradeFailure(event));
    }
    
    public void addListener(UpgradeListener listener) {
        listeners.add(listener);
    }
    
    public interface UpgradeListener {
        void onUpgradeStatusChange(UpgradeStatusChangeEvent event);
        void onProgressUpdate(UpgradeProgressEvent event);
        void onUpgradeComplete(UpgradeCompletionEvent event);
        void onUpgradeFailure(UpgradeFailureEvent event);
        void onFirmwareUploaded(com.daod.iov.modules.ota.entity.Firmware firmware);
        void onFirmwareDeleted(String firmwareId);
    }
}
