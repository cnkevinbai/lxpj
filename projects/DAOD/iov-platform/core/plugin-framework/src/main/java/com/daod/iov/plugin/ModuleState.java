package com.daod.iov.plugin;

/**
 * 模块状态枚举
 */
public enum ModuleState {
    /**
     * 未初始化
     */
    UNINITIALIZED("uninitialized", "未初始化"),
    
    /**
     * 初始化中
     */
    INITIALIZING("initializing", "初始化中"),
    
    /**
     * 已初始化
     */
    INITIALIZED("initialized", "已初始化"),
    
    /**
     * 启动中
     */
    STARTING("starting", "启动中"),
    
    /**
     * 运行中
     */
    RUNNING("running", "运行中"),
    
    /**
     * 停止中
     */
    STOPPING("stopping", "停止中"),
    
    /**
     * 已停止
     */
    STOPPED("stopped", "已停止"),
    
    /**
     * 销毁中
     */
    DESTROYING("destroying", "销毁中"),
    
    /**
     * 已销毁
     */
    DESTROYED("destroyed", "已销毁"),
    
    /**
     * 错误状态
     */
    ERROR("error", "错误");

    private final String code;
    private final String description;

    ModuleState(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
    
    public static ModuleState fromCode(String code) {
        for (ModuleState state : ModuleState.values()) {
            if (state.code.equals(code)) {
                return state;
            }
        }
        return null;
    }
}