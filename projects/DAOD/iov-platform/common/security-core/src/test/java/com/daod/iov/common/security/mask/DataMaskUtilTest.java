package com.daod.iov.common.security.mask;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * DataMaskUtil 单元测试
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
class DataMaskUtilTest {
    
    // ==================== 手机号脱敏测试 ====================
    
    @Test
    @DisplayName("手机号脱敏 - 标准格式")
    void testMaskPhone_Standard() {
        String phone = "13812345678";
        String masked = DataMaskUtil.maskPhone(phone);
        
        assertEquals("138****5678", masked);
    }
    
    @Test
    @DisplayName("手机号脱敏 - 空值")
    void testMaskPhone_Null() {
        assertNull(DataMaskUtil.maskPhone(null));
        assertEquals("", DataMaskUtil.maskPhone(""));
    }
    
    @Test
    @DisplayName("手机号脱敏 - 非标准长度")
    void testMaskPhone_InvalidLength() {
        String phone = "12345";
        String masked = DataMaskUtil.maskPhone(phone);
        
        // 非标准长度，返回原值
        assertEquals(phone, masked);
    }
    
    // ==================== 身份证号脱敏测试 ====================
    
    @Test
    @DisplayName("身份证号脱敏 - 18位")
    void testMaskIdCard_18Digits() {
        String idCard = "511302199001011234";
        String masked = DataMaskUtil.maskIdCard(idCard);
        
        assertEquals("511***********1234", masked);
    }
    
    @Test
    @DisplayName("身份证号脱敏 - 15位")
    void testMaskIdCard_15Digits() {
        String idCard = "511302900101123";
        String masked = DataMaskUtil.maskIdCard(idCard);
        
        assertEquals("511***********1123", masked);
    }
    
    // ==================== VIN码脱敏测试 ====================
    
    @Test
    @DisplayName("VIN码脱敏 - 标准17位")
    void testMaskVin_Standard() {
        String vin = "LDA1234567890ABCD";
        String masked = DataMaskUtil.maskVin(vin);
        
        assertEquals("LDA***********ABCD", masked);
    }
    
    @Test
    @DisplayName("VIN码脱敏 - 非标准长度")
    void testMaskVin_InvalidLength() {
        String vin = "LDA123";
        String masked = DataMaskUtil.maskVin(vin);
        
        assertEquals(vin, masked);
    }
    
    // ==================== 车牌号脱敏测试 ====================
    
    @Test
    @DisplayName("车牌号脱敏 - 标准格式")
    void testMaskPlateNumber_Standard() {
        String plate = "川A12345";
        String masked = DataMaskUtil.maskPlateNumber(plate);
        
        assertEquals("川A****5", masked);
    }
    
    @Test
    @DisplayName("车牌号脱敏 - 新能源车牌")
    void testMaskPlateNumber_NewEnergy() {
        String plate = "川A12345D";
        String masked = DataMaskUtil.maskPlateNumber(plate);
        
        assertEquals("川A****D", masked);
    }
    
    // ==================== 邮箱脱敏测试 ====================
    
    @Test
    @DisplayName("邮箱脱敏 - 标准格式")
    void testMaskEmail_Standard() {
        String email = "test@example.com";
        String masked = DataMaskUtil.maskEmail(email);
        
        assertEquals("t***@example.com", masked);
    }
    
    @Test
    @DisplayName("邮箱脱敏 - 长用户名")
    void testMaskEmail_LongUsername() {
        String email = "longusername@example.com";
        String masked = DataMaskUtil.maskEmail(email);
        
        assertEquals("l***@example.com", masked);
    }
    
    // ==================== 银行卡号脱敏测试 ====================
    
    @Test
    @DisplayName("银行卡号脱敏 - 16位")
    void testMaskBankCard_16Digits() {
        String card = "6222021234567890";
        String masked = DataMaskUtil.maskBankCard(card);
        
        assertEquals("6222****7890", masked);
    }
    
    @Test
    @DisplayName("银行卡号脱敏 - 19位")
    void testMaskBankCard_19Digits() {
        String card = "6222021234567890123";
        String masked = DataMaskUtil.maskBankCard(card);
        
        assertEquals("6222****0123", masked);
    }
    
    // ==================== 姓名脱敏测试 ====================
    
    @Test
    @DisplayName("姓名脱敏 - 两个字")
    void testMaskName_TwoChars() {
        String name = "张三";
        String masked = DataMaskUtil.maskName(name);
        
        assertEquals("张*", masked);
    }
    
    @Test
    @DisplayName("姓名脱敏 - 三个字")
    void testMaskName_ThreeChars() {
        String name = "张小三";
        String masked = DataMaskUtil.maskName(name);
        
        assertEquals("张**", masked);
    }
    
    @Test
    @DisplayName("姓名脱敏 - 单字")
    void testMaskName_SingleChar() {
        String name = "张";
        String masked = DataMaskUtil.maskName(name);
        
        assertEquals("张", masked);
    }
    
    // ==================== 地址脱敏测试 ====================
    
    @Test
    @DisplayName("地址脱敏 - 标准格式")
    void testMaskAddress_Standard() {
        String address = "四川省眉山市东坡区某某街道某某小区";
        String masked = DataMaskUtil.maskAddress(address);
        
        assertEquals("四川省眉山市****", masked);
    }
    
    @Test
    @DisplayName("地址脱敏 - 短地址")
    void testMaskAddress_Short() {
        String address = "眉山市";
        String masked = DataMaskUtil.maskAddress(address);
        
        assertEquals("眉山市", masked);
    }
    
    // ==================== 自定义脱敏测试 ====================
    
    @Test
    @DisplayName("自定义脱敏 - 标准参数")
    void testMask_Custom() {
        String data = "ABCDEFGHIJ";
        String masked = DataMaskUtil.mask(data, 2, 2, '*');
        
        assertEquals("AB******IJ", masked);
    }
    
    @Test
    @DisplayName("自定义脱敏 - 数据过短")
    void testMask_TooShort() {
        String data = "ABC";
        String masked = DataMaskUtil.mask(data, 2, 2, '*');
        
        // 前缀+后缀已超过数据长度，返回原值
        assertEquals(data, masked);
    }
    
    // ==================== 类型判断测试 ====================
    
    @Test
    @DisplayName("判断是否为手机号")
    void testIsPhone() {
        assertTrue(DataMaskUtil.isPhone("13812345678"));
        assertTrue(DataMaskUtil.isPhone("19912345678"));
        assertFalse(DataMaskUtil.isPhone("12812345678"));  // 非法号段
        assertFalse(DataMaskUtil.isPhone("1381234567"));  // 位数不足
    }
    
    @Test
    @DisplayName("判断是否为身份证号")
    void testIsIdCard() {
        assertTrue(DataMaskUtil.isIdCard("511302199001011234"));
        assertFalse(DataMaskUtil.isIdCard("51130219900101123"));  // 位数不足
        assertFalse(DataMaskUtil.isIdCard("51130219900101123X"));  // X 大小写
    }
    
    @Test
    @DisplayName("判断是否为VIN码")
    void testIsVin() {
        assertTrue(DataMaskUtil.isVin("LDA1234567890ABCD"));
        assertFalse(DataMaskUtil.isVin("LDA1234567890ABC"));  // 位数不足
        assertFalse(DataMaskUtil.isVin("LDA1234567890ABCI"));  // 包含 I (非法字符)
    }
    
    @Test
    @DisplayName("判断是否为车牌号")
    void testIsPlateNumber() {
        assertTrue(DataMaskUtil.isPlateNumber("川A12345"));
        assertTrue(DataMaskUtil.isPlateNumber("京AD12345"));  // 新能源
        assertFalse(DataMaskUtil.isPlateNumber("A12345"));  // 缺少省份
    }
    
    @Test
    @DisplayName("判断是否为邮箱")
    void testIsEmail() {
        assertTrue(DataMaskUtil.isEmail("test@example.com"));
        assertTrue(DataMaskUtil.isEmail("test.name@example.co.uk"));
        assertFalse(DataMaskUtil.isEmail("test.example.com"));  // 缺少 @
    }
    
    @Test
    @DisplayName("判断是否为银行卡号")
    void testIsBankCard() {
        assertTrue(DataMaskUtil.isBankCard("6222021234567890"));
        assertTrue(DataMaskUtil.isBankCard("6222021234567890123"));
        assertFalse(DataMaskUtil.isBankCard("622202123456789"));  // 位数不足
    }
}