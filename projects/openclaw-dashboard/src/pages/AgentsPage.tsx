/**
 * Agents Page - 代理管理页面
 */

import { useState, useEffect } from 'react';
import { useAgentStore } from '../store';

// Agent 详情弹窗
function AgentDetailsModal({ agent, onClose }: { agent: any; onClose: () => void }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (isClosing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="rounded-lg border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden"
        style={{ background: '#0F172A' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{agent.avatar}</div>
            <div>
              <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
              <p className="text-slate-400">{agent.description}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-4 py-3 border-b border-white/10">
            <div className="text-sm text-slate-400 w-24">ID</div>
            <span className="text-white font-mono text-sm">{agent.id}</span>
          </div>

          <div className="flex items-center space-x-4 py-3 border-b border-white/10">
            <div className="text-sm text-slate-400 w-24">状态</div>
            <span
              className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${agent.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
              `}
            >
              {agent.enabled ? '已启用' : '已禁用'}
            </span>
          </div>

          {agent.specialty && agent.specialty.length > 0 && (
            <div className="flex items-center space-x-4 py-3">
              <div className="text-sm text-slate-400 w-24">专长</div>
              <div className="flex flex-wrap gap-2">
                {agent.specialty.map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-white/10 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
          >
            关闭
          </button>
          <button
            onClick={() => {
              useAgentStore.getState().setActiveAgent(agent.id);
              handleClose();
            }}
            className="px-4 py-2 rounded-lg font-medium text-sm text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #22C55E)' }}
          >
            使用此代理
          </button>
        </div>
      </div>
    </div>
  );
}

// Agent 卡片
function AgentCard({ agent, isActive, onSelect }: { agent: any; isActive: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`
        p-6 rounded-lg border transition-all duration-200 cursor-pointer group
        ${isActive
          ? 'border-cyan-500 shadow-lg shadow-cyan-500/10'
          : 'border-white/10 hover:border-cyan-500/50 hover:shadow-md'
        }
      `}
      style={{ background: '#0F172A' }}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl bg-slate-800 rounded-lg p-2 group-hover:scale-110 transition-transform duration-200">
          {agent.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{agent.name}</h3>
          <p className="text-sm text-slate-400 truncate">{agent.description}</p>
        </div>
        {isActive && (
          <span className="flex-shrink-0 w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`
            px-2 py-1 rounded text-xs font-medium
            ${agent.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
          `}
        >
          {agent.enabled ? '已启用' : '已禁用'}
        </span>
        <button
          className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #22C55E)' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isActive ? '当前' : '选择'}
        </button>
      </div>
    </div>
  );
}

// Agent 统计
function AgentStats() {
  const { agents } = useAgentStore();

  const enabledCount = agents.filter((a: any) => a.enabled).length;
  const activeCount = agents.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="p-6 rounded-lg border border-white/10" style={{ background: '#0F172A' }}>
        <h3 className="text-sm text-slate-400">已启用代理</h3>
        <p className="text-2xl font-bold text-green-400 mt-1">{enabledCount}/{activeCount}</p>
        <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all duration-500"
            style={{ width: `${(enabledCount / activeCount) * 100}%` }}
          />
        </div>
      </div>
      <div className="p-6 rounded-lg border border-white/10" style={{ background: '#0F172A' }}>
        <h3 className="text-sm text-slate-400">总代理数</h3>
        <p className="text-2xl font-bold text-cyan-400 mt-1">{activeCount}</p>
        <p className="text-xs text-slate-400 mt-1">可用代理数量</p>
      </div>
      <div className="p-6 rounded-lg border border-white/10" style={{ background: '#0F172A' }}>
        <h3 className="text-sm text-slate-400">平均响应时间</h3>
        <p className="text-2xl font-bold text-cyan-400 mt-1">0.8s</p>
        <p className="text-xs text-slate-400 mt-1">基于最近 100 次对话</p>
      </div>
    </div>
  );
}

// 搜索组件
function AgentSearch({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="搜索代理..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
        style={{ background: '#0F172A' }}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Agents 页面主组件
export function AgentsPage() {
  const { agents, activeAgentId, setActiveAgent } = useAgentStore();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAgentSelect = (agent: any) => {
    if (agent.enabled) {
      setActiveAgent(agent.id);
      setSelectedAgent(agent);
    }
  };

  const filteredAgents = agents.filter((agent: any) => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.specialty.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 h-full flex flex-col p-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">代理管理</h2>
        </div>
        <p className="text-slate-400">
          当前活跃代理: <span className="text-cyan-400 font-medium">{agents.find((a: any) => a.id === activeAgentId)?.name || '渔晓白'}</span>
        </p>
      </div>

      <AgentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent: any) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                isActive={activeAgentId === agent.id}
                onSelect={() => handleAgentSelect(agent)} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              <p>未找到匹配的代理</p>
            </div>
          )}
        </div>
      </div>

      <AgentStats />

      {selectedAgent && (
        <AgentDetailsModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}