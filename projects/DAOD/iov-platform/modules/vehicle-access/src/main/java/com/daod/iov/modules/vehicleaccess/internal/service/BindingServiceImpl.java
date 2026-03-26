package com.daod.iov.modules.vehicleaccess.internal.service;

import com.daod.iov.modules.vehicleaccess.api.BindingService;
import com.daod.iov.modules.vehicleaccess.api.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 设备绑定服务实现
 * 
 * 提供三种协议 (JT/T 808、MQTT、HTTP) 的设备绑定可靠性保证
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class BindingServiceImpl implements BindingService {
    
    private static final Logger log = LoggerFactory.getLogger(BindingServiceImpl.class);
    
    /** 绑定存储 (bindingId -> DeviceBinding) */
    private final Map<String, DeviceBinding> bindingStore = new ConcurrentHashMap<>();
    
    /** 设备索引 (deviceId -> bindingId) */
    private final Map<String, String> deviceIndex = new ConcurrentHashMap<>();
    
    /** VIN 索引 (vin -> bindingId) */
    private final Map<String, String> vinIndex = new ConcurrentHashMap<>();
    
    /** 鉴权码缓存 (deviceId -> authCode) */
    private final Map<String, String> authCodeCache = new ConcurrentHashMap<>();
    
    /** 鉴权码过期时间 (deviceId -> expireTime) */
    private final Map<String, LocalDateTime> authCodeExpireTime = new ConcurrentHashMap<>();
    
    /** 事件存储 */
    private final List<BindingEvent> eventStore = Collections.synchronizedList(new ArrayList<>());
    
    /** 鉴权码有效期 (默认 24 小时) */
    private static final Duration AUTH_CODE_TTL = Duration.ofHours(24);
    
    /** 最大重试次数 */
    private static final int MAX_RETRY_COUNT = 5;
    
    // ==================== 绑定操作 ====================
    
    @Override
    public DeviceBinding createPendingBinding(String deviceId, String vin, ProtocolType protocol) {
        log.info("创建待确认绑定: deviceId={}, vin={}, protocol={}", deviceId, vin, protocol);
        
        // 检查设备是否已绑定
        String existingBindingId = deviceIndex.get(deviceId);
        if (existingBindingId != null) {
            DeviceBinding existing = bindingStore.get(existingBindingId);
            if (existing != null && existing.isValid()) {
                throw new RuntimeException("设备已绑定: " + deviceId);
            }
        }
        
        // 创建绑定
        String bindingId = generateBindingId();
        DeviceBinding binding = new DeviceBinding(deviceId, vin);
        binding.setBindingId(bindingId);
        binding.setProtocol(protocol);
        binding.setStatus(BindingStatus.PENDING);
        binding.setBindTime(LocalDateTime.now());
        
        // 如果是 JT/T 808，生成鉴权码
        if (protocol == ProtocolType.JTT808) {
            String authCode = generateAuthCode(deviceId);
            binding.setAuthCode(authCode);
            binding.setAuthCodeExpireTime(LocalDateTime.now().plus(AUTH_CODE_TTL));
        }
        
        // 存储
        bindingStore.put(bindingId, binding);
        deviceIndex.put(deviceId, bindingId);
        vinIndex.put(vin, bindingId);
        
        // 记录事件
        recordEvent(BindingEvent.bindRequest(bindingId, deviceId, vin, protocol));
        
        log.info("待确认绑定创建成功: bindingId={}", bindingId);
        return binding;
    }
    
    @Override
    public DeviceBinding createBinding(String deviceId, String vin, ProtocolType protocol, String tenantId) {
        log.info("创建绑定: deviceId={}, vin={}, protocol={}, tenantId={}", deviceId, vin, protocol, tenantId);
        
        // 检查是否已存在
        String existingBindingId = deviceIndex.get(deviceId);
        if (existingBindingId != null) {
            DeviceBinding existing = bindingStore.get(existingBindingId);
            if (existing != null && existing.getStatus() == BindingStatus.BOUND) {
                log.info("设备已绑定，返回现有绑定: deviceId={}", deviceId);
                return existing;
            }
        }
        
        // 创建并立即确认
        DeviceBinding binding = createPendingBinding(deviceId, vin, protocol);
        binding.setTenantId(tenantId);
        binding = confirmBinding(binding.getBindingId());
        
        return binding;
    }
    
    @Override
    public DeviceBinding confirmBinding(String bindingId) {
        log.info("确认绑定: bindingId={}", bindingId);
        
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding == null) {
            throw new RuntimeException("绑定不存在: " + bindingId);
        }
        
        // 更新状态
        binding.setStatus(BindingStatus.BOUND);
        binding.setLastConfirmTime(LocalDateTime.now());
        binding.resetRetry();
        
        // 记录事件
        recordEvent(BindingEvent.bindSuccess(bindingId, binding.getDeviceId(), 
            binding.getVin(), binding.getProtocol()));
        
        log.info("绑定确认成功: bindingId={}, deviceId={}, vin={}", 
            bindingId, binding.getDeviceId(), binding.getVin());
        
        return binding;
    }
    
    @Override
    public void unbind(String bindingId, String reason) {
        log.info("解绑设备: bindingId={}, reason={}", bindingId, reason);
        
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding == null) {
            log.warn("绑定不存在，忽略解绑: bindingId={}", bindingId);
            return;
        }
        
        // 更新状态
        binding.setStatus(BindingStatus.UNBOUND);
        
        // 移除索引
        deviceIndex.remove(binding.getDeviceId());
        vinIndex.remove(binding.getVin());
        
        // 记录事件
        recordEvent(BindingEvent.unbindSuccess(bindingId, binding.getDeviceId(),
            binding.getVin(), binding.getProtocol()));
        
        log.info("解绑成功: bindingId={}, deviceId={}", bindingId, binding.getDeviceId());
    }
    
    @Override
    public void forceUnbind(String bindingId, String operator, String reason) {
        log.warn("强制解绑: bindingId={}, operator={}, reason={}", bindingId, operator, reason);
        
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding != null) {
            binding.addAttribute("forceUnbindOperator", operator);
            binding.addAttribute("forceUnbindReason", reason);
        }
        
        unbind(bindingId, reason);
    }
    
    // ==================== 绑定恢复 ====================
    
    @Override
    public void markPendingRecover(String bindingId) {
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding != null && binding.getStatus() == BindingStatus.BOUND) {
            binding.setStatus(BindingStatus.PENDING_RECOVER);
            log.info("标记待恢复: bindingId={}, deviceId={}", bindingId, binding.getDeviceId());
        }
    }
    
    @Override
    public DeviceBinding recoverBinding(String bindingId) {
        log.info("恢复绑定: bindingId={}", bindingId);
        
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding == null) {
            throw new RuntimeException("绑定不存在: " + bindingId);
        }
        
        // 恢复绑定
        binding.setStatus(BindingStatus.BOUND);
        binding.updateConfirmTime();
        binding.resetRetry();
        
        // 记录事件
        recordEvent(BindingEvent.bindRecovered(bindingId, binding.getDeviceId(),
            binding.getVin(), binding.getProtocol()));
        
        log.info("绑定恢复成功: bindingId={}", bindingId);
        return binding;
    }
    
    @Override
    public void expireBinding(String bindingId) {
        log.warn("绑定过期: bindingId={}", bindingId);
        
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding != null) {
            binding.setStatus(BindingStatus.EXPIRED);
            
            // 移除索引
            deviceIndex.remove(binding.getDeviceId());
            vinIndex.remove(binding.getVin());
            
            // 记录事件
            recordEvent(BindingEvent.bindExpired(bindingId, binding.getDeviceId(),
                binding.getVin(), binding.getProtocol()));
        }
    }
    
    @Override
    public DeviceBinding rebind(String bindingId) {
        log.info("重新绑定: bindingId={}", bindingId);
        
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding == null) {
            throw new RuntimeException("绑定不存在: " + bindingId);
        }
        
        // 重置状态
        binding.setStatus(BindingStatus.BOUND);
        binding.updateConfirmTime();
        binding.resetRetry();
        
        // 重新建立索引
        deviceIndex.put(binding.getDeviceId(), bindingId);
        vinIndex.put(binding.getVin(), bindingId);
        
        return binding;
    }
    
    // ==================== 绑定查询 ====================
    
    @Override
    public DeviceBinding getById(String bindingId) {
        return bindingStore.get(bindingId);
    }
    
    @Override
    public DeviceBinding getByDeviceId(String deviceId) {
        String bindingId = deviceIndex.get(deviceId);
        return bindingId != null ? bindingStore.get(bindingId) : null;
    }
    
    @Override
    public DeviceBinding getByVin(String vin) {
        String bindingId = vinIndex.get(vin);
        return bindingId != null ? bindingStore.get(bindingId) : null;
    }
    
    @Override
    public DeviceBinding getByVinAndProtocol(String vin, ProtocolType protocol) {
        String bindingId = vinIndex.get(vin);
        if (bindingId == null) {
            return null;
        }
        DeviceBinding binding = bindingStore.get(bindingId);
        return (binding != null && binding.getProtocol() == protocol) ? binding : null;
    }
    
    @Override
    public List<DeviceBinding> findByTenantId(String tenantId) {
        return bindingStore.values().stream()
            .filter(b -> tenantId.equals(b.getTenantId()))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<DeviceBinding> findByStatus(BindingStatus status) {
        return bindingStore.values().stream()
            .filter(b -> b.getStatus() == status)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<DeviceBinding> findNeedHeartbeatConfirm(LocalDateTime threshold) {
        return bindingStore.values().stream()
            .filter(DeviceBinding::isValid)
            .filter(b -> b.getLastConfirmTime() == null || 
                         b.getLastConfirmTime().isBefore(threshold))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<DeviceBinding> findNeedRecovery() {
        return bindingStore.values().stream()
            .filter(b -> b.getStatus().needsRecovery())
            .filter(b -> !b.isMaxRetryExceeded(MAX_RETRY_COUNT))
            .collect(Collectors.toList());
    }
    
    // ==================== 绑定更新 ====================
    
    @Override
    public void updateLastConfirmTime(String bindingId) {
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding != null) {
            binding.updateConfirmTime();
        }
    }
    
    @Override
    public void updateStatus(String bindingId, BindingStatus status) {
        DeviceBinding binding = bindingStore.get(bindingId);
        if (binding != null) {
            binding.setStatus(status);
        }
    }
    
    @Override
    public void save(DeviceBinding binding) {
        if (binding.getBindingId() == null) {
            binding.setBindingId(generateBindingId());
        }
        bindingStore.put(binding.getBindingId(), binding);
        deviceIndex.put(binding.getDeviceId(), binding.getBindingId());
        vinIndex.put(binding.getVin(), binding.getBindingId());
    }
    
    // ==================== 鉴权码 (JT/T 808) ====================
    
    @Override
    public String generateAuthCode(String deviceId) {
        // 格式: 时间戳(8位) + 随机数(8位) + 校验位(4位)
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String random = UUID.randomUUID().toString().substring(0, 8);
        String checksum = md5(deviceId + timestamp + random).substring(0, 4);
        String authCode = timestamp + random + checksum;
        
        // 缓存
        authCodeCache.put(deviceId, authCode);
        authCodeExpireTime.put(deviceId, LocalDateTime.now().plus(AUTH_CODE_TTL));
        
        log.debug("生成鉴权码: deviceId={}, authCode={}", deviceId, authCode);
        return authCode;
    }
    
    @Override
    public boolean validateAuthCode(String deviceId, String authCode) {
        String cachedCode = authCodeCache.get(deviceId);
        LocalDateTime expireTime = authCodeExpireTime.get(deviceId);
        
        if (cachedCode == null || expireTime == null) {
            log.warn("鉴权码不存在: deviceId={}", deviceId);
            return false;
        }
        
        if (expireTime.isBefore(LocalDateTime.now())) {
            log.warn("鉴权码已过期: deviceId={}", deviceId);
            authCodeCache.remove(deviceId);
            authCodeExpireTime.remove(deviceId);
            return false;
        }
        
        boolean valid = cachedCode.equals(authCode);
        if (!valid) {
            log.warn("鉴权码不正确: deviceId={}, expected={}, actual={}", deviceId, cachedCode, authCode);
        }
        
        return valid;
    }
    
    @Override
    public void removeAuthCode(String deviceId) {
        authCodeCache.remove(deviceId);
        authCodeExpireTime.remove(deviceId);
        log.debug("删除鉴权码: deviceId={}", deviceId);
    }
    
    // ==================== 事件记录 ====================
    
    @Override
    public void recordEvent(BindingEvent event) {
        if (event.getEventId() == null) {
            event.setEventId(UUID.randomUUID().toString());
        }
        eventStore.add(event);
        log.debug("记录绑定事件: eventId={}, type={}, deviceId={}", 
            event.getEventId(), event.getEventType(), event.getDeviceId());
    }
    
    @Override
    public List<BindingEvent> getEventHistory(String bindingId, int limit) {
        return eventStore.stream()
            .filter(e -> bindingId.equals(e.getBindingId()))
            .sorted((a, b) -> b.getEventTime().compareTo(a.getEventTime()))
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    // ==================== 统计信息 ====================
    
    @Override
    public BindingStatistics getStatistics(String tenantId) {
        BindingStatistics stats = new BindingStatistics();
        
        List<DeviceBinding> bindings = tenantId != null ? 
            findByTenantId(tenantId) : new ArrayList<>(bindingStore.values());
        
        stats.setTotalBindings(bindings.size());
        stats.setJtt808Bindings(bindings.stream()
            .filter(b -> b.getProtocol() == ProtocolType.JTT808).count());
        stats.setMqttBindings(bindings.stream()
            .filter(b -> b.getProtocol() == ProtocolType.MQTT).count());
        stats.setHttpBindings(bindings.stream()
            .filter(b -> b.getProtocol() == ProtocolType.HTTP).count());
        stats.setPendingBindings(bindings.stream()
            .filter(b -> b.getStatus() == BindingStatus.PENDING).count());
        stats.setErrorBindings(bindings.stream()
            .filter(b -> b.getStatus() == BindingStatus.ERROR).count());
        
        // 计算在线/离线
        LocalDateTime onlineThreshold = LocalDateTime.now().minusMinutes(5);
        long online = bindings.stream()
            .filter(b -> b.getStatus() == BindingStatus.BOUND)
            .filter(b -> b.getLastConfirmTime() != null && 
                         b.getLastConfirmTime().isAfter(onlineThreshold))
            .count();
        stats.setOnlineDevices(online);
        stats.setOfflineDevices(stats.getTotalBindings() - online);
        
        return stats;
    }
    
    @Override
    public long countByProtocol(ProtocolType protocol) {
        return bindingStore.values().stream()
            .filter(b -> b.getProtocol() == protocol)
            .count();
    }
    
    @Override
    public long countOnline(String tenantId) {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(5);
        return bindingStore.values().stream()
            .filter(b -> tenantId == null || tenantId.equals(b.getTenantId()))
            .filter(b -> b.getStatus() == BindingStatus.BOUND)
            .filter(b -> b.getLastConfirmTime() != null && 
                         b.getLastConfirmTime().isAfter(threshold))
            .count();
    }
    
    // ==================== 辅助方法 ====================
    
    private String generateBindingId() {
        return "BIND_" + System.currentTimeMillis() + "_" + 
               UUID.randomUUID().toString().substring(0, 8);
    }
    
    private String md5(String input) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString().substring(0, 32);
        }
    }
}