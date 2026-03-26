package com.daod.iov.modules.jtt808;

import com.daod.iov.plugin.*;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * JT/T 808 协议适配器模块
 * 
 * 功能：
 * - TCP 服务 (端口 8888)
 * - 消息编解码
 * - 消息路由
 * - 会话管理
 * 
 * @author daod-team
 * @version 1.0.0
 */
@Component
public class Jtt808AdapterModule implements ISFU {
    
    private static final Logger logger = LoggerFactory.getLogger(Jtt808AdapterModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    // Netty 组件
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;
    private Channel serverChannel;
    
    // 会话管理
    private final Map<String, TerminalSession> sessions = new ConcurrentHashMap<>();
    private final AtomicInteger connectionCount = new AtomicInteger(0);
    
    private int port = 8888;
    
    public Jtt808AdapterModule() {
        this.metadata = new ModuleMetadata("jtt808-adapter", "1.0.0", "JT/T 808协议适配器");
        this.metadata.setType("adapter");
        this.metadata.setPriority(20);
    }
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        logger.info("JT/T 808 适配器初始化中...");
        
        bossGroup = new NioEventLoopGroup(1);
        workerGroup = new NioEventLoopGroup();
        
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
        
        logger.info("JT/T 808 适配器初始化完成");
    }
    
    @Override
    public void start() {
        logger.info("JT/T 808 适配器启动中...");
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                .channel(NioServerSocketChannel.class)
                .option(ChannelOption.SO_BACKLOG, 128)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ChannelPipeline pipeline = ch.pipeline();
                        // 添加编解码器和处理器
                        pipeline.addLast("decoder", new Jtt808MessageDecoder());
                        pipeline.addLast("encoder", new Jtt808MessageEncoder());
                        pipeline.addLast("handler", new Jtt808ServerHandler(Jtt808AdapterModule.this));
                    }
                });
            
            ChannelFuture future = bootstrap.bind(port).sync();
            serverChannel = future.channel();
            
            state = ModuleState.RUNNING;
            logger.info("JT/T 808 适配器启动完成，监听端口: {}", port);
            
        } catch (Exception e) {
            logger.error("JT/T 808 适配器启动失败", e);
            state = ModuleState.ERROR;
            healthStatus = HealthStatus.UNHEALTHY;
        }
    }
    
    @Override
    public void stop() {
        logger.info("JT/T 808 适配器停止中...");
        
        if (serverChannel != null) {
            serverChannel.close();
        }
        if (bossGroup != null) {
            bossGroup.shutdownGracefully();
        }
        if (workerGroup != null) {
            workerGroup.shutdownGracefully();
        }
        
        sessions.clear();
        connectionCount.set(0);
        
        state = ModuleState.STOPPED;
        logger.info("JT/T 808 适配器已停止");
    }
    
    @Override
    public void destroy() {
        sessions.clear();
        state = ModuleState.DESTROYED;
        logger.info("JT/T 808 适配器已销毁");
    }
    
    // ==================== 会话管理 ====================
    
    public void addSession(String terminalPhone, TerminalSession session) {
        sessions.put(terminalPhone, session);
        connectionCount.incrementAndGet();
        logger.info("终端连接: {}", terminalPhone);
    }
    
    public void removeSession(String terminalPhone) {
        if (sessions.remove(terminalPhone) != null) {
            connectionCount.decrementAndGet();
            logger.info("终端断开: {}", terminalPhone);
        }
    }
    
    public TerminalSession getSession(String terminalPhone) {
        return sessions.get(terminalPhone);
    }
    
    public int getConnectionCount() {
        return connectionCount.get();
    }
    
    // ==================== 接口实现 ====================
    
    @Override
    public ModuleMetadata getMetadata() { return metadata; }
    
    @Override
    public ModuleState getState() { return state; }
    
    @Override
    public HealthStatus getHealthStatus() { return healthStatus; }
    
    @Override
    public List<Metric> getMetrics() {
        return List.of(
            new Metric("jtt808_connections", Metric.MetricType.GAUGE, connectionCount.get())
                .withLabel("module", "jtt808-adapter"),
            new Metric("jtt808_sessions", Metric.MetricType.GAUGE, sessions.size())
                .withLabel("module", "jtt808-adapter")
        );
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.healthy("JT/T 808 适配器运行正常")
            .withDetail("port", port)
            .withDetail("connections", connectionCount.get());
    }
    
    @Override
    public String getApiSpecification() { return ""; }
    
    @Override
    public List<ApiDependency> getApiDependencies() { return List.of(); }
    
    @Override
    public List<Permission> getRequiredPermissions() {
        return List.of(Permission.NETWORK_BIND);
    }
    
    @Override
    public ResourceRequirements getResourceRequirements() {
        return ResourceRequirements.large();
    }
    
    // ==================== 内部类 ====================
    
    public static class TerminalSession {
        private final String terminalPhone;
        private final Channel channel;
        private long lastSeen;
        private String plateNo;
        
        public TerminalSession(String terminalPhone, Channel channel) {
            this.terminalPhone = terminalPhone;
            this.channel = channel;
            this.lastSeen = System.currentTimeMillis();
        }
        
        public String getTerminalPhone() { return terminalPhone; }
        public Channel getChannel() { return channel; }
        public long getLastSeen() { return lastSeen; }
        public void updateLastSeen() { this.lastSeen = System.currentTimeMillis(); }
        public String getPlateNo() { return plateNo; }
        public void setPlateNo(String plateNo) { this.plateNo = plateNo; }
    }
    
    // 简化的编解码器
    static class Jtt808MessageDecoder extends ChannelInboundHandlerAdapter {
        @Override
        public void channelRead(ChannelHandlerContext ctx, Object msg) {
            // 消息解码逻辑
            ctx.fireChannelRead(msg);
        }
    }
    
    static class Jtt808MessageEncoder extends ChannelOutboundHandlerAdapter {
        @Override
        public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
            // 消息编码逻辑
            ctx.write(msg, promise);
        }
    }
    
    static class Jtt808ServerHandler extends ChannelInboundHandlerAdapter {
        private final Jtt808AdapterModule adapter;
        
        public Jtt808ServerHandler(Jtt808AdapterModule adapter) {
            this.adapter = adapter;
        }
        
        @Override
        public void channelActive(ChannelHandlerContext ctx) {
            logger.debug("新连接: {}", ctx.channel().remoteAddress());
        }
        
        @Override
        public void channelInactive(ChannelHandlerContext ctx) {
            logger.debug("连接断开: {}", ctx.channel().remoteAddress());
        }
        
        @Override
        public void channelRead(ChannelHandlerContext ctx, Object msg) {
            // 处理消息
            logger.debug("收到消息: {}", msg);
        }
        
        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
            logger.error("连接异常", cause);
            ctx.close();
        }
    }
}