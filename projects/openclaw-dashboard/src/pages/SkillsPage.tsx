/**
 * 技能管理页面
 * 
 * 功能：
 * 1. 显示已安装技能列表
 * 2. 启用/禁用技能
 * 3. 配置技能触发器
 * 4. 查看技能详情
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// 技能类型
interface SkillTrigger {
  id: string;
  type: 'keyword' | 'schedule' | 'webhook' | 'file';
  config: {
    keywords?: string[];
    cron?: string;
    path?: string;
    events?: string[];
  };
  enabled: boolean;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  version?: string;
  author?: string;
  tags?: string[];
  enabled: boolean;
  installedAt?: string;
  lastUsedAt?: string;
  useCount: number;
  config?: Record<string, any>;
  triggers?: SkillTrigger[];
}

// API 客户端
const skillsApi = {
  async getSkills(): Promise<{ skills: Skill[]; total: number }> {
    const res = await fetch('/api/skills');
    return res.json();
  },
  
  async getSkill(id: string): Promise<{ skill: Skill; content?: string }> {
    const res = await fetch(`/api/skills/${id}`);
    return res.json();
  },
  
  async updateSkillState(id: string, enabled: boolean): Promise<{ skill: Skill }> {
    const res = await fetch(`/api/skills/${id}/state`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    return res.json();
  },
  
  async addTrigger(skillId: string, trigger: Omit<SkillTrigger, 'id'>): Promise<{ trigger: SkillTrigger }> {
    const res = await fetch(`/api/skills/${skillId}/triggers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trigger),
    });
    return res.json();
  },
  
  async removeTrigger(skillId: string, triggerId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/skills/${skillId}/triggers/${triggerId}`, {
      method: 'DELETE',
    });
    return res.json();
  },
  
  async refreshSkills(): Promise<{ count: number }> {
    const res = await fetch('/api/skills/refresh', { method: 'POST' });
    return res.json();
  },
};

// 触发器类型标签
const TRIGGER_TYPE_LABELS: Record<SkillTrigger['type'], { label: string; icon: string; color: string }> = {
  keyword: { label: '关键词', icon: '🔤', color: '#06B6D4' },
  schedule: { label: '定时', icon: '⏰', color: '#F59E0B' },
  webhook: { label: 'Webhook', icon: '🔗', color: '#8B5CF6' },
  file: { label: '文件', icon: '📁', color: '#10B981' },
};

// 触发器卡片组件
function TriggerCard({ 
  trigger, 
  onToggle, 
  onRemove 
}: { 
  trigger: SkillTrigger; 
  onToggle: () => void;
  onRemove: () => void;
}) {
  const typeInfo = TRIGGER_TYPE_LABELS[trigger.type];
  
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-slate-800/50"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{typeInfo.icon}</span>
        <div>
          <div className="text-sm font-medium text-white">{typeInfo.label}触发</div>
          <div className="text-xs text-slate-400">
            {trigger.type === 'keyword' && trigger.config.keywords?.join(', ')}
            {trigger.type === 'schedule' && trigger.config.cron}
            {trigger.type === 'webhook' && '外部请求'}
            {trigger.type === 'file' && trigger.config.path}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            trigger.enabled ? 'bg-green-500' : 'bg-slate-600'
          }`}
        >
          <span 
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              trigger.enabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// 添加触发器模态框
function AddTriggerModal({ 
  skillId, 
  onAdd, 
  onClose 
}: { 
  skillId: string; 
  onAdd: (trigger: SkillTrigger) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<SkillTrigger['type']>('keyword');
  const [keywords, setKeywords] = useState('');
  const [cronExpr, setCronExpr] = useState('0 * * * *'); // 每小时
  
  const handleAdd = async () => {
    const trigger: Omit<SkillTrigger, 'id'> = {
      type,
      enabled: true,
      config: {},
    };
    
    if (type === 'keyword') {
      trigger.config.keywords = keywords.split(',').map(k => k.trim()).filter(Boolean);
    } else if (type === 'schedule') {
      trigger.config.cron = cronExpr;
    }
    
    const result = await skillsApi.addTrigger(skillId, trigger);
    if (result.trigger) {
      onAdd(result.trigger);
    }
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="rounded-xl border border-white/10 w-full max-w-md shadow-2xl overflow-hidden"
        style={{ background: '#0F172A' }}
      >
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">添加触发器</h3>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 触发类型选择 */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">触发类型</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TRIGGER_TYPE_LABELS).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setType(key as SkillTrigger['type'])}
                  className={`p-3 rounded-lg border transition-colors ${
                    type === key 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl mr-2">{info.icon}</span>
                  <span className="text-sm text-white">{info.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* 关键词配置 */}
          {type === 'keyword' && (
            <div>
              <label className="text-sm text-slate-400 mb-2 block">关键词（逗号分隔）</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="例如: 设计, UI, 界面"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}
          
          {/* Cron 配置 */}
          {type === 'schedule' && (
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Cron 表达式</label>
              <input
                type="text"
                value={cronExpr}
                onChange={(e) => setCronExpr(e.target.value)}
                placeholder="0 * * * *"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">
                当前: 每小时执行
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #22C55E)' }}
          >
            添加
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 技能详情模态框
function SkillDetailModal({ 
  skill, 
  content,
  onUpdate,
  onClose 
}: { 
  skill: Skill; 
  content?: string;
  onUpdate: (skill: Skill) => void;
  onClose: () => void;
}) {
  const [showAddTrigger, setShowAddTrigger] = useState(false);
  
  const handleToggleEnabled = async () => {
    const result = await skillsApi.updateSkillState(skill.id, !skill.enabled);
    if (result.skill) {
      onUpdate(result.skill);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="rounded-xl border border-white/10 w-full max-w-2xl max-h-[80vh] shadow-2xl overflow-hidden flex flex-col"
        style={{ background: '#0F172A' }}
      >
        {/* 头部 */}
        <div className="p-4 border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{skill.name}</h3>
              <p className="text-sm text-slate-400">{skill.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleEnabled}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                skill.enabled ? 'bg-green-500' : 'bg-slate-600'
              }`}
            >
              <span 
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  skill.enabled ? 'left-8' : 'left-1'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 描述 */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-1">描述</h4>
            <p className="text-white">{skill.description || '暂无描述'}</p>
          </div>
          
          {/* 标签 */}
          {skill.tags && skill.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">标签</h4>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 触发器 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-400">触发器</h4>
              <button
                onClick={() => setShowAddTrigger(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                + 添加触发器
              </button>
            </div>
            
            {skill.triggers && skill.triggers.length > 0 ? (
              <div className="space-y-2">
                {skill.triggers.map(trigger => (
                  <TriggerCard
                    key={trigger.id}
                    trigger={trigger}
                    onToggle={() => {/* TODO */}}
                    onRemove={() => {/* TODO */}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500 py-4 text-center border border-dashed border-white/10 rounded-lg">
                暂无触发器
              </div>
            )}
          </div>
          
          {/* SKILL.md 内容 */}
          {content && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">技能文档</h4>
              <div className="prose prose-invert prose-sm max-w-none p-4 bg-slate-800/50 rounded-lg border border-white/5">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          )}
          
          {/* 统计 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-400">使用次数</div>
              <div className="text-xl font-bold text-white">{skill.useCount}</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-400">安装时间</div>
              <div className="text-sm text-white">
                {skill.installedAt ? new Date(skill.installedAt).toLocaleDateString('zh-CN') : '-'}
              </div>
            </div>
          </div>
        </div>
        
        {/* 添加触发器模态框 */}
        <AnimatePresence>
          {showAddTrigger && (
            <AddTriggerModal
              skillId={skill.id}
              onAdd={(trigger) => {
                skill.triggers = [...(skill.triggers || []), trigger];
                setShowAddTrigger(false);
              }}
              onClose={() => setShowAddTrigger(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// 技能卡片
function SkillCard({ 
  skill, 
  onClick,
  onToggle 
}: { 
  skill: Skill; 
  onClick: () => void;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 rounded-xl border border-white/10 cursor-pointer transition-all hover:border-cyan-500/50"
      style={{ background: '#0F172A' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1" onClick={onClick}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
            {skill.version && (
              <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                v{skill.version}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">{skill.description}</p>
          
          {skill.tags && skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {skill.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">
                  {tag}
                </span>
              ))}
              {skill.tags.length > 3 && (
                <span className="text-xs text-slate-500">+{skill.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
        
        {/* 启用/禁用开关 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(!skill.enabled);
          }}
          className={`relative w-12 h-6 rounded-full transition-colors ml-3 ${
            skill.enabled ? 'bg-green-500' : 'bg-slate-600'
          }`}
        >
          <span 
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              skill.enabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>
      
      {/* 触发器统计 */}
      {skill.triggers && skill.triggers.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
          <span className="text-xs text-slate-500">触发器:</span>
          {skill.triggers.slice(0, 3).map(trigger => {
            const info = TRIGGER_TYPE_LABELS[trigger.type];
            return (
              <span key={trigger.id} className="text-xs">
                {info.icon}
              </span>
            );
          })}
          {skill.triggers.length > 3 && (
            <span className="text-xs text-slate-500">+{skill.triggers.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// 主页面
export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillContent, setSkillContent] = useState<string | undefined>();
  
  // 加载技能列表
  useEffect(() => {
    loadSkills();
  }, []);
  
  const loadSkills = async () => {
    setLoading(true);
    try {
      const result = await skillsApi.getSkills();
      setSkills(result.skills);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleSkill = async (skillId: string, enabled: boolean) => {
    const result = await skillsApi.updateSkillState(skillId, enabled);
    if (result.skill) {
      setSkills(prev => prev.map(s => s.id === skillId ? result.skill : s));
    }
  };
  
  const handleSelectSkill = async (skill: Skill) => {
    setSelectedSkill(skill);
    const result = await skillsApi.getSkill(skill.id);
    setSkillContent(result.content);
  };
  
  const handleRefresh = async () => {
    await skillsApi.refreshSkills();
    await loadSkills();
  };
  
  // 过滤技能
  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills;
    const lower = searchTerm.toLowerCase();
    return skills.filter(s => 
      s.name.toLowerCase().includes(lower) ||
      s.description.toLowerCase().includes(lower) ||
      s.id.toLowerCase().includes(lower) ||
      s.tags?.some(t => t.toLowerCase().includes(lower))
    );
  }, [skills, searchTerm]);
  
  // 统计
  const enabledCount = skills.filter(s => s.enabled).length;
  const triggerCount = skills.reduce((sum, s) => sum + (s.triggers?.length || 0), 0);
  
  return (
    <div className="h-full flex flex-col p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">技能管理</h2>
          <p className="text-slate-400">
            共 {skills.length} 个技能，{enabledCount} 个已启用，{triggerCount} 个触发器
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
        >
          刷新
        </button>
      </div>
      
      {/* 搜索 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索技能..."
            className="w-full max-w-md px-4 py-2 pl-10 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* 技能列表 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">加载中...</div>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <span className="text-4xl mb-2">📦</span>
            <span>未找到技能</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map(skill => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => handleSelectSkill(skill)}
                onToggle={(enabled) => handleToggleSkill(skill.id, enabled)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 详情模态框 */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetailModal
            skill={selectedSkill}
            content={skillContent}
            onUpdate={(updated) => {
              setSkills(prev => prev.map(s => s.id === updated.id ? updated : s));
              setSelectedSkill(updated);
            }}
            onClose={() => {
              setSelectedSkill(null);
              setSkillContent(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default SkillsPage;