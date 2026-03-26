package com.daod.iov.modules.alarm.api.dto;

import java.util.List;

/**
 * 分页结果
 */
public class PageResult<T> {
    
    /** 数据列表 */
    private List<T> list;
    
    /** 总数 */
    private long total;
    
    /** 当前页 */
    private int page;
    
    /** 每页数量 */
    private int pageSize;
    
    /** 总页数 */
    private int totalPages;
    
    // 构造函数
    public PageResult() {}
    
    public PageResult(List<T> list, long total, int page, int pageSize) {
        this.list = list;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = (int) Math.ceil((double) total / pageSize);
    }
    
    // Getters and Setters
    public List<T> getList() { return list; }
    public void setList(List<T> list) { this.list = list; }
    
    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
    
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    
    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }
    
    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
}