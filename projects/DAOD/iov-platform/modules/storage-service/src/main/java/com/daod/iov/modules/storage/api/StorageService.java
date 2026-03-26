package com.daod.iov.modules.storage.api;

import com.daod.iov.modules.storage.api.dto.FileUploadRequest;
import com.daod.iov.modules.storage.api.dto.FileUploadResult;
import com.daod.iov.modules.storage.api.dto.FileInfo;

import java.io.InputStream;
import java.util.List;

/**
 * 对象存储服务接口
 * 
 * 提供文件上传、下载、删除、预览等能力
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public interface StorageService {
    
    // ==================== 文件上传 ====================
    
    /**
     * 上传文件
     * 
     * @param request 上传请求
     * @return 上传结果
     */
    FileUploadResult upload(FileUploadRequest request);
    
    /**
     * 上传文件 (流式)
     * 
     * @param bucket 存储桶
     * @param objectName 对象名称
     * @param inputStream 文件流
     * @param contentType 内容类型
     * @param size 文件大小
     * @return 上传结果
     */
    FileUploadResult upload(String bucket, String objectName, InputStream inputStream, 
                            String contentType, long size);
    
    /**
     * 上传 OTA 固件包
     * 
     * @param firmwareName 固件名称
     * @param version 版本号
     * @param inputStream 文件流
     * @param size 文件大小
     * @return 上传结果
     */
    FileUploadResult uploadFirmware(String firmwareName, String version, 
                                     InputStream inputStream, long size);
    
    /**
     * 上传图片
     * 
     * @param vin 车辆VIN
     * @param imageType 图片类型 (alarm, snapshot, document)
     * @param inputStream 文件流
     * @param contentType 内容类型
     * @param size 文件大小
     * @return 上传结果
     */
    FileUploadResult uploadImage(String vin, String imageType, InputStream inputStream,
                                  String contentType, long size);
    
    /**
     * 上传视频
     * 
     * @param vin 车辆VIN
     * @param videoType 视频类型 (alarm, monitoring)
     * @param inputStream 文件流
     * @param contentType 内容类型
     * @param size 文件大小
     * @return 上传结果
     */
    FileUploadResult uploadVideo(String vin, String videoType, InputStream inputStream,
                                  String contentType, long size);
    
    // ==================== 文件下载 ====================
    
    /**
     * 下载文件
     * 
     * @param bucket 存储桶
     * @param objectName 对象名称
     * @return 文件流
     */
    InputStream download(String bucket, String objectName);
    
    /**
     * 获取文件 URL (临时访问链接)
     * 
     * @param bucket 存储桶
     * @param objectName 对象名称
     * @param expireSeconds 过期时间 (秒)
     * @return 访问 URL
     */
    String getPresignedUrl(String bucket, String objectName, int expireSeconds);
    
    /**
     * 获取文件公开 URL
     * 
     * @param bucket 存储桶
     * @param objectName 对象名称
     * @return 公开 URL
     */
    String getPublicUrl(String bucket, String objectName);
    
    // ==================== 文件管理 ====================
    
    /**
     * 删除文件
     * 
     * @param bucket 存储桶
     * @param objectName 对象名称
     */
    void delete(String bucket, String objectName);
    
    /**
     * 批量删除文件
     * 
     * @param bucket 存储桶
     * @param objectNames 对象名称列表
     */
    void deleteBatch(String bucket, List<String> objectNames);
    
    /**
     * 检查文件是否存在
     * 
     * @param bucket 存储桶
     * @param objectName 对象名称
     * @return 是否存在
     */
    boolean exists(String bucket, String objectName);
    
    /**
     * 获取文件信息
     * 
     * @param bucket 存储桶
     * @param objectName 对象名称
     * @return 文件信息
     */
    FileInfo getFileInfo(String bucket, String objectName);
    
    /**
     * 列出目录下的文件
     * 
     * @param bucket 存储桶
     * @param prefix 前缀
     * @return 文件列表
     */
    List<FileInfo> listFiles(String bucket, String prefix);
    
    // ==================== 存储桶管理 ====================
    
    /**
     * 创建存储桶
     * 
     * @param bucket 存储桶名称
     */
    void createBucket(String bucket);
    
    /**
     * 删除存储桶
     * 
     * @param bucket 存储桶名称
     */
    void deleteBucket(String bucket);
    
    /**
     * 检查存储桶是否存在
     * 
     * @param bucket 存储桶名称
     * @return 是否存在
     */
    boolean bucketExists(String bucket);
    
    /**
     * 设置存储桶公开访问
     * 
     * @param bucket 存储桶名称
     */
    void setBucketPublic(String bucket);
}