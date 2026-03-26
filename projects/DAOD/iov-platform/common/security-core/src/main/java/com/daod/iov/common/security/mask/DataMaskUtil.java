package com.daod.iov.common.security.mask;

import org.apache.commons.lang3.StringUtils;

import java.util.regex.Pattern;

/**
 * 数据脱敏工具类
 * 
 * 功能:
 * 1. 手机号脱敏
 * 2. 身份证号脱敏
 * 3. VIN码脱敏
 * 4. 车牌号脱敏
 * 5. 邮箱脱敏
 * 6. 银行卡号脱敏
 * 7. 姓名脱敏
 * 8. 地址脱敏
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class DataMaskUtil {
    
    // 手机号正则
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    
    // 身份证号正则 (18位)
    private static final Pattern ID_CARD_PATTERN = Pattern.compile("^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$");
    
    // VIN码正则 (17位)
    private static final Pattern VIN_PATTERN = Pattern.compile("^[A-HJ-NPR-Z0-9]{17}$");
    
    // 车牌号正则
    private static final Pattern PLATE_NUMBER_PATTERN = Pattern.compile("^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$");
    
    // 邮箱正则
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    
    // 银行卡号正则
    private static final Pattern BANK_CARD_PATTERN = Pattern.compile("^\\d{16,19}$");
    
    /**
     * 手机号脱敏
     * 
     * 格式: 138****1234
     * 
     * @param phone 手机号
     * @return 脱敏后的手机号
     */
    public static String maskPhone(String phone) {
        if (StringUtils.isBlank(phone) || phone.length() != 11) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }
    
    /**
     * 身份证号脱敏
     * 
     * 格式: 511***********1234
     * 
     * @param idCard 身份证号
     * @return 脱敏后的身份证号
     */
    public static String maskIdCard(String idCard) {
        if (StringUtils.isBlank(idCard) || (idCard.length() != 15 && idCard.length() != 18)) {
            return idCard;
        }
        return idCard.substring(0, 3) + "***********" + idCard.substring(idCard.length() - 4);
    }
    
    /**
     * VIN码脱敏
     * 
     * 格式: LDA***********ABCD
     * 
     * @param vin VIN码
     * @return 脱敏后的VIN码
     */
    public static String maskVin(String vin) {
        if (StringUtils.isBlank(vin) || vin.length() != 17) {
            return vin;
        }
        return vin.substring(0, 3) + "***********" + vin.substring(13);
    }
    
    /**
     * 车牌号脱敏
     * 
     * 格式: 川A****8
     * 
     * @param plateNumber 车牌号
     * @return 脱敏后的车牌号
     */
    public static String maskPlateNumber(String plateNumber) {
        if (StringUtils.isBlank(plateNumber) || plateNumber.length() < 5) {
            return plateNumber;
        }
        int length = plateNumber.length();
        return plateNumber.substring(0, 2) + "****" + plateNumber.substring(length - 1);
    }
    
    /**
     * 邮箱脱敏
     * 
     * 格式: a***@example.com
     * 
     * @param email 邮箱
     * @return 脱敏后的邮箱
     */
    public static String maskEmail(String email) {
        if (StringUtils.isBlank(email) || !email.contains("@")) {
            return email;
        }
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) {
            return email;
        }
        return email.substring(0, 1) + "***" + email.substring(atIndex);
    }
    
    /**
     * 银行卡号脱敏
     * 
     * 格式: 6222****1234
     * 
     * @param bankCard 银行卡号
     * @return 脱敏后的银行卡号
     */
    public static String maskBankCard(String bankCard) {
        if (StringUtils.isBlank(bankCard) || bankCard.length() < 8) {
            return bankCard;
        }
        return bankCard.substring(0, 4) + "****" + bankCard.substring(bankCard.length() - 4);
    }
    
    /**
     * 姓名脱敏
     * 
     * 格式: 张*、张**
     * 
     * @param name 姓名
     * @return 脱敏后的姓名
     */
    public static String maskName(String name) {
        if (StringUtils.isBlank(name) || name.length() == 1) {
            return name;
        }
        return name.substring(0, 1) + StringUtils.repeat("*", name.length() - 1);
    }
    
    /**
     * 地址脱敏
     * 
     * 格式: 四川省眉山市****
     * 
     * @param address 地址
     * @return 脱敏后的地址
     */
    public static String maskAddress(String address) {
        if (StringUtils.isBlank(address) || address.length() <= 6) {
            return address;
        }
        return address.substring(0, 6) + "****";
    }
    
    /**
     * 自定义脱敏
     * 
     * @param data 原始数据
     * @param prefixLen 保留前缀长度
     * @param suffixLen 保留后缀长度
     * @param maskChar 脱敏字符
     * @return 脱敏后的数据
     */
    public static String mask(String data, int prefixLen, int suffixLen, char maskChar) {
        if (StringUtils.isBlank(data)) {
            return data;
        }
        
        if (data.length() <= prefixLen + suffixLen) {
            return data;
        }
        
        StringBuilder sb = new StringBuilder();
        sb.append(data.substring(0, prefixLen));
        
        int maskLen = data.length() - prefixLen - suffixLen;
        for (int i = 0; i < maskLen; i++) {
            sb.append(maskChar);
        }
        
        sb.append(data.substring(data.length() - suffixLen));
        return sb.toString();
    }
    
    /**
     * 判断是否为手机号
     */
    public static boolean isPhone(String phone) {
        return StringUtils.isNotBlank(phone) && PHONE_PATTERN.matcher(phone).matches();
    }
    
    /**
     * 判断是否为身份证号
     */
    public static boolean isIdCard(String idCard) {
        return StringUtils.isNotBlank(idCard) && ID_CARD_PATTERN.matcher(idCard).matches();
    }
    
    /**
     * 判断是否为VIN码
     */
    public static boolean isVin(String vin) {
        return StringUtils.isNotBlank(vin) && VIN_PATTERN.matcher(vin).matches();
    }
    
    /**
     * 判断是否为车牌号
     */
    public static boolean isPlateNumber(String plateNumber) {
        return StringUtils.isNotBlank(plateNumber) && PLATE_NUMBER_PATTERN.matcher(plateNumber).matches();
    }
    
    /**
     * 判断是否为邮箱
     */
    public static boolean isEmail(String email) {
        return StringUtils.isNotBlank(email) && EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * 判断是否为银行卡号
     */
    public static boolean isBankCard(String bankCard) {
        return StringUtils.isNotBlank(bankCard) && BANK_CARD_PATTERN.matcher(bankCard).matches();
    }
}