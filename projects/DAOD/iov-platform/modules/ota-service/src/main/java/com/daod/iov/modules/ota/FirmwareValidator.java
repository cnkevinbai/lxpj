package com.daod.iov.modules.ota;

/**
 * 固件验证器接口
 */
public interface FirmwareValidator {
    
    /**
     * 获取验证器类型
     */
    String getType();
    
    /**
     * 验证固件
     */
    boolean validate(String firmwareId, byte[] firmwareData) throws OtaException;
    
    /**
     * 获取验证结果
     */
    ValidationResult getValidationResult(String firmwareId);
    
    /**
     * 验证校验和
     */
    boolean verifyChecksum(byte[] data, String expectedChecksum, String algorithm);
}
