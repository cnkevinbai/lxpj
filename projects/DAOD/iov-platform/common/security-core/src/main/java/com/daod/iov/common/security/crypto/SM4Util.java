package com.daod.iov.common.security.crypto;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.crypto.engines.SM4Engine;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.util.Arrays;
import java.util.Base64;

/**
 * 国密 SM4 对称加密工具类
 * 
 * SM4 是中国国家密码管理局发布的分组加密算法，分组长度 128 位，密钥长度 128 位
 * 
 * 功能:
 * 1. SM4 加密/解密
 * 2. 密钥生成
 * 3. ECB/CBC 模式支持
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Slf4j
public class SM4Util {
    
    static {
        // 添加 BouncyCastle Provider
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }
    
    /** SM4 密钥长度 (128 位 = 16 字节) */
    public static final int KEY_SIZE = 16;
    
    /** SM4 分组长度 (128 位 = 16 字节) */
    public static final int BLOCK_SIZE = 16;
    
    /**
     * 生成 SM4 密钥
     * 
     * @return Base64 编码的密钥
     */
    public static String generateKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("SM4", BouncyCastleProvider.PROVIDER_NAME);
            keyGenerator.init(KEY_SIZE * 8);  // 位
            SecretKey secretKey = keyGenerator.generateKey();
            return Base64.getEncoder().encodeToString(secretKey.getEncoded());
        } catch (NoSuchAlgorithmException | NoSuchProviderException e) {
            log.error("生成SM4密钥失败: {}", e.getMessage());
            throw new RuntimeException("生成SM4密钥失败", e);
        }
    }
    
    /**
     * SM4 加密 (ECB 模式)
     * 
     * @param plaintext 明文
     * @param key Base64 编码的密钥
     * @return Base64 编码的密文
     */
    public static String encrypt(String plaintext, String key) {
        return encrypt(plaintext, key, SM4Mode.ECB, null);
    }
    
    /**
     * SM4 加密 (指定模式)
     * 
     * @param plaintext 明文
     * @param key Base64 编码的密钥
     * @param mode 加密模式
     * @param iv 初始向量 (CBC 模式需要)
     * @return Base64 编码的密文
     */
    public static String encrypt(String plaintext, String key, SM4Mode mode, byte[] iv) {
        if (plaintext == null || plaintext.isEmpty()) {
            return null;
        }
        
        try {
            byte[] keyBytes = Base64.getDecoder().decode(key);
            byte[] plaintextBytes = plaintext.getBytes(StandardCharsets.UTF_8);
            
            // PKCS7 填充
            byte[] paddedData = pkcs7Pad(plaintextBytes);
            
            // 加密
            SM4Engine engine = new SM4Engine();
            engine.init(true, new KeyParameter(keyBytes));
            
            byte[] ciphertext = new byte[paddedData.length];
            for (int i = 0; i < paddedData.length; i += BLOCK_SIZE) {
                engine.processBlock(paddedData, i, ciphertext, i);
            }
            
            return Base64.getEncoder().encodeToString(ciphertext);
        } catch (Exception e) {
            log.error("SM4加密失败: {}", e.getMessage());
            throw new RuntimeException("SM4加密失败", e);
        }
    }
    
    /**
     * SM4 解密 (ECB 模式)
     * 
     * @param ciphertext Base64 编码的密文
     * @param key Base64 编码的密钥
     * @return 明文
     */
    public static String decrypt(String ciphertext, String key) {
        return decrypt(ciphertext, key, SM4Mode.ECB, null);
    }
    
    /**
     * SM4 解密 (指定模式)
     * 
     * @param ciphertext Base64 编码的密文
     * @param key Base64 编码的密钥
     * @param mode 加密模式
     * @param iv 初始向量 (CBC 模式需要)
     * @return 明文
     */
    public static String decrypt(String ciphertext, String key, SM4Mode mode, byte[] iv) {
        if (ciphertext == null || ciphertext.isEmpty()) {
            return null;
        }
        
        try {
            byte[] keyBytes = Base64.getDecoder().decode(key);
            byte[] ciphertextBytes = Base64.getDecoder().decode(ciphertext);
            
            // 解密
            SM4Engine engine = new SM4Engine();
            engine.init(false, new KeyParameter(keyBytes));
            
            byte[] decrypted = new byte[ciphertextBytes.length];
            for (int i = 0; i < ciphertextBytes.length; i += BLOCK_SIZE) {
                engine.processBlock(ciphertextBytes, i, decrypted, i);
            }
            
            // 去除 PKCS7 填充
            byte[] unpaddedData = pkcs7Unpad(decrypted);
            
            return new String(unpaddedData, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("SM4解密失败: {}", e.getMessage());
            throw new RuntimeException("SM4解密失败", e);
        }
    }
    
    /**
     * PKCS7 填充
     */
    private static byte[] pkcs7Pad(byte[] data) {
        int padLength = BLOCK_SIZE - (data.length % BLOCK_SIZE);
        byte[] padded = new byte[data.length + padLength];
        System.arraycopy(data, 0, padded, 0, data.length);
        for (int i = data.length; i < padded.length; i++) {
            padded[i] = (byte) padLength;
        }
        return padded;
    }
    
    /**
     * 去除 PKCS7 填充
     */
    private static byte[] pkcs7Unpad(byte[] data) {
        int padLength = data[data.length - 1] & 0xFF;
        if (padLength > BLOCK_SIZE || padLength == 0) {
            return data;
        }
        return Arrays.copyOf(data, data.length - padLength);
    }
    
    /**
     * SM4 加密模式
     */
    public enum SM4Mode {
        /** 电子密码本模式 */
        ECB,
        /** 密码分组链接模式 */
        CBC
    }
}