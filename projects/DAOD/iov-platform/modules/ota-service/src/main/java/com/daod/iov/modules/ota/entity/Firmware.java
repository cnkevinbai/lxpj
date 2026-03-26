package com.daod.iov.modules.ota.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;;

/**
 * 固件实体类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Firmware {
    private String id;
    private String deviceId;
    private String deviceModel;
    private String version;
    private String fileName;
    private long fileSize;
    private String fileType;
    private byte[] fileData;
    private String checksum;
    private String checksumAlgorithm;
    private String description;
    private String strategyType;
    private boolean active;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
}
