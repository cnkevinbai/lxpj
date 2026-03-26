# 远程控制模块设计文档

**模块名称**: remote-control  
**版本**: 1.0.0  
**优先级**: 🟡 中  
**最后更新**: 2026-03-18

---

## 1. 模块概述

远程控制模块负责向车载终端下发控制指令，实现车辆的远程管理功能。

### 1.1 支持的指令类型

| 指令 | 类型 | 风险等级 | 说明 |
|------|------|----------|------|
| LOCK_VEHICLE | 锁车 | 🔴 高 | 远程锁车 |
| UNLOCK_VEHICLE | 解锁 | 🟡 中 | 远程解锁 |
| LIMIT_SPEED | 限速 | 🔴 高 | 限制最高速度 |
| CANCEL_SPEED_LIMIT | 取消限速 | 🟡 中 | 取消速度限制 |
| REMOTE_SHUTDOWN | 远程关机 | 🔴 高 | 远程熄火 |
| RESTART_DEVICE | 重启 | 🟢 低 | 重启终端设备 |
| RESET_FACTORY | 恢复出厂 | 🔴 高 | 恢复出厂设置 |
| UPDATE_CONFIG | 更新配置 | 🟢 低 | 更新终端参数 |
| REQUEST_LOCATION | 请求位置 | 🟢 低 | 立即上报位置 |
| REQUEST_STATUS | 请求状态 | 🟢 低 | 查询终端状态 |
| CLEAR_ALARM | 清除告警 | 🟢 低 | 清除告警记录 |
| SET_GEOFENCE | 设置围栏 | 🟡 中 | 设置电子围栏 |
| CLEAR_GEOFENCE | 清除围栏 | 🟢 低 | 清除电子围栏 |
| START_RECORDING | 开始录像 | 🟢 低 | 启动视频录制 |
| STOP_RECORDING | 停止录像 | 🟢 低 | 停止视频录制 |

### 1.2 核心特性

- **优先级队列**: 4级优先级控制
- **审批流程**: 高风险指令需审批
- **状态跟踪**: 实时执行状态
- **超时重试**: 自动重试机制
- **审计日志**: 完整操作记录

---

## 2. 架构设计

### 2.1 模块架构

```
┌─────────────────────────────────────────────────────────────┐
│                   RemoteControlService                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Command Queue (优先级队列)               │    │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐           │    │
│  │  │IMMED. │ │ HIGH  │ │NORMAL │ │ LOW   │           │    │
│  │  │ 紧急  │ │ 高    │ │ 正常  │ │ 低    │           │    │
│  │  └───────┘ └───────┘ └───────┘ └───────┘           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Approval   │  │  Execution  │  │    Audit    │         │
│  │   Manager   │  │   Tracker   │  │   Service   │         │
│  │  (审批管理)  │  │  (执行追踪)  │  │  (审计服务)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 指令执行流程

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ 创建指令 │───▶│ 风险判断 │───▶│ 入队列   │───▶│ 执行下发 │
└─────────┘    └────┬────┘    └─────────┘    └────┬────┘
                    │                              │
                    │ 高风险                       │
                    ▼                              ▼
             ┌──────────┐                   ┌──────────┐
             │ 审批流程  │                   │ 等待应答  │
             └────┬─────┘                   └────┬─────┘
                  │                              │
                  │ 审批通过                     │
                  └──────────────────────────────┘
                                                 │
                    ┌──────────────┬─────────────┘
                    │              │
                    ▼              ▼
             ┌──────────┐   ┌──────────┐
             │ 执行成功  │   │ 执行失败  │──▶ 重试
             └──────────┘   └──────────┘
```

---

## 3. 数据模型

### 3.1 指令执行记录

```java
public class CommandExecution {
    private String id;              // 执行ID
    private String vehicleId;       // 车辆ID
    private CommandType type;       // 指令类型
    private CommandPriority priority;// 优先级
    private CommandStatus status;   // 执行状态
    private Map<String, Object> params; // 指令参数
    private String result;          // 执行结果
    private String errorMessage;    // 错误信息
    private int retryCount;         // 重试次数
    private String approvalId;      // 审批ID(高风险)
    private LocalDateTime createTime;
    private LocalDateTime executeTime;
    private LocalDateTime completeTime;
}
```

### 3.2 审计日志

```java
public class AuditLog {
    private String id;              // 日志ID
    private String operatorId;      // 操作人ID
    private String operatorName;    // 操作人名称
    private String vehicleId;       // 车辆ID
    private CommandType commandType;// 指令类型
    private String action;          // 操作动作
    private String detail;          // 详细描述
    private String ipAddress;       // 操作IP
    private LocalDateTime timestamp;// 操作时间
}
```

---

## 4. API设计

### 4.1 指令下发API

```java
public class RemoteControlService implements IModule {
    
    /**
     * 发送指令
     * @param vehicleId 车辆ID
     * @param type 指令类型
     * @param params 参数
     * @param priority 优先级
     * @return 执行ID
     */
    public String sendCommand(String vehicleId, CommandType type, 
                              Map<String, Object> params, CommandPriority priority);
    
    /**
     * 批量发送指令
     */
    public List<String> sendBatchCommand(List<String> vehicleIds, CommandType type,
                                          Map<String, Object> params, CommandPriority priority);
    
    /**
     * 查询指令状态
     */
    public CommandExecution queryCommandStatus(String executionId);
    
    /**
     * 取消指令
     */
    public boolean cancelCommand(String executionId);
    
    /**
     * 审批指令
     */
    public void approveCommand(String executionId, String approverId, boolean approved);
    
    /**
     * 查询审计日志
     */
    public PageResponse<AuditLog> queryAuditLogs(String vehicleId, LocalDateTime start, LocalDateTime end);
}
```

### 4.2 指令示例

```java
// 发送锁车指令(高风险，需要审批)
String executionId = remoteControl.sendCommand(
    "VEHICLE_001",
    CommandType.LOCK_VEHICLE,
    Map.of("reason", "逾期未缴费"),
    CommandPriority.HIGH
);

// 发送请求位置指令(低风险)
remoteControl.sendCommand(
    "VEHICLE_001",
    CommandType.REQUEST_LOCATION,
    Map.of(),
    CommandPriority.NORMAL
);

// 设置限速
remoteControl.sendCommand(
    "VEHICLE_001",
    CommandType.LIMIT_SPEED,
    Map.of("maxSpeed", 30),
    CommandPriority.HIGH
);
```

---

## 5. 审批流程

### 5.1 审批流程图

```
高风险指令 ────▶ 创建审批单 ────▶ 等待审批
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
                 审批通过          审批拒绝          超时自动拒绝
                    │                 │
                    ▼                 ▼
               加入执行队列        取消指令
```

### 5.2 审批配置

```java
// 高风险指令配置
highRiskCommands: ["LOCK_VEHICLE", "LIMIT_SPEED", "REMOTE_SHUTDOWN", "RESET_FACTORY"]

// 审批人配置
approvers: ["admin", "fleet_manager"]

// 审批超时
approvalTimeout: 3600000  // 1小时
```

---

## 6. 配置项

```yaml
remoteControl:
  commandTimeout: 30000          # 指令超时(ms)
  maxRetryCount: 3               # 最大重试次数
  enableAudit: true              # 启用审计日志
  highRiskCommands:              # 高风险指令列表
    - LOCK_VEHICLE
    - LIMIT_SPEED
    - REMOTE_SHUTDOWN
    - RESET_FACTORY
  approvalRequired: true         # 高风险指令需审批
  approvalTimeout: 3600000       # 审批超时(ms)
  queueCapacity: 10000           # 队列容量
```

---

## 7. 扩展点

| 扩展点 | 接口 | 说明 |
|--------|------|------|
| 控制指令 | ControlCommand | 自定义指令类型 |
| 指令验证 | CommandValidator | 自定义验证逻辑 |

---

## 8. 安全考虑

1. **权限控制**: 操作人必须有相应权限
2. **高风险审批**: 关键操作需要审批
3. **操作审计**: 所有操作记录审计日志
4. **防重放**: 指令包含时间戳和nonce
5. **加密传输**: 指令传输使用加密通道

---

_文档维护：渔晓白_