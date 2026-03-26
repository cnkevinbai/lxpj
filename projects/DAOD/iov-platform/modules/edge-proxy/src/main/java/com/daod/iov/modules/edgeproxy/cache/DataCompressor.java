package com.daod.iov.modules.edgeproxy.cache;

import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

/**
 * 数据压缩工具类
 */
public class DataCompressor {
    
    private static final int BUFFER_SIZE = 1024;
    
    /**
     * 压缩数据
     */
    public static byte[] compress(byte[] data) {
        try {
            Deflater deflater = new Deflater();
            deflater.setInput(data);
            deflater.finish();
            
            byte[] buffer = new byte[BUFFER_SIZE];
            int compressedSize = 0;
            
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            while (!deflater.finished()) {
                int count = deflater.deflate(buffer);
                baos.write(buffer, 0, count);
                compressedSize += count;
            }
            baos.close();
            
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("数据压缩失败", e);
        }
    }
    
    /**
     * 解压缩数据
     */
    public static byte[] decompress(byte[] data) {
        try {
            Inflater inflater = new Inflater();
            inflater.setInput(data);
            
            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            byte[] buffer = new byte[BUFFER_SIZE];
            
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                baos.write(buffer, 0, count);
            }
            baos.close();
            
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("数据解压缩失败", e);
        }
    }
    
    /**
     * 压缩字符串
     */
    public static String compress(String data) {
        byte[] bytes = compress(data.getBytes());
        return Base64.getEncoder().encodeToString(bytes);
    }
    
    /**
     * 解压缩字符串
     */
    public static String decompress(String data) {
        byte[] bytes = Base64.getDecoder().decode(data);
        byte[] decompressed = decompress(bytes);
        return new String(decompressed);
    }
    
    /**
     * 获取压缩率
     */
    public static double getCompressionRatio(byte[] original, byte[] compressed) {
        return (double) compressed.length / original.length;
    }
}
