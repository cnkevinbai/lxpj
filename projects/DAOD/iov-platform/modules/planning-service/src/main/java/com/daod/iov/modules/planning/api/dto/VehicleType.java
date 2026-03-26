package com.daod.iov.modules.planning.api.dto;

/**
 * 车辆类型枚举
 */
public enum VehicleType {
    
    /** 小汽车 */
    CAR("car", "小汽车"),
    
    /** 货车 */
    TRUCK("truck", "货车"),
    
    /** 摩托车 */
    MOTORCYCLE("motorcycle", "摩托车"),
    
    /** 电动车 */
    ELECTRIC("electric", "电动车"),
    
    /** 行人 */
    PEDESTRIAN("pedestrian", "行人");
    
    private final String code;
    private final String description;
    
    VehicleType(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    public static VehicleType fromCode(String code) {
        for (VehicleType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        return CAR;
    }
}