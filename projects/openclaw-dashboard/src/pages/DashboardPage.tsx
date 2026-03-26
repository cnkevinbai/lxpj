/**
 * 仪表盘页面 - 未来科技感设计
 * 集成真实 API 数据
 */

import { useState, useEffect } from 'react';
import { dashboardApi, DashboardActivity } from '../services/dashboard-api';

// 统计数据接口
interface Stats {
  activeSessions: number;
  tasksCompleted: number;
  agentsOnline: number;
  messageCount: number;
}

// 统计卡片配置
const STAT_CONFIG = [
  { title: '活跃会话', change: '+12%', trend: 'up' as const, icon: '💬', gradient: 'from-cyan-500 to-blue-500' },
  { title: '任务完成', change: '+8%', trend: 'up' as const, icon: '✅', gradient: 'from-green-500 to-emerald-500' },
  { title: '代理在线', change: '100%', trend: 'up' as const, icon: '🤖', gradient: 'from-purple-500 to-pink-500' },
  { title: '消息数量', change: '+24%', trend: 'up' as const, icon: '📨', gradient: 'from-amber-500 to-orange-500' },
];

// 格式化数字
function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) {
    return '0';
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// 格式化活动时间
function formatActivityTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN');
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    activeSessions: 0,
    tasksCompleted: 0,
    agentsOnline: 0,
    messageCount: 0,
  });
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 并行加载所有数据
        const [statsData, activitiesData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getActivities(10),
        ]);

        setStats(statsData);
        setActivities(activitiesData || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('加载数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 定时刷新（每30秒）
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 统计卡片值
  const statValues: number[] = [
    stats?.activeSessions ?? 0,
    stats?.tasksCompleted ?? 0,
    stats?.agentsOnline ?? 0,
    stats?.messageCount ?? 0,
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-red-500/50 flex items-center justify-center text-3xl animate-pulse mx-auto mb-4">
            🦞
          </div>
          <p className="text-cyan-400/60">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-3xl mx-auto mb-4">
            ❌
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6 p-6 animate-fade-in-up">
      {/* 欢迎区域 */}
      <div className="p-8 rounded-3xl relative overflow-hidden border border-white/10" style={{ background: '#0F172A' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-2">
            欢迎回来，<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">主人</span>
          </h1>
          <p className="text-slate-400 mb-4">
            今天是 {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-cyan-400">所有系统正常运行</span>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-6">
        {STAT_CONFIG.map((stat, index) => (
          <div
            key={stat.title}
            className="p-6 rounded-2xl relative overflow-hidden group border border-white/10"
            style={{ background: '#0F172A' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              
              <p className="text-3xl font-bold text-white mb-1">
                {formatNumber(statValues[index])}
              </p>
              <p className="text-sm text-slate-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 快捷操作 & 最近活动 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 快捷操作 */}
        <div className="col-span-2 p-6 rounded-2xl border border-white/10" style={{ background: '#0F172A' }}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">⚡</span>
            快捷操作
          </h2>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '新建对话', icon: '💬', gradient: 'from-cyan-500 to-blue-500', path: '/chat?new=true' },
              { label: '创建任务', icon: '✅', gradient: 'from-green-500 to-emerald-500', path: '/tasks?new=true' },
              { label: '文件管理', icon: '📁', gradient: 'from-amber-500 to-orange-500', path: '/files' },
              { label: '系统设置', icon: '⚙️', gradient: 'from-purple-500 to-pink-500', path: '/settings' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => window.location.href = action.path}
                className={`group flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${action.gradient} bg-opacity-10 border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <span className="text-sm text-white/70 group-hover:text-white">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="p-6 rounded-2xl border border-white/10" style={{ background: '#0F172A' }}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span>
            最近活动
          </h2>
          
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  🤖
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.description}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(activity.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 代理状态 */}
      <div className="p-6 rounded-2xl border border-white/10" style={{ background: '#0F172A' }}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-xl">🤖</span>
          代理状态
        </h2>
        
        <div className="grid grid-cols-6 gap-4">
          {[
            { name: '渔晓白', icon: '🦞' },
            { name: 'Morgan', icon: '🏛️' },
            { name: 'Ryan', icon: '💻' },
            { name: 'Chloe', icon: '🎨' },
            { name: 'Diana', icon: '🗄️' },
            { name: 'Sam', icon: '🚀' },
          ].map((agent) => (
            <div
              key={agent.name}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-colors"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                  {agent.icon}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 bg-green-500 shadow-lg shadow-green-500/50" />
              </div>
              <span className="text-sm text-white/80">{agent.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}