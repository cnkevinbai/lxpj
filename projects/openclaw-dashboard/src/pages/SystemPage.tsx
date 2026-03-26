/**
 * 系统运维页面 - 完整功能版
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 类型定义
interface SystemMetrics {
  cpu: { model: string; cores: number; usage: { user: number; system: number }; };
  memory: { total: number; free: number; used: number; usagePercent: number; };
  os: { platform: string; type: string; release: string; uptime: number; };
  process: { pid: number; uptime: number; memory: { heapUsed: number; heapTotal: number; }; };
  timestamp: string;
}

interface LogEntry {
  timestamp: string;
  level: string;
  service: string;
  message: string;
}

interface Diagnostics {
  timestamp: string;
  checks: Record<string, { status: string; [key: string]: any }>;
  recommendations: Array<{ type: string; message: string }>;
}

// 功能菜单
const MENU_ITEMS = [
  { id: 'overview', label: '概览', icon: '📊' },
  { id: 'services', label: '服务管理', icon: '⚙️' },
  { id: 'logs', label: '系统日志', icon: '📝' },
  { id: 'diagnostics', label: '诊断工具', icon: '🔍' },
  { id: 'database', label: '数据库', icon: '🗄️' },
  { id: 'cache', label: '缓存管理', icon: '💾' },
];

export function SystemPage() {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [logFilter, setLogFilter] = useState({ level: '', service: '' });

  // 加载系统指标
  const loadMetrics = async () => {
    try {
      const response = await fetch(`${API_URL}/system/metrics`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载日志
  const loadLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (logFilter.level) params.append('level', logFilter.level);
      params.append('tail', '50');
      const response = await fetch(`${API_URL}/system/logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  // 运行诊断
  const runDiagnostics = async () => {
    try {
      const response = await fetch(`${API_URL}/system/diagnose`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setDiagnostics(data);
      }
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    }
  };

  // 重启服务
  const restartService = async (service?: string) => {
    if (!confirm(`确定要重启${service || '所有服务'}吗？`)) return;
    try {
      await fetch(`${API_URL}/system/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service }),
      });
      alert('重启命令已发送');
    } catch (error) {
      console.error('Failed to restart:', error);
    }
  };

  // 初始加载
  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeMenu === 'logs') loadLogs();
  }, [activeMenu, logFilter]);

  useEffect(() => {
    if (activeMenu === 'diagnostics') runDiagnostics();
  }, [activeMenu]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${mins}分钟`;
  };

  const logLevelColors: Record<string, string> = {
    INFO: 'text-blue-400', WARN: 'text-amber-400', ERROR: 'text-red-400', DEBUG: 'text-slate-400',
  };

  return (
    <div className="flex h-full">
      {/* 左侧菜单 */}
      <div className="w-56 border-r border-white/5 p-4 space-y-1">
        <h2 className="text-lg font-bold text-white mb-4 px-3">系统运维</h2>
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeMenu === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* 概览 */}
          {activeMenu === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <h1 className="text-xl font-bold text-white">系统概览</h1>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: '服务状态', value: '运行中', color: 'green', icon: '✓' },
                  { label: '运行时间', value: metrics ? formatUptime(metrics.process.uptime) : '-', color: 'cyan', icon: '⏱️' },
                  { label: 'CPU 核心', value: metrics?.cpu.cores || '-', color: 'purple', icon: '💻' },
                  { label: '内存使用', value: `${metrics?.memory.usagePercent || 0}%`, color: 'amber', icon: '📊' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#0a0a1a]/80 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center`}>
                        <span>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">{item.label}</p>
                        <p className={`text-lg font-semibold text-${item.color}-400`}>{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0a0a1a]/80 border border-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">内存使用</h3>
                  {metrics && (
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${metrics.memory.usagePercent}%` }} />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div><p className="text-2xl font-bold text-white">{metrics.memory.total}</p><p className="text-xs text-slate-400">总内存 (GB)</p></div>
                        <div><p className="text-2xl font-bold text-cyan-400">{metrics.memory.used}</p><p className="text-xs text-slate-400">已用 (GB)</p></div>
                        <div><p className="text-2xl font-bold text-green-400">{metrics.memory.free}</p><p className="text-xs text-slate-400">可用 (GB)</p></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-[#0a0a1a]/80 border border-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">系统信息</h3>
                  {metrics && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-white/5"><span className="text-slate-400">操作系统</span><span className="text-white">{metrics.os.type} {metrics.os.release}</span></div>
                      <div className="flex justify-between py-2 border-b border-white/5"><span className="text-slate-400">进程 PID</span><span className="text-white">{metrics.process.pid}</span></div>
                      <div className="flex justify-between py-2"><span className="text-slate-400">系统运行</span><span className="text-white">{formatUptime(metrics.os.uptime)}</span></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 服务管理 */}
          {activeMenu === 'services' && (
            <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <h1 className="text-xl font-bold text-white">服务管理</h1>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'API 服务', port: 3001 }, { name: 'WebSocket', port: 3001 },
                  { name: 'PostgreSQL', port: 5432 }, { name: 'OpenClaw Gateway', port: 18789 },
                ].map((service) => (
                  <div key={service.name} className="bg-[#0a0a1a]/80 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <div><p className="text-white font-medium">{service.name}</p><p className="text-sm text-slate-400">端口: {service.port}</p></div>
                      </div>
                      <button onClick={() => restartService(service.name)} className="px-3 py-1.5 text-sm bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30">重启</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 系统日志 */}
          {activeMenu === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">系统日志</h1>
                <select value={logFilter.level} onChange={(e) => setLogFilter({ ...logFilter, level: e.target.value })} className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">
                  <option value="">所有级别</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
              <div className="bg-[#0a0a1a]/80 border border-white/5 rounded-xl p-4 font-mono text-sm max-h-[500px] overflow-y-auto">
                {logs.length === 0 ? <div className="text-center text-slate-400 py-8">暂无日志</div> : logs.map((log, i) => (
                  <div key={i} className="py-2 border-b border-white/5">
                    <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString('zh-CN')}</span>
                    <span className={`ml-2 ${logLevelColors[log.level] || 'text-white'}`}>[{log.level}]</span>
                    <span className="ml-2 text-white">{log.message}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 诊断工具 */}
          {activeMenu === 'diagnostics' && (
            <motion.div key="diagnostics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">诊断工具</h1>
                <button onClick={runDiagnostics} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30">🔍 运行诊断</button>
              </div>
              {diagnostics && (
                <div className="bg-[#0a0a1a]/80 border border-white/5 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">系统检查</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(diagnostics.checks).map(([key, check]) => (
                      <div key={key} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${check.status === 'ok' ? 'bg-green-400' : 'bg-amber-400'}`} />
                        <div><p className="text-white capitalize">{key}</p><p className="text-xs text-slate-400">{check.status}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 数据库 */}
          {activeMenu === 'database' && (
            <motion.div key="database" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <h1 className="text-xl font-bold text-white">数据库管理</h1>
              <div className="bg-[#0a0a1a]/80 border border-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">PostgreSQL</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">状态</span><span className="text-green-400">● 运行中</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">主机</span><span className="text-white">localhost:5432</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">数据库</span><span className="text-white">openclaw_dashboard</span></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 缓存管理 */}
          {activeMenu === 'cache' && (
            <motion.div key="cache" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <h1 className="text-xl font-bold text-white">缓存管理</h1>
              <div className="bg-[#0a0a1a]/80 border border-white/5 rounded-xl p-4">
                <p className="text-slate-400">缓存功能将在后续版本中提供</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}