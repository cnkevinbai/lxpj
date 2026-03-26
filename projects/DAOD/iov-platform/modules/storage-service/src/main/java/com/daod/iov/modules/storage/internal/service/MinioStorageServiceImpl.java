package com.daod.iov.modules.storage.internal.service;

import com.daod.iov.modules.storage.api.StorageService;
import com.daod.iov.modules.storage.api.dto.FileInfo;
import com.daod.iov.modules.storage.api.dto.FileUploadRequest;
import com.daod.iov.modules.storage.api.dto.FileUploadResult;
import io.minio.*;
import io.minio.http.Method;
import io.minio.messages.Item;
import io.minio.messages.ObjectWriteResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * MinIO 对象存储服务实现
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Slf4j
@Service
public class MinioStorageServiceImpl implements StorageService {
    
    @Autowired
    private MinioClient minioClient;
    
    @Value("${minio.public-url:}")
    private String publicUrl;
    
    // 存储桶名称常量
    private static final String FIRMWARE_BUCKET = "firmware";
    private static final String IMAGE_BUCKET = "images";
    private static final String VIDEO_BUCKET = "videos";
    private static final String DOCUMENT_BUCKET = "documents";
    
    // ==================== 文件上传 ====================
    
    @Override
    public FileUploadResult upload(FileUploadRequest request) {
        return upload(request.getBucket(), request.getObjectName(), 
            request.getInputStream(), request.getContentType(), request.getSize());
    }
    
    @Override
    public FileUploadResult upload(String bucket, String objectName, InputStream inputStream, 
                                     String contentType, long size) {
        try {
            // 确保存储桶存在
            if (!bucketExists(bucket)) {
                createBucket(bucket);
            }
            
            // 上传文件
            ObjectWriteResponse response = minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .stream(inputStream, size, -1)
                    .contentType(contentType)
                    .build()
            );
            
            String url = getPublicUrl(bucket, objectName);
            
            log.info("文件上传成功: bucket={}, object={}, etag={}", bucket, objectName, response.etag());
            
            return FileUploadResult.success(bucket, objectName, response.etag(), url);
            
        } catch (Exception e) {
            log.error("文件上传失败: bucket={}, object={}, error={}", bucket, objectName, e.getMessage());
            return FileUploadResult.failure("文件上传失败: " + e.getMessage());
        }
    }
    
    @Override
    public FileUploadResult uploadFirmware(String firmwareName, String version, 
                                            InputStream inputStream, long size) {
        String objectName = String.format("%s/%s/%s.jar", firmwareName, version, firmwareName + "-" + version);
        return upload(FIRMWARE_BUCKET, objectName, inputStream, "application/java-archive", size);
    }
    
    @Override
    public FileUploadResult uploadImage(String vin, String imageType, InputStream inputStream,
                                         String contentType, long size) {
        String objectName = String.format("%s/%s/%s_%d", vin, imageType, imageType, System.currentTimeMillis());
        return upload(IMAGE_BUCKET, objectName, inputStream, contentType, size);
    }
    
    @Override
    public FileUploadResult uploadVideo(String vin, String videoType, InputStream inputStream,
                                         String contentType, long size) {
        String objectName = String.format("%s/%s/%s_%d.mp4", vin, videoType, videoType, System.currentTimeMillis());
        return upload(VIDEO_BUCKET, objectName, inputStream, contentType, size);
    }
    
    // ==================== 文件下载 ====================
    
    @Override
    public InputStream download(String bucket, String objectName) {
        try {
            return minioClient.getObject(
                GetObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build()
            );
        } catch (Exception e) {
            log.error("文件下载失败: bucket={}, object={}, error={}", bucket, objectName, e.getMessage());
            throw new RuntimeException("文件下载失败: " + e.getMessage());
        }
    }
    
    @Override
    public String getPresignedUrl(String bucket, String objectName, int expireSeconds) {
        try {
            return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(bucket)
                    .object(objectName)
                    .expiry(expireSeconds, TimeUnit.SECONDS)
                    .build()
            );
        } catch (Exception e) {
            log.error("获取预签名URL失败: bucket={}, object={}, error={}", bucket, objectName, e.getMessage());
            throw new RuntimeException("获取预签名URL失败: " + e.getMessage());
        }
    }
    
    @Override
    public String getPublicUrl(String bucket, String objectName) {
        if (publicUrl != null && !publicUrl.isEmpty()) {
            return String.format("%s/%s/%s", publicUrl, bucket, objectName);
        }
        return getPresignedUrl(bucket, objectName, 3600);
    }
    
    // ==================== 文件管理 ====================
    
    @Override
    public void delete(String bucket, String objectName) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build()
            );
            log.info("文件删除成功: bucket={}, object={}", bucket, objectName);
        } catch (Exception e) {
            log.error("文件删除失败: bucket={}, object={}, error={}", bucket, objectName, e.getMessage());
            throw new RuntimeException("文件删除失败: " + e.getMessage());
        }
    }
    
    @Override
    public void deleteBatch(String bucket, List<String> objectNames) {
        try {
            List<DeleteObject> objects = new ArrayList<>();
            for (String objectName : objectNames) {
                objects.add(new DeleteObject(objectName));
            }
            
            minioClient.removeObjects(
                RemoveObjectsArgs.builder()
                    .bucket(bucket)
                    .objects(objects)
                    .build()
            );
            
            log.info("批量删除文件成功: bucket={}, count={}", bucket, objectNames.size());
        } catch (Exception e) {
            log.error("批量删除文件失败: bucket={}, error={}", bucket, e.getMessage());
            throw new RuntimeException("批量删除文件失败: " + e.getMessage());
        }
    }
    
    @Override
    public boolean exists(String bucket, String objectName) {
        try {
            minioClient.statObject(
                StatObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build()
            );
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public FileInfo getFileInfo(String bucket, String objectName) {
        try {
            StatObjectResponse response = minioClient.statObject(
                StatObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build()
            );
            
            FileInfo info = new FileInfo();
            info.setBucket(bucket);
            info.setObjectName(objectName);
            info.setSize(response.size());
            info.setContentType(response.contentType());
            info.setEtag(response.etag());
            info.setLastModified(LocalDateTime.ofInstant(
                response.lastModified().toInstant(), ZoneId.systemDefault()));
            info.setUrl(getPublicUrl(bucket, objectName));
            
            return info;
        } catch (Exception e) {
            log.error("获取文件信息失败: bucket={}, object={}, error={}", bucket, objectName, e.getMessage());
            throw new RuntimeException("获取文件信息失败: " + e.getMessage());
        }
    }
    
    @Override
    public List<FileInfo> listFiles(String bucket, String prefix) {
        try {
            List<FileInfo> files = new ArrayList<>();
            
            Iterable<Result<Item>> results = minioClient.listObjects(
                ListObjectsArgs.builder()
                    .bucket(bucket)
                    .prefix(prefix)
                    .recursive(true)
                    .build()
            );
            
            for (Result<Item> result : results) {
                Item item = result.get();
                
                FileInfo info = new FileInfo();
                info.setBucket(bucket);
                info.setObjectName(item.objectName());
                info.setSize(item.size());
                info.setEtag(item.etag());
                info.setLastModified(LocalDateTime.ofInstant(
                    item.lastModified().toInstant(), ZoneId.systemDefault()));
                info.setUrl(getPublicUrl(bucket, item.objectName()));
                
                files.add(info);
            }
            
            return files;
        } catch (Exception e) {
            log.error("列出文件失败: bucket={}, prefix={}, error={}", bucket, prefix, e.getMessage());
            throw new RuntimeException("列出文件失败: " + e.getMessage());
        }
    }
    
    // ==================== 存储桶管理 ====================
    
    @Override
    public void createBucket(String bucket) {
        try {
            minioClient.makeBucket(
                MakeBucketArgs.builder()
                    .bucket(bucket)
                    .build()
            );
            log.info("创建存储桶成功: bucket={}", bucket);
        } catch (Exception e) {
            log.error("创建存储桶失败: bucket={}, error={}", bucket, e.getMessage());
            throw new RuntimeException("创建存储桶失败: " + e.getMessage());
        }
    }
    
    @Override
    public void deleteBucket(String bucket) {
        try {
            minioClient.removeBucket(
                RemoveBucketArgs.builder()
                    .bucket(bucket)
                    .build()
            );
            log.info("删除存储桶成功: bucket={}", bucket);
        } catch (Exception e) {
            log.error("删除存储桶失败: bucket={}, error={}", bucket, e.getMessage());
            throw new RuntimeException("删除存储桶失败: " + e.getMessage());
        }
    }
    
    @Override
    public boolean bucketExists(String bucket) {
        try {
            return minioClient.bucketExists(
                BucketExistsArgs.builder()
                    .bucket(bucket)
                    .build()
            );
        } catch (Exception e) {
            log.error("检查存储桶是否存在失败: bucket={}, error={}", bucket, e.getMessage());
            return false;
        }
    }
    
    @Override
    public void setBucketPublic(String bucket) {
        try {
            // 设置公开访问策略
            String policy = String.format(
                "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetBucketLocation\",\"s3:ListBucket\"],\"Resource\":[\"arn:aws:s3:::%s\"]},{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetObject\"],\"Resource\":[\"arn:aws:s3:::%s/*\"]}]}",
                bucket, bucket
            );
            
            minioClient.setBucketPolicy(
                SetBucketPolicyArgs.builder()
                    .bucket(bucket)
                    .config(policy)
                    .build()
            );
            
            log.info("设置存储桶公开访问成功: bucket={}", bucket);
        } catch (Exception e) {
            log.error("设置存储桶公开访问失败: bucket={}, error={}", bucket, e.getMessage());
            throw new RuntimeException("设置存储桶公开访问失败: " + e.getMessage());
        }
    }
}