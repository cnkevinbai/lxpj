package com.daod.iov.modules.httpadapter.internal.controller;

import com.daod.iov.modules.httpadapter.api.HttpAdapterService;
import com.daod.iov.modules.httpadapter.api.WebhookHandler;
import com.daod.iov.modules.httpadapter.api.dto.WebhookRequest;
import com.daod.iov.modules.httpadapter.api.dto.WebhookResult;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * Webhook 控制器
 * 
 * 提供第三方平台回调处理 API
 */
@RestController
@RequestMapping("/api/v1/webhook")
public class WebhookController {
    
    @Resource
    private HttpAdapterService httpAdapterService;
    
    /** Webhook 处理器注册表 */
    private final Map<String, WebhookHandler> handlers = new HashMap<>();
    
    /**
     * 通用 Webhook 接口
     * 
     * POST /api/v1/webhook/{source}
     */
    @PostMapping("/{source}")
    public WebhookResult handleWebhook(
            @PathVariable String source,
            @RequestHeader(value = "X-Signature", required = false) String signature,
            @RequestHeader(value = "X-Event-Type", required = false) String eventType,
            @RequestBody byte[] body) {
        
        WebhookRequest request = new WebhookRequest();
        request.setSource(source);
        request.setEventType(eventType);
        request.setBody(body);
        request.setSignature(signature);
        request.setTimestamp(System.currentTimeMillis());
        
        return httpAdapterService.handleWebhook("/" + source, request);
    }
    
    /**
     * 高德地图回调
     * 
     * POST /api/v1/webhook/amap
     */
    @PostMapping("/amap")
    public WebhookResult handleAmapWebhook(@RequestBody byte[] body) {
        return handleWebhook("amap", null, "amap_event", body);
    }
    
    /**
     * 百度地图回调
     * 
     * POST /api/v1/webhook/baidu
     */
    @PostMapping("/baidu")
    public WebhookResult handleBaiduWebhook(@RequestBody byte[] body) {
        return handleWebhook("baidu", null, "baidu_event", body);
    }
    
    /**
     * 第三方平台回调
     * 
     * POST /api/v1/webhook/thirdparty/{platform}
     */
    @PostMapping("/thirdparty/{platform}")
    public WebhookResult handleThirdpartyWebhook(
            @PathVariable String platform,
            @RequestHeader(value = "X-Signature", required = false) String signature,
            @RequestBody byte[] body) {
        
        return handleWebhook("thirdparty/" + platform, signature, "thirdparty_event", body);
    }
    
    /**
     * 健康检查
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "UP");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
}