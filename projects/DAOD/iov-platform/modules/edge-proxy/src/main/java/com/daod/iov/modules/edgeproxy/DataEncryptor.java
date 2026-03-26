package com.daod.iov.modules.edgeproxy;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

/**
 * 数据加密器
 * 实现数据的加密和解密
 */
public class DataEncryptor {
    
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";
    
    private final SecretKeySpec keySpec;
    
    /**
     * 构造函数
     * @param key 密钥（16字节）
     */
    public DataEncryptor(String key) {
        if (key == null || key.length() != 16) {
            throw new IllegalArgumentException("密钥必须为16字节");
        }
        this.keySpec = new SecretKeySpec(key.getBytes(), ALGORITHM);
    }
    
    /**
     * 加密数据
     * @param data 原始数据
     * @return Base64编码的加密数据
     */
    public String encrypt(String data) {
        try {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(data.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("加密失败", e);
        }
    }
    
    /**
     * 解密数据
     * @param encryptedData Base64编码的加密数据
     * @return 原始数据
     */
    public String decrypt(String encryptedData) {
        try {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decoded = Base64.getDecoder().decode(encryptedData);
            byte[] decrypted = cipher.doFinal(decoded);
            return new String(decrypted, "UTF-8");
        } catch (Exception e) {
            throw new RuntimeException("解密失败", e);
        }
    }
    
    /**
     * 生成密钥
     * @param seed 种子
     * @return 16字节密钥
     */
    public static String generateKey(String seed) {
        if (seed == null || seed.isEmpty()) {
            seed = "daod-edge-proxy-secret";
        }
        
        // 简单的密钥派生
        StringBuilder key = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            int index = (seed.hashCode() + i) % seed.length();
            char c = seed.charAt(index);
            key.append((char) (c + i % 26));
        }
        
        return key.toString();
    }
}
