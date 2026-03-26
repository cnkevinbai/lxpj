package com.daod.iov.plugin;

import java.util.ArrayList;
import java.util.List;

/**
 * 网络策略
 */
public class NetworkPolicy {
    
    private List<Integer> allowInboundPorts;   // 允许的入站端口
    private List<String> allowOutboundCIDRs;   // 允许的出站 CIDR
    private List<String> denyInboundCIDRs;     // 拒绝的入站 CIDR
    private List<String> denyOutboundCIDRs;    // 拒绝的出站 CIDR
    private boolean allowAllInbound;
    private boolean allowAllOutbound;
    
    public static final NetworkPolicy DEFAULT = builder()
        .allowAllInbound(false)
        .allowAllOutbound(true)
        .build();
    
    public static final NetworkPolicy RESTRICTIVE = builder()
        .allowAllInbound(false)
        .allowAllOutbound(false)
        .build();
    
    public NetworkPolicy() {
        this.allowInboundPorts = new ArrayList<>();
        this.allowOutboundCIDRs = new ArrayList<>();
        this.denyInboundCIDRs = new ArrayList<>();
        this.denyOutboundCIDRs = new ArrayList<>();
        this.allowAllInbound = false;
        this.allowAllOutbound = false;
    }
    
    // Builder 方法
    public NetworkPolicy allowInbound(List<Integer> ports) {
        this.allowInboundPorts = new ArrayList<>(ports);
        return this;
    }
    
    public NetworkPolicy allowOutbound(List<String> cidrs) {
        this.allowOutboundCIDRs = new ArrayList<>(cidrs);
        return this;
    }
    
    public NetworkPolicy allowAllInbound(boolean allow) {
        this.allowAllInbound = allow;
        return this;
    }
    
    public NetworkPolicy allowAllOutbound(boolean allow) {
        this.allowAllOutbound = allow;
        return this;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters
    public List<Integer> getAllowInboundPorts() { return allowInboundPorts; }
    public List<String> getAllowOutboundCIDRs() { return allowOutboundCIDRs; }
    public List<String> getDenyInboundCIDRs() { return denyInboundCIDRs; }
    public List<String> getDenyOutboundCIDRs() { return denyOutboundCIDRs; }
    public boolean isAllowAllInbound() { return allowAllInbound; }
    public boolean isAllowAllOutbound() { return allowAllOutbound; }
    
    public static class Builder {
        private NetworkPolicy policy = new NetworkPolicy();
        
        public Builder allowInbound(List<Integer> ports) {
            policy.allowInbound(ports);
            return this;
        }
        
        public Builder allowOutbound(List<String> cidrs) {
            policy.allowOutbound(cidrs);
            return this;
        }
        
        public Builder allowAllInbound(boolean allow) {
            policy.allowAllInbound = allow;
            return this;
        }
        
        public Builder allowAllOutbound(boolean allow) {
            policy.allowAllOutbound = allow;
            return this;
        }
        
        public NetworkPolicy build() {
            return policy;
        }
    }
}