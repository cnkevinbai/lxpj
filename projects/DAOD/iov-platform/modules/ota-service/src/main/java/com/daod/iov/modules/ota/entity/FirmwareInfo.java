package com.daod.iov.modules.ota.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 固件信息
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class FirmwareInfo {
    private String deviceId;
    private String deviceModel;
    private String version;
    private String fileName;
    private long fileSize;
    private String fileType;
    private String checksum;
    private String checksumAlgorithm;
    private String description;
    private String strategyType;
    private String createdBy;
}
