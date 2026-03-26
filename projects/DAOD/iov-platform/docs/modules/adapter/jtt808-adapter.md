# JT/T 808协议适配模块 (jtt808-adapter)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | jtt808-adapter |
| 模块版本 | 1.0.0 |
| 模块类型 | adapter |
| 优先级 | 70 |
| 负责人 | 后端开发 |
| 开发周期 | Week 7-8 |

### 1.2 功能描述

JT/T 808协议适配模块实现道路运输车辆卫星定位系统终端通讯协议，支持终端接入、位置上报、指令下发等功能。

### 1.3 核心能力

- JT/T 808-2011/2019协议解析
- TCP长连接管理
- 消息编解码
- 终端鉴权
- 位置数据上报
- 指令下发

## 2. 技术设计

### 2.1 协议架构

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          JT/T 808协议架构                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              应用层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        业务消息处理                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │位置上报处理  │ │告警上报处理  │ │指令下发处理  │ │参数查询处理  │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              协议层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        消息编解码                                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │消息头解析    │ │消息体解析    │ │校验码计算    │ │转义处理     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              传输层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        TCP连接管理                                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │连接建立      │ │心跳保活      │ │断线重连      │ │会话管理     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.jtt808;

public interface Jtt808MessageHandler {
    
    Jtt808Message decode(byte[] data);
    
    byte[] encode(Jtt808Message message);
    
    void handle(Jtt808Message message, Channel channel);
}

public interface Jtt808ConnectionManager {
    
    void registerConnection(String phone, Channel channel);
    
    void unregisterConnection(String phone);
    
    Channel getConnection(String phone);
    
    boolean isOnline(String phone);
    
    List<String> getOnlineDevices();
    
    void send(String phone, Jtt808Message message);
    
    void broadcast(Jtt808Message message);
}

public interface Jtt808AuthService {
    
    boolean authenticate(String phone, String authCode);
    
    void registerDevice(String phone, String vin);
    
    String getVinByPhone(String phone);
}

public interface Jtt808LocationService {
    
    void processLocation(String vin, Jtt808LocationData location);
    
    void processBatchLocation(String vin, List<Jtt808LocationData> locations);
}
```

### 2.3 消息模型

```java
@Data
public class Jtt808Message {
    private MessageHeader header;
    private byte[] body;
}

@Data
public class MessageHeader {
    private int messageId;
    private int bodyLength;
    private String phone;
    private int serialNumber;
    private Integer totalPackageCount;
    private Integer packageIndex;
}

public enum MessageType {
    TERMINAL_GENERAL_RESPONSE(0x0001),
    TERMINAL_HEARTBEAT(0x0002),
    TERMINAL_UNREGISTER(0x0003),
    TERMINAL_AUTHENTICATION(0x0102),
    TERMINAL_REGISTER(0x0100),
    LOCATION_REPORT(0x0200),
    LOCATION_BATCH_REPORT(0x0704),
    TERMINAL_PROPERTIES(0x0107),
    
    PLATFORM_GENERAL_RESPONSE(0x8001),
    TERMINAL_REGISTER_RESPONSE(0x8100),
    TERMINAL_CONTROL(0x8105),
    SET_TERMINAL_PARAMETERS(0x8103),
    QUERY_TERMINAL_PARAMETERS(0x8104),
    LOCATION_QUERY(0x8201),
    TEXT_MESSAGE(0x8300);
    
    private final int code;
}

@Data
public class Jtt808LocationData {
    private String vin;
    private int alarmFlag;
    private int status;
    private double latitude;
    private double longitude;
    private int altitude;
    private int speed;
    private int direction;
    private LocalDateTime timestamp;
    private List<ExtraItem> extras;
}

@Data
public class Jtt808RegisterData {
    private String provinceId;
    private String cityId;
    private String manufacturerId;
    private String terminalModel;
    private String terminalId;
    private String plateColor;
}
```

### 2.4 消息编解码实现

```java
@Component
public class Jtt808MessageCodec {
    
    private static final byte FLAG = 0x7E;
    private static final byte ESCAPE = 0x7D;
    
    public Jtt808Message decode(ByteBuf buf) {
        int startIndex = buf.indexOf(buf.readerIndex(), buf.writerIndex(), FLAG);
        int endIndex = buf.indexOf(startIndex + 1, buf.writerIndex(), FLAG);
        
        if (startIndex < 0 || endIndex < 0) {
            return null;
        }
        
        byte[] rawBytes = new byte[endIndex - startIndex - 1];
        buf.getBytes(startIndex + 1, rawBytes);
        
        byte[] unescapedBytes = unescape(rawBytes);
        
        if (!verifyChecksum(unescapedBytes)) {
            throw new Jtt808DecodeException("Checksum verification failed");
        }
        
        return parseMessage(unescapedBytes);
    }
    
    public ByteBuf encode(Jtt808Message message) {
        ByteBuf buf = Unpooled.buffer();
        buf.writeByte(FLAG);
        
        byte[] headerBytes = encodeHeader(message.getHeader());
        byte[] bodyBytes = message.getBody();
        
        int bodyLength = bodyBytes != null ? bodyBytes.length : 0;
        headerBytes[2] = (byte) ((bodyLength >> 8) & 0xFF);
        headerBytes[3] = (byte) (bodyLength & 0xFF);
        
        byte[] data = new byte[headerBytes.length + bodyLength];
        System.arraycopy(headerBytes, 0, data, 0, headerBytes.length);
        if (bodyBytes != null) {
            System.arraycopy(bodyBytes, 0, data, headerBytes.length, bodyLength);
        }
        
        byte checksum = calculateChecksum(data);
        
        byte[] escapedData = escape(data);
        
        buf.writeBytes(escapedData);
        buf.writeByte(escapeByte(checksum));
        buf.writeByte(FLAG);
        
        return buf;
    }
    
    private byte[] unescape(byte[] data) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        for (int i = 0; i < data.length; i++) {
            if (data[i] == ESCAPE && i + 1 < data.length) {
                out.write(data[i + 1] ^ 0x20);
                i++;
            } else {
                out.write(data[i]);
            }
        }
        return out.toByteArray();
    }
    
    private byte[] escape(byte[] data) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        for (byte b : data) {
            if (b == FLAG) {
                out.write(ESCAPE);
                out.write(FLAG ^ 0x20);
            } else if (b == ESCAPE) {
                out.write(ESCAPE);
                out.write(ESCAPE ^ 0x20);
            } else {
                out.write(b);
            }
        }
        return out.toByteArray();
    }
    
    private byte calculateChecksum(byte[] data) {
        byte checksum = 0;
        for (byte b : data) {
            checksum ^= b;
        }
        return checksum;
    }
    
    private boolean verifyChecksum(byte[] data) {
        if (data.length < 2) {
            return false;
        }
        byte expected = data[data.length - 1];
        byte actual = calculateChecksum(Arrays.copyOf(data, data.length - 1));
        return expected == actual;
    }
    
    private byte escapeByte(byte b) {
        if (b == FLAG || b == ESCAPE) {
            return (byte) (b ^ 0x20);
        }
        return b;
    }
}
```

### 2.5 Netty服务实现

```java
@Component
public class Jtt808Server {
    
    @Value("${jtt808.server.port:8808}")
    private int port;
    
    @Autowired
    private Jtt808MessageDispatcher messageDispatcher;
    
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;
    private Channel serverChannel;
    
    public void start() throws InterruptedException {
        bossGroup = new NioEventLoopGroup(1);
        workerGroup = new NioEventLoopGroup();
        
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel.class)
            .childHandler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) {
                    ChannelPipeline pipeline = ch.pipeline();
                    pipeline.addLast("decoder", new Jtt808MessageDecoder());
                    pipeline.addLast("encoder", new Jtt808MessageEncoder());
                    pipeline.addLast("handler", new Jtt808ServerHandler(messageDispatcher));
                }
            })
            .option(ChannelOption.SO_BACKLOG, 128)
            .childOption(ChannelOption.SO_KEEPALIVE, true)
            .childOption(ChannelOption.TCP_NODELAY, true);
        
        ChannelFuture future = bootstrap.bind(port).sync();
        serverChannel = future.channel();
        log.info("JT/T 808 Server started on port {}", port);
    }
    
    public void stop() {
        if (serverChannel != null) {
            serverChannel.close();
        }
        if (bossGroup != null) {
            bossGroup.shutdownGracefully();
        }
        if (workerGroup != null) {
            workerGroup.shutdownGracefully();
        }
        log.info("JT/T 808 Server stopped");
    }
}

@ChannelHandler.Sharable
public class Jtt808ServerHandler extends SimpleChannelInboundHandler<Jtt808Message> {
    
    private final Jtt808MessageDispatcher dispatcher;
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, Jtt808Message message) {
        dispatcher.dispatch(message, ctx.channel());
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        dispatcher.handleDisconnect(ctx.channel());
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("Channel exception: {}", cause.getMessage());
        ctx.close();
    }
}
```

## 3. API设计

### 3.1 内部API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /internal/jtt808/send | 发送指令 |
| POST | /internal/jtt808/broadcast | 广播消息 |
| GET | /internal/jtt808/online | 获取在线设备 |

### 3.2 指令下发示例

```java
@Service
public class Jtt808CommandService {
    
    @Autowired
    private Jtt808ConnectionManager connectionManager;
    
    public void sendTextMessage(String phone, String text) {
        Jtt808Message message = new Jtt808Message();
        MessageHeader header = new MessageHeader();
        header.setMessageId(MessageType.TEXT_MESSAGE.getCode());
        header.setPhone(phone);
        header.setSerialNumber(generateSerialNumber());
        message.setHeader(header);
        
        byte[] body = encodeTextMessage(text);
        message.setBody(body);
        
        connectionManager.send(phone, message);
    }
    
    public void queryLocation(String phone) {
        Jtt808Message message = new Jtt808Message();
        MessageHeader header = new MessageHeader();
        header.setMessageId(MessageType.LOCATION_QUERY.getCode());
        header.setPhone(phone);
        header.setSerialNumber(generateSerialNumber());
        message.setHeader(header);
        message.setBody(new byte[0]);
        
        connectionManager.send(phone, message);
    }
}
```

## 4. 配置项

```yaml
jtt808:
  server:
    enabled: true
    port: 8808
    boss-threads: 1
    worker-threads: 4
  connection:
    idle-timeout: 300
    max-connections: 10000
  message:
    max-length: 2048
    response-timeout: 30000
  protocol:
    version: 2019
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testMessageDecode | 测试消息解码 | 解码正确 |
| testMessageEncode | 测试消息编码 | 编码正确 |
| testEscape | 测试转义处理 | 转义正确 |
| testChecksum | 测试校验码 | 校验正确 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testTerminalConnect | 测试终端连接 | 连接建立成功 |
| testAuthentication | 测试终端鉴权 | 鉴权成功 |
| testLocationReport | 测试位置上报 | 数据解析正确 |
| testCommandSend | 测试指令下发 | 指令发送成功 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: vehicle-access
    version: ">=1.0.0"
  - name: monitor-service
    version: ">=1.0.0"
```

## 7. 部署说明

### 7.1 资源需求

```yaml
resources:
  cpu: "200m"
  memory: "256Mi"
```

## 8. 监控指标

| 指标名 | 类型 | 描述 |
|-------|------|------|
| jtt808_connections | Gauge | 当前连接数 |
| jtt808_messages_received | Counter | 接收消息数 |
| jtt808_messages_sent | Counter | 发送消息数 |
| jtt808_decode_errors | Counter | 解码错误数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
| 1.1.0 | 2026-03-26 | 添加设备绑定可靠性文档引用 |

---

## 10. 相关文档

| 文档 | 路径 | 描述 |
|------|------|------|
| 设备绑定可靠性设计 | [../business/DEVICE_BINDING_RELIABILITY.md](../business/DEVICE_BINDING_RELIABILITY.md) | JT/T 808 设备绑定鉴权码验证、重连重试机制详解 |
| 车辆接入服务 | [../business/vehicle-access.md](../business/vehicle-access.md) | 车辆接入服务设计 |

> 📌 **重要**: JT/T 808 协议的设备绑定可靠性设计详见 [DEVICE_BINDING_RELIABILITY.md](../business/DEVICE_BINDING_RELIABILITY.md) 第3章，包含：
> - 终端注册与鉴权流程 (消息 0x0100/0x0102)
> - 鉴权码生成与验证机制
> - 重连重试与连接管理
> - 绑定数据持久化设计
