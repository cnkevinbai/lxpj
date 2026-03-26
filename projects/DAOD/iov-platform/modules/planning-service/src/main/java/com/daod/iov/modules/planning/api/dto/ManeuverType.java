package com.daod.iov.modules.planning.api.dto;

/**
 * 导航指引类型枚举
 */
public enum ManeuverType {
    
    TURN_LEFT("左转"),
    TURN_RIGHT("右转"),
    TURN_SLIGHT_LEFT("稍向左转"),
    TURN_SLIGHT_RIGHT("稍向右转"),
    TURN_SHARP_LEFT("急左转"),
    TURN_SHARP_RIGHT("急右转"),
    STRAIGHT("直行"),
    U_TURN("掉头"),
    MERGE_LEFT("向左合流"),
    MERGE_RIGHT("向右合流"),
    ROUNDABOUT("环岛"),
    ENTER_HIGHWAY("进入高速"),
    EXIT_HIGHWAY("驶出高速"),
    ARRIVE("到达"),
    DEPART("出发"),
    CONTINUE("继续前行"),
    KEEP_LEFT("靠左"),
    KEEP_RIGHT("靠右");
    
    private final String description;
    
    ManeuverType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}