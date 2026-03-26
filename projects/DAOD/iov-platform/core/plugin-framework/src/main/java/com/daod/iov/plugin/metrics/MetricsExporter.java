package com.daod.iov.plugin.metrics;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/**
 * Prometheus 指标导出器
 * 
 * 提供 HTTP 端点供 Prometheus 抓取：
 * - 默认端口: 9090
 * - 默认路径: /metrics
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class MetricsExporter {
    
    private static final Logger logger = LoggerFactory.getLogger(MetricsExporter.class);
    
    private final MetricsRegistry registry;
    private final int port;
    private final String path;
    
    private HttpServer server;
    private volatile boolean running = false;
    
    public MetricsExporter(MetricsRegistry registry) {
        this(registry, 9090, "/metrics");
    }
    
    public MetricsExporter(MetricsRegistry registry, int port, String path) {
        this.registry = registry;
        this.port = port;
        this.path = path;
    }
    
    /**
     * 启动导出器
     */
    public synchronized void start() throws IOException {
        if (running) {
            logger.warn("指标导出器已在运行");
            return;
        }
        
        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext(path, new MetricsHandler());
        server.setExecutor(null);
        server.start();
        
        running = true;
        logger.info("指标导出器启动: http://localhost:{}{}", port, path);
    }
    
    /**
     * 停止导出器
     */
    public synchronized void stop() {
        if (!running || server == null) {
            return;
        }
        
        server.stop(1);
        running = false;
        logger.info("指标导出器已停止");
    }
    
    /**
     * 是否运行中
     */
    public boolean isRunning() {
        return running;
    }
    
    /**
     * 获取导出URL
     */
    public String getExportUrl() {
        return "http://localhost:" + port + path;
    }
    
    // ==================== HTTP 处理器 ====================
    
    private class MetricsHandler implements HttpHandler {
        
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            
            if (!"GET".equals(method)) {
                sendResponse(exchange, 405, "Method Not Allowed");
                return;
            }
            
            try {
                // 收集指标
                String metrics = registry.exportPrometheusFormat();
                
                // 发送响应
                exchange.getResponseHeaders().set("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
                sendResponse(exchange, 200, metrics);
                
            } catch (Exception e) {
                logger.error("导出指标失败", e);
                sendResponse(exchange, 500, "Internal Server Error: " + e.getMessage());
            }
        }
        
        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(statusCode, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }
}