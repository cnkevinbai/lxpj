package com.daod.iov.modules.ota.service;

import com.daod.iov.modules.ota.entity.*;
import com.daod.iov.modules.ota.event.*;
import com.daod.iov.modules.ota.OtaException;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;
import java.nio.file.*;

/**
 * 固件服务
 */
public class FirmwareService {
    private final String storagePath;
    private final long maxFirmwareSize;
    private final boolean autoBackup;
    private final Map<String, Firmware> firmwareStore = new ConcurrentHashMap<>();
    private final List<FirmwareListener> listeners = new CopyOnWriteArrayList<>();
    
    public FirmwareService(String storagePath, long maxFirmwareSize, boolean autoBackup) {
        this.storagePath = storagePath;
        this.maxFirmwareSize = maxFirmwareSize;
        this.autoBackup = autoBackup;
    }
    
    public Firmware uploadFirmware(byte[] firmwareData, FirmwareInfo info) throws OtaException {
        if (firmwareData.length > maxFirmwareSize) {
            throw new OtaException("FIRMWARE_TOO_LARGE", 
                "固件大小超过限制: " + firmwareData.length + " > " + maxFirmwareSize);
        }
        
        String firmwareId = UUID.randomUUID().toString();
        
        if (info.getChecksum() != null && !verifyChecksum(firmwareData, info.getChecksum(), 
            info.getChecksumAlgorithm() != null ? info.getChecksumAlgorithm() : "SHA-256")) {
            throw new OtaException("CHECKSUM_MISMATCH", "固件校验和不匹配");
        }
        
        Firmware firmware = Firmware.builder()
            .id(firmwareId)
            .deviceId(info.getDeviceId())
            .deviceModel(info.getDeviceModel())
            .version(info.getVersion())
            .fileName(info.getFileName())
            .fileSize(firmwareData.length)
            .fileType(info.getFileType() != null ? info.getFileType() : "application/octet-stream")
            .fileData(firmwareData)
            .checksum(info.getChecksum())
            .checksumAlgorithm(info.getChecksumAlgorithm() != null ? info.getChecksumAlgorithm() : "SHA-256")
            .description(info.getDescription())
            .strategyType(info.getStrategyType() != null ? info.getStrategyType() : "full")
            .active(true)
            .createdAt(new Date())
            .updatedAt(new Date())
            .createdBy(info.getCreatedBy())
            .build();
        
        firmwareStore.put(firmwareId, firmware);
        saveFirmwareToFileSystem(firmware);
        
        listeners.forEach(listener -> listener.onFirmwareUploaded(firmware));
        
        return firmware;
    }
    
    public Firmware getFirmware(String firmwareId) throws OtaException {
        Firmware firmware = firmwareStore.get(firmwareId);
        if (firmware == null) {
            throw new OtaException("FIRMWARE_NOT_FOUND", "固件不存在: " + firmwareId);
        }
        return firmware;
    }
    
    public List<Firmware> listFirmwares(String deviceId, String deviceModel) {
        return firmwareStore.values().stream()
            .filter(f -> deviceId == null || f.getDeviceId().equals(deviceId))
            .filter(f -> deviceModel == null || f.getDeviceModel().equals(deviceModel))
            .collect(Collectors.toList());
    }
    
    public void deleteFirmware(String firmwareId) throws OtaException {
        Firmware firmware = firmwareStore.remove(firmwareId);
        if (firmware == null) {
            throw new OtaException("FIRMWARE_NOT_FOUND", "固件不存在: " + firmwareId);
        }
        removeFromFileSystem(firmwareId);
        listeners.forEach(listener -> listener.onFirmwareDeleted(firmwareId));
    }
    
    private boolean verifyChecksum(byte[] data, String expectedChecksum, String algorithm) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance(algorithm);
            byte[] hash = digest.digest(data);
            return bytesToHex(hash).equals(expectedChecksum);
        } catch (Exception e) {
            return false;
        }
    }
    
    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
    
    private void saveFirmwareToFileSystem(Firmware firmware) throws OtaException {
        try {
            Path path = Paths.get(storagePath, firmware.getId() + ".bin");
            Files.write(path, firmware.getFileData());
        } catch (Exception e) {
            throw new OtaException("STORAGE_FAILED", "固件存储失败: " + e.getMessage(), e);
        }
    }
    
    private void removeFromFileSystem(String firmwareId) throws OtaException {
        try {
            Path path = Paths.get(storagePath, firmwareId + ".bin");
            Files.deleteIfExists(path);
        } catch (Exception e) {
            throw new OtaException("DELETE_FAILED", "固件删除失败: " + e.getMessage(), e);
        }
    }
    
    public void addListener(FirmwareListener listener) {
        listeners.add(listener);
    }
    
    // ==================== 监听器接口 ====================
    
    public interface FirmwareListener {
        void onFirmwareUploaded(Firmware firmware);
        void onFirmwareDeleted(String firmwareId);
    }
}
