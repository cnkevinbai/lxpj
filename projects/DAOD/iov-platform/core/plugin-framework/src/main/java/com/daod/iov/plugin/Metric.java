package com.daod.iov.plugin;

import java.util.Map;
import java.util.HashMap;

/**
 * 监控指标
 * 支持 Prometheus 格式
 */
public class Metric {
    
    private String name;           // 指标名称
    private MetricType type;       // 指标类型
    private double value;          // 指标值
    private Map<String, String> labels;  // 标签
    private String help;           // 帮助文本
    private long timestamp;        // 时间戳
    
    public Metric() {
        this.labels = new HashMap<>();
    }
    
    public Metric(String name, MetricType type, double value) {
        this();
        this.name = name;
        this.type = type;
        this.value = value;
        this.timestamp = System.currentTimeMillis();
    }
    
    public Metric withLabel(String key, String value) {
        this.labels.put(key, value);
        return this;
    }
    
    public Metric withHelp(String help) {
        this.help = help;
        return this;
    }
    
    /**
     * 转换为 Prometheus 格式字符串
     */
    public String toPrometheusFormat() {
        StringBuilder sb = new StringBuilder();
        
        // 帮助文本
        if (help != null && !help.isEmpty()) {
            sb.append("# HELP ").append(name).append(" ").append(help).append("\n");
        }
        
        // 类型声明
        sb.append("# TYPE ").append(name).append(" ").append(type.name().toLowerCase()).append("\n");
        
        // 指标值
        sb.append(name);
        if (!labels.isEmpty()) {
            sb.append("{");
            boolean first = true;
            for (Map.Entry<String, String> entry : labels.entrySet()) {
                if (!first) sb.append(",");
                sb.append(entry.getKey()).append("=\"").append(entry.getValue()).append("\"");
                first = false;
            }
            sb.append("}");
        }
        sb.append(" ").append(value);
        
        if (timestamp > 0) {
            sb.append(" ").append(timestamp);
        }
        sb.append("\n");
        
        return sb.toString();
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public MetricType getType() { return type; }
    public void setType(MetricType type) { this.type = type; }
    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }
    public Map<String, String> getLabels() { return labels; }
    public void setLabels(Map<String, String> labels) { this.labels = labels; }
    public String getHelp() { return help; }
    public void setHelp(String help) { this.help = help; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    
    /**
     * 指标类型
     */
    public enum MetricType {
        COUNTER,    // 计数器，只增不减
        GAUGE,      // 仪表盘，可增可减
        HISTOGRAM,  // 直方图
        SUMMARY     // 摘要
    }
}