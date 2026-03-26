package com.daod.iov.modules.alarm.api.dto;

import javax.validation.constraints.NotBlank;

/**
 * 告警处理请求
 */
public class AlarmHandleRequest {
    
    /** 处理人 */
    @NotBlank(message = "处理人不能为空")
    private String handler;
    
    /** 处理备注 */
    private String handleNote;
    
    /** 处理结果 */
    private String handleResult;
    
    /** 是否需要跟进 */
    private Boolean needFollow;
    
    /** 跟进时间 */
    private Long followTime;
    
    // Getters and Setters
    public String getHandler() { return handler; }
    public void setHandler(String handler) { this.handler = handler; }
    
    public String getHandleNote() { return handleNote; }
    public void setHandleNote(String handleNote) { this.handleNote = handleNote; }
    
    public String getHandleResult() { return handleResult; }
    public void setHandleResult(String handleResult) { this.handleResult = handleResult; }
    
    public Boolean getNeedFollow() { return needFollow; }
    public void setNeedFollow(Boolean needFollow) { this.needFollow = needFollow; }
    
    public Long getFollowTime() { return followTime; }
    public void setFollowTime(Long followTime) { this.followTime = followTime; }
}