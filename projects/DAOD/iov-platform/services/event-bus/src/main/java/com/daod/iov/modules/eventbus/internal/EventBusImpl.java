package com.daod.iov.modules.eventbus.internal;

import com.daod.iov.modules.eventbus.api.Event;
import com.daod.iov.modules.eventbus.api.EventBus;
import com.daod.iov.modules.eventbus.api.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.*;
import java.util.function.Consumer;

/**
 * 事件总线实现
 * 
 * 基于内存的事件发布订阅实现
 */
public class EventBusImpl implements EventBus {
    
    private static final Logger log = LoggerFactory.getLogger(EventBusImpl.class);
    
    // 事件处理器注册表
    private final Map<String, List<EventHandler<?>>> handlers = new ConcurrentHashMap<>();
    
    // 事件队列
    private final BlockingQueue<Event> eventQueue = new LinkedBlockingQueue<>(10000);
    
    // 线程池
    private final ExecutorService executorService;
    
    // 工作线程
    private final Thread dispatcherThread;
    
    // 运行标志
    private volatile boolean running = false;
    
    public EventBusImpl() {
        // 创建线程池
        this.executorService = Executors.newFixedThreadPool(
            Runtime.getRuntime().availableProcessors(),
            r -> {
                Thread t = new Thread(r, "event-bus-worker");
                t.setDaemon(true);
                return t;
            }
        );
        
        // 创建分发线程
        this.dispatcherThread = new Thread(this::dispatchLoop, "event-bus-dispatcher");
    }
    
    /**
     * 启动事件总线
     */
    public void start() {
        running = true;
        dispatcherThread.start();
        log.info("事件总线启动完成");
    }
    
    /**
     * 停止事件总线
     */
    public void stop() {
        running = false;
        dispatcherThread.interrupt();
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(30, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
        log.info("事件总线已停止");
    }
    
    @Override
    public void publish(Event event) {
        if (!running) {
            log.warn("事件总线未启动，丢弃事件: {}", event.getType());
            return;
        }
        
        try {
            if (!eventQueue.offer(event, 5, TimeUnit.SECONDS)) {
                log.warn("事件队列已满，丢弃事件: {}", event.getType());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("发布事件被中断: {}", event.getType());
        }
    }
    
    @Override
    public void publishSync(Event event) {
        if (!running) {
            log.warn("事件总线未启动，丢弃事件: {}", event.getType());
            return;
        }
        
        dispatchEvent(event);
    }
    
    @Override
    public <T extends Event> void subscribe(String eventType, EventHandler<T> handler) {
        handlers.computeIfAbsent(eventType, k -> new CopyOnWriteArrayList<>())
            .add(handler);
        
        // 按优先级排序
        handlers.get(eventType).sort(Comparator.comparingInt(EventHandler::getPriority));
        
        log.debug("订阅事件: {} -> {}", eventType, handler.getClass().getSimpleName());
    }
    
    @Override
    public <T extends Event> void subscribe(String eventType, Consumer<T> consumer) {
        EventHandler<T> handler = new EventHandler<T>() {
            @Override
            public void handle(T event) {
                consumer.accept(event);
            }
            
            @Override
            public String getEventType() {
                return eventType;
            }
        };
        
        subscribe(eventType, handler);
    }
    
    @Override
    public <T extends Event> void unsubscribe(String eventType, EventHandler<T> handler) {
        List<EventHandler<?>> handlerList = handlers.get(eventType);
        if (handlerList != null) {
            handlerList.remove(handler);
            log.debug("取消订阅事件: {} -> {}", eventType, handler.getClass().getSimpleName());
        }
    }
    
    @Override
    public List<EventHandler<?>> getHandlers(String eventType) {
        return handlers.getOrDefault(eventType, Collections.emptyList());
    }
    
    @Override
    public int getQueueSize() {
        return eventQueue.size();
    }
    
    @Override
    public void clearQueue() {
        eventQueue.clear();
    }
    
    /**
     * 事件分发循环
     */
    private void dispatchLoop() {
        while (running) {
            try {
                Event event = eventQueue.poll(1, TimeUnit.SECONDS);
                if (event != null) {
                    dispatchEvent(event);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
    
    /**
     * 分发事件到处理器
     */
    @SuppressWarnings("unchecked")
    private void dispatchEvent(Event event) {
        List<EventHandler<?>> eventHandlers = handlers.get(event.getType());
        
        if (eventHandlers == null || eventHandlers.isEmpty()) {
            log.debug("无处理器处理事件: {}", event.getType());
            return;
        }
        
        for (EventHandler handler : eventHandlers) {
            try {
                if (handler.isAsync()) {
                    executorService.submit(() -> {
                        try {
                            handler.handle(event);
                        } catch (Exception e) {
                            log.error("处理事件异常: {} - {}", event.getType(), e.getMessage(), e);
                        }
                    });
                } else {
                    handler.handle(event);
                }
            } catch (Exception e) {
                log.error("分发事件异常: {} - {}", event.getType(), e.getMessage(), e);
            }
        }
    }
}