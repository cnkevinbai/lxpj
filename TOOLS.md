# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 📊 Polymarket Odds Skill

**路径**: `~/.openclaw/skills/polymaketodds/`

**功能**: Polymarket 预测市场赔率查询

**命令**:
```bash
# 搜索市场
~/.openclaw/skills/polymaketodds/tools/query.sh search "trump election"

# 获取赔率
~/.claw/skills/polymaketodds/tools/query.sh odds <market_id>

# 热门市场
~/.openclaw/skills/polymaketodds/tools/query.sh trending

# 监控赔率
~/.openclaw/skills/polymaketodds/tools/query.sh monitor <market_id> 10
```

**API 端点**:
- Gamma API: `https://gamma-api.polymarket.com`
- CLOB API: `https://clob.polymarket.com`

**⚠️ 网络限制**: 服务器可能无法直接访问 Polymarket API，需要代理或 VPN。

---

Add whatever helps you do your job. This is your cheat sheet.
