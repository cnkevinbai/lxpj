# 学习汇报 - 2026-03-22

## ⚙️ Session #5 学习成果汇报

**学习时段**: 凌晨 2:30-4:00  
**主题**: 图算法与搜索模式 + 系统设计案例分析

---

## 一、图搜索算法对比矩阵

| 算法 | 时间复杂度 | 空间复杂度 | 适用场景 |
|------|------------|------------|----------|
| **DFS** | O(V+E) | O(V) | 连通性、路径存在、拓扑排序 |
| **BFS** | O(V+E) | O(V) | 无权最短路径、层级遍历 |
| **Dijkstra** | O((V+E)log V) | O(V) | 加权最短路径（非负权） |
| **A*** | O(E) ~ O(b^d) | O(b^d) | 启发式最短路径 |

**选择直觉**:
- 无权图最短路径 → BFS
- 加权图最短路径 → Dijkstra
- 有启发信息 → A*
- 只需判断连通 → DFS

---

## 二、Social Graph 分布式设计案例

**问题规模**:
- 1 亿用户，50 亿好友关系
- 400 QPS 查询请求

**架构演进**:
```
Client → CDN → Load Balancer → Web Servers
                                  ↓
                            Search API Server
                                  ↓
                           Memory Cache (Redis)
                                  ↓ (miss)
                           User Graph Service
                                  ↓
                         Lookup Service (分片定位)
                                  ↓
                       Person Servers (分片存储)
```

**关键优化**:
| 瓶颈 | 解决方案 | 效果 |
|------|----------|------|
| Person Server 单点 | 按用户 ID 分片 | 水平扩展 |
| 每次查询网络开销 | Memory Cache 缓存 | 减少 90%+ 查询 |
| BFS 多跳查询慢 | 双向 BFS + 路径缓存 | 减少一半搜索量 |

---

## 三、SDI 系统设计面试框架

```
Step 1: 需求澄清 (5 分钟)
- 用户是谁？用例是什么？
- 规模：用户量、请求量、数据量

Step 2: 高层设计 (10 分钟)
- 画核心组件图
- API 设计

Step 3: 深入设计 (15 分钟)
- 数据模型、算法、接口

Step 4: 瓶颈与扩展 (10 分钟)
- 识别瓶颈
- 讨论权衡（CAP）
```

---

## 四、CAP 定理实战选择

| 场景 | 选择 | 理由 |
|------|------|------|
| 银行转账 | CP | 数据准确优先 |
| 社交动态 | AP | 可用性优先 |
| 库存管理 | CP | 防止超卖 |
| 推荐系统 | AP | 最终一致可接受 |

**关键问题**: 用户最在乎什么？

---

## 五、延迟数字直觉

| 操作 | 延迟 | 对比 |
|------|------|------|
| L1 缓存 | 0.5 ns | 基准 |
| 内存访问 | 100 ns | 200x L1 |
| SSD 读 | 0.1 ms | 1000x 内存 |
| 同数据中心网络 | 0.5 ms | 5x SSD |
| 跨区域网络 | 150 ms | 300x 同数据中心 |

**关键洞察**: 内存比磁盘快 10 万倍，缓存命中率是性能关键。

---

## 推荐资源

1. [Interactive Coding Challenges](https://github.com/donnemartin/interactive-coding-challenges) — 120+ 算法练习
2. [System Design Primer](https://github.com/donnemartin/system-design-primer) — 系统设计宝典
3. [Big O Cheat Sheet](https://www.bigocheatsheet.com/) — 复杂度速查

---

**下次学习**: 2026-03-25 凌晨 2:30  
**主题**: 并发与分布式系统模式 + 项目架构回顾