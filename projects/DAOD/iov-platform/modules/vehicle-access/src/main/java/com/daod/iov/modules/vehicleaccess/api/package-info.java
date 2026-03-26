/**
 * 车辆接入管理服务
 * 
 * <p>提供设备绑定、车辆注册、协议适配等核心能力
 * 
 * <h2>核心功能</h2>
 * <ul>
 *   <li>设备绑定管理 - 三种协议 (JT/T 808、MQTT、HTTP) 的设备绑定</li>
 *   <li>车辆注册管理 - 车辆信息录入与维护</li>
 *   <li>绑定状态管理 - 绑定、解绑、恢复、过期</li>
 *   <li>事件日志记录 - 绑定事件追踪</li>
 * </ul>
 * 
 * <h2>接口定义</h2>
 * <ul>
 *   <li>{@link com.daod.iov.modules.vehicleaccess.api.BindingService} - 绑定服务</li>
 *   <li>{@link com.daod.iov.modules.vehicleaccess.api.VehicleRegisterService} - 车辆注册服务</li>
 * </ul>
 * 
 * @author 渔晓白
 * @since 1.0.0
 * @see com.daod.iov.modules.vehicleaccess.api.BindingService
 * @see com.daod.iov.modules.vehicleaccess.api.dto.DeviceBinding
 */
package com.daod.iov.modules.vehicleaccess.api;