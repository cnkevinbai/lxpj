package com.daod.iov.common.security.crypto;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.crypto.digests.SM3Digest;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.nio.charset.StandardCharsets;
import java.security.Security;
import java.util.HexAdapter;

/**
 * 国密 SM3 哈希算法工具类
 * 
 * SM3 是中国国家密码管理局发布的密码哈希算法标准，输出 256 位哈希值
 * 
 * 功能:
 * 1. SM3 哈希计算
 * 2. 数据指纹生成
 * 3. 密码存储
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Slf4j
public class SM3Util {
    
    static {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }
    
    /** SM3 输出长度 (256 位 = 32 字节) */
    public static final int DIGEST_SIZE = 32;
    
    /**
     * SM3 哈希计算
     * 
     * @param data 原始数据
     * @return 十六进制哈希值
     */
    public static String hash(String data) {
        return hash(data != null ? data.getBytes(StandardCharsets.UTF_8) : null);
    }
    
    /**
     * SM3 哈希计算
     * 
     * @param data 原始数据
     * @return 十六进制哈希值
     */
    public static String hash(byte[] data) {
        if (data == null) {
            return null;
        }
        
        SM3Digest digest = new SM3Digest();
        digest.update(data, 0, data.length);
        
        byte[] hash = new byte[DIGEST_SIZE];
        digest.doFinal(hash, 0);
        
        return bytesToHex(hash);
    }
    
    /**
     * 带盐值的 SM3 哈希
     * 
     * @param data 原始数据
     * @param salt 盐值
     * @return 十六进制哈希值
     */
    public static String hashWithSalt(String data, String salt) {
        if (data == null) {
            return null;
        }
        return hash(salt + data + salt);
    }
    
    /**
     * 密码哈希 (带盐值)
     * 
     * @param password 密码
     * @param salt 盐值 (如果不提供则自动生成)
     * @return 格式: salt$hash
     */
    public static String hashPassword(String password, String salt) {
        if (password == null || password.isEmpty()) {
            return null;
        }
        
        if (salt == null || salt.isEmpty()) {
            salt = generateSalt();
        }
        
        String hash = hashWithSalt(password, salt);
        return salt + "$" + hash;
    }
    
    /**
     * 验证密码
     * 
     * @param password 待验证密码
     * @param storedHash 存储的哈希值 (格式: salt$hash)
     * @return 是否匹配
     */
    public static boolean verifyPassword(String password, String storedHash) {
        if (password == null || storedHash == null) {
            return false;
        }
        
        String[] parts = storedHash.split("\\$");
        if (parts.length != 2) {
            return false;
        }
        
        String salt = parts[0];
        String expectedHash = parts[1];
        
        String actualHash = hashWithSalt(password, salt);
        return expectedHash.equals(actualHash);
    }
    
    /**
     * 生成随机盐值
     */
    private static String generateSalt() {
        return Long.toHexString(System.currentTimeMillis()) + 
               Integer.toHexString((int) (Math.random() * Integer.MAX_VALUE));
    }
    
    /**
     * 字节数组转十六进制字符串
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}