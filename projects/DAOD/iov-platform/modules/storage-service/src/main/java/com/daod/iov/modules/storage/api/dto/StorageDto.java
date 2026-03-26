package com.daod.iov.modules.storage.api.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 文件上传请求
 */
@Data
public class FileUploadRequest {
    
    /** 存储桶 */
    private String bucket;
    
    /** 对象名称 (文件路径) */
    private String objectName;
    
    /** 文件名 */
    private String fileName;
    
    /** 内容类型 */
    private String contentType;
    
    /** 文件大小 */
    private long size;
    
    /** 文件流 */
    private java.io.InputStream inputStream;
    
    /** 元数据 */
    private Map<String, String> metadata;
    
    /** 租户ID */
    private String tenantId;
    
    /** 上传者ID */
    private String uploaderId;
}

/**
 * 文件上传结果
 */
@Data
class FileUploadResult {
    
    /** 是否成功 */
    private boolean success;
    
    /** 存储桶 */
    private String bucket;
    
    /** 对象名称 */
    private String objectName;
    
    /** 文件名 */
    private String fileName;
    
    /** 文件大小 */
    private long size;
    
    /** ETag */
    private String etag;
    
    /** 访问 URL */
    private String url;
    
    /** 预签名 URL */
    private String presignedUrl;
    
    /** 错误信息 */
    private String errorMessage;
    
    /** 上传时间 */
    private LocalDateTime uploadTime;
    
    public static FileUploadResult success(String bucket, String objectName, String etag, String url) {
        FileUploadResult result = new FileUploadResult();
        result.setSuccess(true);
        result.setBucket(bucket);
        result.setObjectName(objectName);
        result.setEtag(etag);
        result.setUrl(url);
        result.setUploadTime(LocalDateTime.now());
        return result;
    }
    
    public static FileUploadResult failure(String errorMessage) {
        FileUploadResult result = new FileUploadResult();
        result.setSuccess(false);
        result.setErrorMessage(errorMessage);
        return result;
    }
}

/**
 * 文件信息
 */
@Data
class FileInfo {
    
    /** 存储桶 */
    private String bucket;
    
    /** 对象名称 */
    private String objectName;
    
    /** 文件名 */
    private String fileName;
    
    /** 文件大小 */
    private long size;
    
    /** 内容类型 */
    private String contentType;
    
    /** ETag */
    private String etag;
    
    /** 最后修改时间 */
    private LocalDateTime lastModified;
    
    /** 访问 URL */
    private String url;
}