package com.daod.iov.modules.mqtt.api;

import com.daod.iov.modules.mqtt.api.dto.*;
import java.util.List;
import java.util.Map;

/**
 * MQTT 适配器服务接口
 * 
 * 提供 MQTT 连接管理、消息收发、设备认证、设备影子能力
 */
public interface MqttAdapterService {
    
    // ==================== 服务生命周期 ====================
    
    /**
     * 启动适配器
     * 
     * @param port 端口号
     */
    void start(int port);
    
    /**
     * 停止适配器
     */
    void stop();
    
    /**
     * 是否运行中
     */
    boolean isRunning();
    
    // ==================== 消息发布 ====================
    
    /**
     * 发布消息
     * 
     * @param topic 主题
     * @param payload 消息体
     * @param qos 服务质量 (0/1/2)
     * @return 是否成功
     */
    boolean publish(String topic, byte[] payload, int qos);
    
    /**
     * 发布消息到指定设备
     * 
     * @param terminalId 终端 ID
     * @param messageType 消息类型 (command/config/ota)
     * @param payload 消息体
     * @return 是否成功
     */
    boolean publishToDevice(String terminalId, String messageType, byte[] payload);
    
    /**
     * 批量发布消息
     * 
     * @param messages 消息列表
     * @return 成功数量
     */
    int batchPublish(List<MqttMessage> messages);
    
    // ==================== 订阅管理 ====================
    
    /**
     * 订阅主题
     * 
     * @param clientId 客户端 ID
     * @param topic 主题
     * @param qos 服务质量
     */
    void subscribe(String clientId, String topic, int qos);
    
    /**
     * 取消订阅
     * 
     * @param clientId 客户端 ID
     * @param topic 主题
     */
    void unsubscribe(String clientId, String topic);
    
    /**
     * 注册消息处理器
     * 
     * @param topicPattern 主题模式 (支持通配符)
     * @param handler 消息处理器
     */
    void registerMessageHandler(String topicPattern, MqttMessageHandler handler);
    
    // ==================== 连接管理 ====================
    
    /**
     * 断开客户端连接
     * 
     * @param clientId 客户端 ID
     */
    void disconnect(String clientId);
    
    /**
     * 获取在线客户端数
     */
    int getOnlineClientCount();
    
    /**
     * 获取客户端列表
     */
    List<String> getOnlineClients();
    
    /**
     * 检查客户端是否在线
     */
    boolean isClientOnline(String clientId);
    
    // ==================== 设备认证 ====================
    
    /**
     * 注册设备认证处理器
     * 
     * @param handler 认证处理器
     */
    void registerDeviceAuthHandler(DeviceAuthHandler handler);
    
    /**
     * 处理设备认证
     */
    DeviceAuthResult handleDeviceAuth(DeviceAuthRequest request);
    
    // ==================== 设备影子 ====================
    
    /**
     * 获取设备影子
     * 
     * @param deviceId 设备 ID
     * @return 设备影子
     */
    DeviceShadow getDeviceShadow(String deviceId);
    
    /**
     * 更新设备影子 (上报状态)
     * 
     * @param deviceId 设备 ID
     * @param reported 上报状态
     * @return 更新后的影子
     */
    DeviceShadow updateReportedState(String deviceId, ShadowState reported);
    
    /**
     * 更新设备影子 (期望状态)
     * 
     * @param deviceId 设备 ID
     * @param desired 期望状态
     * @return 更新后的影子
     */
    DeviceShadow updateDesiredState(String deviceId, ShadowState desired);
    
    /**
     * 删除设备影子
     */
    void deleteDeviceShadow(String deviceId);
    
    /**
     * 同步期望状态到设备
     * 
     * @param deviceId 设备 ID
     */
    void syncDesiredStateToDevice(String deviceId);
    
    // ==================== Topic 规范 ====================
    
    /**
     * 获取设备 Topic 前缀
     */
    String getDeviceTopicPrefix(String terminalId);
    
    /**
     * Topic 规范定义
     */
    class Topics {
        /** 设备上报数据 */
        public static final String DEVICE_DATA = "device/{terminalId}/data";
        /** 设备上报位置 */
        public static final String DEVICE_POSITION = "device/{terminalId}/position";
        /** 设备上报告警 */
        public static final String DEVICE_ALARM = "device/{terminalId}/alarm";
        /** 设备心跳 */
        public static final String DEVICE_HEARTBEAT = "device/{terminalId}/heartbeat";
        /** 设备影子上报 */
        public static final String DEVICE_SHADOW_REPORTED = "device/{terminalId}/shadow/reported";
        /** 设备影子期望 */
        public static final String DEVICE_SHADOW_DESIRED = "device/{terminalId}/shadow/desired";
        /** 下发指令 */
        public static final String DEVICE_COMMAND = "device/{terminalId}/command";
        /** 下发配置 */
        public static final String DEVICE_CONFIG = "device/{terminalId}/config";
        /** 下发 OTA */
        public static final String DEVICE_OTA = "device/{terminalId}/ota";
        /** 遗嘱消息 */
        public static final String DEVICE_WILL = "device/{terminalId}/will";
    }
}