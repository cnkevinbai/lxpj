/**
 * 工作流编辑器组件 - 可视化编排
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workflowEngine, WORKFLOW_TEMPLATES, WorkflowNode } from '../../services/workflow-engine';

// Agent 配置
const AGENTS = [
  { id: 'main', name: '渔晓白', avatar: '🦞', color: '#06B6D4' },
  { id: 'architect', name: 'Morgan', avatar: '🏛️', color: '#8B5CF6' },
  { id: 'backend-dev', name: 'Ryan', avatar: '💻', color: '#10B981' },
  { id: 'frontend-dev', name: 'Chloe', avatar: '🎨', color: '#F59E0B' },
  { id: 'test-engineer', name: 'Taylor', avatar: '🧪', color: '#14B8A6' },
  { id: 'code-reviewer', name: 'Blake', avatar: '👁️', color: '#F97316' },
];

// 节点类型图标
const NODE_ICONS: Record<string, string> = {
  agent: '🤖',
  condition: '🔀',
  parallel: '⚡',
  sequential: '➡️',
  output: '📤',
};

// 工作流节点组件
function WorkflowNodeCard({ 
  node, 
  index, 
  isSelected,
  onSelect,
  onRemove,
}: { 
  node: WorkflowNode; 
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const agent = AGENTS.find(a => a.id === node.agentId);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border cursor-pointer transition-all
        ${isSelected 
          ? 'border-cyan-500 bg-cyan-500/10' 
          : 'border-white/10 hover:border-cyan-500/50'
        }
      `}
      style={{ background: isSelected ? undefined : '#0F172A' }}
    >
      {/* 序号 */}
      <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-bold">
        {index + 1}
      </div>

      {/* 节点信息 */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{NODE_ICONS[node.type]}</span>
        <div className="flex-1">
          <h4 className="text-white font-medium">{node.name}</h4>
          {agent && (
            <p className="text-sm text-slate-400 flex items-center gap-1">
              <span>{agent.avatar}</span>
              <span>{agent.name}</span>
            </p>
          )}
        </div>
        
        {/* 删除按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 子节点 */}
      {node.children && node.children.length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-white/10 space-y-2">
          {node.children.map((child, i) => (
            <div key={child.id} className="text-sm text-slate-400">
              {NODE_ICONS[child.type]} {child.name}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// 主组件
export function WorkflowEditor() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);

  // 添加节点
  const addNode = useCallback((type: WorkflowNode['type'], agentId?: string) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      name: type === 'agent' 
        ? AGENTS.find(a => a.id === agentId)?.name || 'Agent'
        : type.charAt(0).toUpperCase() + type.slice(1),
      agentId,
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  }, []);

  // 移除节点
  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  // 应用模板
  const applyTemplate = useCallback((templateName: string) => {
    const template = WORKFLOW_TEMPLATES[templateName];
    if (template?.nodes) {
      setNodes(template.nodes.map((n, i) => ({
        ...n,
        id: `node-${Date.now()}-${i}`,
      })));
      setShowTemplates(false);
    }
  }, []);

  // 执行工作流
  const executeWorkflow = useCallback(async () => {
    if (nodes.length === 0) return;

    const workflow = workflowEngine.createWorkflow({ nodes });
    console.log('执行工作流:', workflow.id);

    const result = await workflowEngine.execute(workflow.id, { prompt: '测试输入' });
    console.log('执行结果:', result);
  }, [nodes]);

  return (
    <div className="h-full flex">
      {/* 左侧：节点列表 */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">工作流编排</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
            >
              {showTemplates ? '隐藏模板' : '显示模板'}
            </button>
            <button
              onClick={executeWorkflow}
              disabled={nodes.length === 0}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
              style={{ background: nodes.length > 0 ? 'linear-gradient(135deg, #06B6D4, #22C55E)' : '#334155' }}
            >
              执行工作流
            </button>
          </div>
        </div>

        {/* 模板选择 */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <h3 className="text-sm text-slate-400 mb-3">快速模板</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(WORKFLOW_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => applyTemplate(key)}
                    className="p-4 rounded-xl border border-white/10 hover:border-cyan-500/50 text-left transition-colors"
                    style={{ background: '#0F172A' }}
                  >
                    <div className="text-lg mb-1">{template.name}</div>
                    <div className="text-xs text-slate-400">{template.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 节点列表 */}
        <div className="space-y-4">
          <h3 className="text-sm text-slate-400">工作流步骤</h3>
          
          <AnimatePresence mode="popLayout">
            {nodes.map((node, index) => (
              <WorkflowNodeCard
                key={node.id}
                node={node}
                index={index}
                isSelected={selectedNodeId === node.id}
                onSelect={() => setSelectedNodeId(node.id)}
                onRemove={() => removeNode(node.id)}
              />
            ))}
          </AnimatePresence>

          {nodes.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-4xl mb-3">📋</p>
              <p>从右侧添加节点或选择模板</p>
            </div>
          )}
        </div>
      </div>

      {/* 右侧：添加节点面板 */}
      <div className="w-72 border-l border-white/5 p-4 overflow-y-auto" style={{ background: '#0F172A' }}>
        <h3 className="text-sm text-slate-400 mb-4">添加节点</h3>

        {/* Agent 节点 */}
        <div className="mb-6">
          <h4 className="text-xs text-slate-500 mb-2 uppercase">Agent 节点</h4>
          <div className="space-y-2">
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => addNode('agent', agent.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors"
              >
                <span className="text-xl">{agent.avatar}</span>
                <span className="text-white text-sm">{agent.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 控制节点 */}
        <div>
          <h4 className="text-xs text-slate-500 mb-2 uppercase">控制节点</h4>
          <div className="space-y-2">
            <button
              onClick={() => addNode('parallel')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors"
            >
              <span className="text-xl">⚡</span>
              <span className="text-white text-sm">并行执行</span>
            </button>
            <button
              onClick={() => addNode('sequential')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors"
            >
              <span className="text-xl">➡️</span>
              <span className="text-white text-sm">顺序执行</span>
            </button>
            <button
              onClick={() => addNode('condition')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors"
            >
              <span className="text-xl">🔀</span>
              <span className="text-white text-sm">条件分支</span>
            </button>
            <button
              onClick={() => addNode('output')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors"
            >
              <span className="text-xl">📤</span>
              <span className="text-white text-sm">输出节点</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkflowEditor;