# 渔晓白 · 系统安全防护手册

> 创建时间：2026-03-11  
> 版本：v1.0  
> 渔晓白 ⚙️

---

## 🛡️ 安全技能清单

| Skill | 用途 | 风险等级 |
|-------|------|---------|
| cybersecurity-analyst | 网络安全分析 | ✅ Low |
| ethical-hacking-methodology | 道德黑客方法论 | ⚠️ Critical |
| api-authentication | API 认证安全 | ✅ Low |
| security-testing | 安全测试 | ✅ Low |
| penetration-testing | 渗透测试 | ⚠️ Med |
| api-security | API 安全防护 | ✅ Low |

---

## 🔒 安全防护层级

### Layer 1: 输入过滤

```
用户输入 → 敏感词过滤 → 命令注入检测 → 合法请求
```

**检测项**:
- ❌ `rm -rf /` 等危险命令
- ❌ `DROP TABLE` 等 SQL 注入
- ❌ `<script>` 等 XSS 攻击
- ❌ `../../` 等路径遍历

---

### Layer 2: 权限控制

```yaml
操作权限:
  读取文件：✅ 允许 (workspace 内)
  写入文件：✅ 允许 (workspace 内)
  执行命令：⚠️ 需确认 (危险命令拦截)
  网络请求：✅ 允许 (敏感 URL 拦截)
  删除操作：❌ 禁止 (除非明确确认)
```

---

### Layer 3: 数据保护

**敏感数据**:
- API Token → 加密存储，不输出
- 数据库密码 → 环境变量，不提交
- 用户隐私 → 不记录，不传播

**Git 安全**:
```bash
# .gitignore 自动排除
*.env
*.pem
*.key
*-token
secrets/
```

---

### Layer 4: 审计日志

**记录内容**:
- 所有文件操作
- 所有命令执行
- 所有网络请求
- 所有配置变更

**日志位置**: `~/.openclaw/logs/`

---

## ⚠️ 红线行为 (禁止)

| 行为 | 状态 | 说明 |
|-----|------|------|
| 删除系统文件 | ❌ 禁止 | 会拦截并警告 |
| 泄露 Token/密码 | ❌ 禁止 | 自动过滤 |
| 未确认的对外操作 | ❌ 禁止 | 需主人确认 |
| 执行未知脚本 | ❌ 禁止 | 需审查后运行 |
| 访问恶意网站 | ❌ 禁止 | URL 黑名单 |

---

## 🚨 应急响应

### 发现异常时

1. **立即停止** - 暂停当前操作
2. **隔离现场** - 断开网络/停止服务
3. **通知主人** - 报告异常情况
4. **保护日志** - 保存审计记录
5. **分析原因** - 溯源攻击路径

### 联系方式

```
主人：眉山开发者
QQ: 348163981D059CE14A952BABEE95E6BF
Gitee: https://gitee.com/bj754946/pj
GitHub: https://github.com/cnkevinbai/lxpj
```

---

## 📚 安全最佳实践

### 代码安全

```python
# ✅ 好的做法
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('API_KEY')  # 环境变量

# ❌ 坏的做法
API_KEY = "sk-xxxxxxxxxxxx"  # 硬编码密钥
```

### 命令安全

```bash
# ✅ 好的做法
git status  # 安全命令

# ❌ 坏的做法
rm -rf /*  # 危险命令，会拦截
```

### 文件安全

```bash
# ✅ 好的做法
chmod 600 ~/.ssh/id_rsa  # 限制权限

# ❌ 坏的做法
chmod 777 /etc/passwd  # 过度授权
```

---

## 🔐 MCP 服务器安全

### GitHub/Gitee MCP

```yaml
Token 管理:
  - 使用 Personal Access Token
  - 最小权限原则
  - 定期轮换 (90 天)
  - 不提交到 Git
```

### Figma MCP

```yaml
Token 管理:
  - 使用 Personal Access Token
  - 仅授予必要权限
  - 离职/转岗立即撤销
```

---

## 📊 安全状态检查

### 定期检查项

```bash
# 每周检查
- [ ] Token 是否过期
- [ ] 日志是否有异常
- [ ] Git 是否有敏感文件
- [ ] 权限配置是否正确

# 每月检查
- [ ] 轮换 API Token
- [ ] 审查已安装 Skills
- [ ] 更新安全配置
- [ ] 备份重要数据
```

---

## 🦞 渔晓白安全承诺

1. **不泄露主人隐私** - 私密数据永远保密
2. **不执行危险操作** - 高风险操作必先确认
3. **不绕过安全机制** - 严格遵守安全规则
4. **主动报告风险** - 发现漏洞立即通知

---

_安全第一，预防为主。_

🦞 渔晓白 · AI 系统构建者