/**
 * 主对话页面 - 高性能优化版
 * 
 * 优化策略：
 * 1. 并行初始化 - 会话和消息同时加载
 * 2. 消息缓存 - Map缓存已加载的消息，切换会话秒开
 * 3. 乐观更新 - UI立即响应，后台同步
 * 4. SSE节流 - requestAnimationFrame减少重绘
 * 5. 预创建会话 - 提前准备新会话
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore, useSessionStore } from '../store';
import { sessionApi, messageApi, Session, Message } from '../services/chat-api';
import { smartRouter, SpecialistTask, ParallelTaskGroup } from '../services/smart-router';
import { windowService } from '../services/window-manager';
import { projectService, ProjectContext } from '../services/project-context';
import { MessageList, ChatMessage, SessionSummary, CompressionIndicator } from '../components/chat';
import { MessageInput } from '../components/chat/MessageInput';
import { SessionList } from '../components/chat/SessionList';

// Agent 配置
const AGENT_CONFIG: Record<string, { name: string; avatar: string }> = {
  main: { name: '渔晓白', avatar: '🦞' },
  architect: { name: 'Morgan', avatar: '🏛️' },
  'backend-dev': { name: 'Ryan', avatar: '💻' },
  'frontend-dev': { name: 'Chloe', avatar: '🎨' },
  'database-engineer': { name: 'Diana', avatar: '🗄️' },
  'devops-engineer': { name: 'Sam', avatar: '🚀' },
  'security-engineer': { name: 'Sophia', avatar: '🔐' },
  'test-engineer': { name: 'Taylor', avatar: '🧪' },
  'code-reviewer': { name: 'Blake', avatar: '👁️' },
  'ui-ux-designer': { name: 'Maya', avatar: '✨' },
};

// 全局消息缓存（跨会话复用）
const messageCache = new Map<string, ChatMessage[]>();

export function ChatPage() {
  const { activeAgentId, agents, switchAgent, loadMemories } = useAgentStore();
  const { compression, summary, startCompression, finishCompression, startGeneratingSummary, finishGeneratingSummary } = useSessionStore();

  // 会话状态
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // 项目上下文状态
  const [projectContext, setProjectContext] = useState<ProjectContext | null>(null);
  
  // UI 状态
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showSessionList, setShowSessionList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SSE节流相关
  const streamingRef = useRef<string>('');
  const rafRef = useRef<number | null>(null);

  // SSE节流相关
  // 当前 Agent
  const currentAgent = useMemo(() => {
    const agent = agents.find((a: any) => a.id === activeAgentId);
    return agent || AGENT_CONFIG[activeAgentId] || AGENT_CONFIG.main;
  }, [agents, activeAgentId]);

  // 初始化 - 并行加载
  useEffect(() => {
    init();
  }, []);

  // 监听任务完成事件 - 主Agent继续讨论
  useEffect(() => {
    const handleTaskComplete = async (data: { windowId: string; result: string; agentId: string }) => {
      console.log('[ChatPage] 收到任务完成事件:', data);
      
      if (!currentSession || !data.result) return;
      
      // 1. 显示任务结果
      const resultMessage: ChatMessage = {
        id: `result-${Date.now()}`,
        sessionId: currentSession.id,
        role: 'agent',
        content: `📋 **${AGENT_CONFIG[data.agentId]?.name || data.agentId}** 任务完成\n\n${data.result.slice(0, 500)}${data.result.length > 500 ? '...' : ''}`,
        agentId: 'main',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, resultMessage]);
      
      // 2. 调用AI让主Agent继续讨论
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const prompt = `专业Agent "${AGENT_CONFIG[data.agentId]?.name || data.agentId}" 已完成任务，以下是执行结果：\n\n${data.result.slice(0, 2000)}\n\n请根据以上结果，给用户一个清晰的总结和建议。`;
        
        const response = await fetch(`${apiUrl}/stream/ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
          body: JSON.stringify({ 
            prompt, 
            agentId: 'main', 
            sessionId: currentSession.id 
          }),
        });

        if (response.ok && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let fullContent = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const d = JSON.parse(line.slice(6));
                  if (d.type === 'chunk' && d.data?.content) {
                    fullContent += d.data.content;
                  }
                } catch (e) {}
              }
            }
          }

          // 3. 添加主Agent的讨论消息
          if (fullContent) {
            const discussionMessage: ChatMessage = {
              id: `discussion-${Date.now()}`,
              sessionId: currentSession.id,
              role: 'agent',
              content: fullContent,
              agentId: 'main',
              createdAt: new Date().toISOString(),
            };
            setMessages(prev => [...prev, discussionMessage]);
            
            // 保存到数据库
            try {
              await messageApi.sendMessage(currentSession.id, { 
                content: fullContent, 
                agentId: 'main' 
              });
            } catch (e) {}
          }
        }
      } catch (e) {
        console.error('[ChatPage] 主Agent讨论失败:', e);
      }
    };

    const unsubscribe = windowService.on('task_complete', handleTaskComplete);
    return () => {
      unsubscribe();
    };
  }, [currentSession]);

  const init = async () => {
    console.log('[ChatPage] === INIT START (并行优化) ===');
    const startTime = performance.now();
    
    try {
      setLoading(true);
      
      // 1. 加载会话列表
      const sessionPromise = sessionApi.getSessions(1, 50);
      
      // 等待会话列表
      const response = await sessionPromise;
      const sessionList = response.items || [];
      console.log('[ChatPage] Sessions loaded:', sessionList.length, `(${(performance.now() - startTime).toFixed(0)}ms)`);
      
      if (sessionList.length === 0) {
        // 无会话，创建新会话
        const newSession = await sessionApi.createSession({ title: '新对话', agentId: 'main' });
        setSessions([newSession]);
        setCurrentSession(newSession);
        setMessages([]);
      } else {
        setSessions(sessionList);
        
        // 2. 并行：设置当前会话 + 加载消息
        const firstSession = sessionList[0];
        setCurrentSession(firstSession);
        
        // 检查缓存
        const cached = messageCache.get(firstSession.id);
        if (cached) {
          console.log('[ChatPage] 使用缓存消息');
          setMessages(cached);
          
          // 检查是否需要自动压缩
          autoCompressIfNeeded(firstSession.id, cached.length);
        } else {
          // 后台加载消息
          loadMessagesInBackground(firstSession.id);
        }
        
        // 加载摘要
        if (firstSession.summary) {
          finishGeneratingSummary(firstSession.summary);
        } else if (!summary.isGeneratingSummary) {
          generateSessionSummary(firstSession.id);
        }
        
        // 加载 Agent 记忆（不阻塞主流程）
        loadMemories(firstSession.agentId).catch(e => 
          console.warn('[ChatPage] 加载记忆失败，继续初始化:', e)
        );
      }
    } catch (err) {
      console.error('[ChatPage] Init failed:', err);
    } finally {
      setLoading(false);
      console.log('[ChatPage] === INIT END ===', `${(performance.now() - startTime).toFixed(0)}ms`);
    }
  };

  // 后台加载消息（不阻塞UI）
  const loadMessagesInBackground = async (sessionId: string) => {
    try {
      const msgResponse = await messageApi.getMessages(sessionId);
      const loadedMessages: ChatMessage[] = (msgResponse.items || []).map((msg: any) => ({
        id: msg.id,
        sessionId: msg.sessionId,
        role: msg.type === 'agent' ? 'agent' : msg.type === 'system' ? 'system' : 'user',
        content: msg.content,
        agentId: msg.agentId,
        createdAt: msg.createdAt,
      }));
      
      // 缓存消息
      messageCache.set(sessionId, loadedMessages);
      setMessages(loadedMessages);
      
      // 检查是否需要自动压缩
      autoCompressIfNeeded(sessionId, loadedMessages.length);
      
      // 加载摘要
      if (currentSession && !currentSession.summary && !summary.isGeneratingSummary) {
        generateSessionSummary(sessionId);
      }
      
      // 加载 Agent 记忆（不阻塞）
      if (currentSession) {
        loadMemories(currentSession.agentId).catch(e => 
          console.warn('[ChatPage] 加载记忆失败:', e)
        );
      }
    } catch (e) {
      console.error('[ChatPage] 加载消息失败:', e);
    }
  };

  // 选择会话 - 优先使用缓存
  const selectSession = async (session: Session) => {
    setCurrentSession(session);
    
    // 1. 优先使用缓存
    const cached = messageCache.get(session.id);
    if (cached) {
      setMessages(cached);
      
      // 加载摘要（如果有）
      if (session.summary) {
        finishGeneratingSummary(session.summary);
      } else if (!summary.isGeneratingSummary) {
        // 没有摘要时，后台生成摘要
        generateSessionSummary(session.id);
      }
      
      // 加载 Agent 记忆（不阻塞）
      loadMemories(session.agentId).catch(e => 
        console.warn('[ChatPage] 加载记忆失败:', e)
      );
      
      return; // 缓存命中，无需请求
    }
    
    // 2. 缓存未命中，后台加载
    setMessages([]); // 先清空，避免显示旧数据
    loadMessagesInBackground(session.id);
    
    // 3. 加载摘要
    if (session.summary) {
      finishGeneratingSummary(session.summary);
    } else if (!summary.isGeneratingSummary) {
      generateSessionSummary(session.id);
    }
    
    // 4. 加载 Agent 记忆
    loadMemories(session.agentId);
  };
  
  // 生成会话摘要
  const generateSessionSummary = async (sessionId: string) => {
    if (summary.isGeneratingSummary) return;
    
    startGeneratingSummary();
    try {
      const result = await sessionApi.generateSummary(sessionId);
      if (result.success && result.summary) {
        finishGeneratingSummary(result.summary);
      }
    } catch (error) {
      console.error('[ChatPage] Failed to generate summary:', error);
      finishGeneratingSummary('');
    }
  };
  
  // 自动压缩会话上下文
  const autoCompressIfNeeded = async (sessionId: string, messageCount: number) => {
    const { compression, setAutoCompressEnabled } = useSessionStore.getState();
    
    if (!compression.autoCompressEnabled) return;
    if (messageCount < compression.compressionTriggerThreshold) return;
    if (compression.isCompressing) return;
    
    // 检查是否已经压缩过（可通过会话的 compressionSummary 字段判断）
    // 这里简化处理，每次超过阈值都自动压缩
    console.log(`[ChatPage] Message count (${messageCount}) exceeded threshold (${compression.compressionTriggerThreshold}), auto-compressing...`);
    
    startCompression();
    try {
      const result = await sessionApi.autoCompressSession(sessionId);
      if (result.success && result.summary) {
        finishCompression(result.summary);
      }
    } catch (error) {
      console.error('[ChatPage] Auto-compression failed:', error);
      finishCompression('');
    }
  };

  // 创建新会话
  const createNewSession = async () => {
    console.log('[ChatPage] createNewSession called');
    try {
      setLoading(true);
      const session = await sessionApi.createSession({ title: '新对话', agentId: activeAgentId || 'main' });
      console.log('[ChatPage] new session created:', session);
      setSessions(prev => [session, ...prev]);
      setCurrentSession(session);
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('[ChatPage] Failed to create session:', err);
      setError('创建会话失败，请重试');
    } finally {
      setLoading(false);
    }
  };


  // 发送消息 - 即时响应优化 + 消息持久化 + 项目上下文
  const handleSend = useCallback(async (content: string, attachments?: File[]) => {
    if ((!content.trim() && !attachments?.length) || sending || !currentSession) {
      return;
    }

    const startTime = performance.now();
    console.log('[ChatPage] handleSend:', content.slice(0, 50), 'attachments:', attachments?.length || 0);
    
    // 处理附件上传
    let uploadedFiles: { id: string; name: string; url: string; type: string }[] = [];
    if (attachments && attachments.length > 0) {
      try {
        const formData = new FormData();
        attachments.forEach(file => formData.append('files', file));
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const uploadRes = await fetch(`${apiUrl}/files/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedFiles = uploadData.files || uploadData || [];
          console.log('[ChatPage] 上传成功:', uploadedFiles.length, '个文件');
        }
      } catch (e) {
        console.error('[ChatPage] 文件上传失败:', e);
      }
    }
    
    // 构建带附件信息的消息
    let messageContent = content;
    if (uploadedFiles.length > 0) {
      const fileList = uploadedFiles.map(f => 
        f.type.startsWith('image/') 
          ? `![${f.name}](${f.url})` 
          : `[${f.name}](${f.url})`
      ).join('\n');
      messageContent = content + '\n\n📎 附件:\n' + fileList;
    }
    
    // 自动检测项目上下文
    const detectedProject = projectService.detectProject(content);
    const currentProject = detectedProject || projectContext;
    
    // 如果检测到新项目，更新状态
    if (detectedProject && (!projectContext || detectedProject.projectId !== projectContext.projectId)) {
      console.log('[ChatPage] 检测到项目上下文:', detectedProject.projectName);
      setProjectContext(detectedProject);
      
      // 更新会话的项目上下文
      sessionApi.updateSession(currentSession.id, {
        title: currentSession.title,
        metadata: {
          ...currentSession.metadata,
          projectContext: {
            ...detectedProject,
            lastDiscussedAt: new Date().toISOString(),
          },
        },
      }).catch(() => {});
    }
    
    // 构建带项目上下文的消息
    let enhancedContent = messageContent;
    if (currentProject) {
      enhancedContent = `[当前项目：${currentProject.projectName}]\n${messageContent}`;
    }
    
    // 1. 保存用户消息到数据库
    let savedUserMsg;
    try {
      savedUserMsg = await messageApi.sendMessage(currentSession.id, { content: messageContent, agentId: undefined });
    } catch (e) {
      console.error('[ChatPage] 保存用户消息失败:', e);
    }
    
    // 2. 立即显示用户消息（乐观更新）
    const userMessage: ChatMessage = {
      id: savedUserMsg?.id || `user-${Date.now()}`,
      sessionId: currentSession.id,
      role: 'user',
      content: messageContent,
      createdAt: savedUserMsg?.createdAt || new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // 标记发送中
    setSending(true);
    setError(null);

    // 3. 后台更新标题（乐观更新）
    if (currentSession.title === '新对话') {
      const newTitle = content.slice(0, 30) + (content.length > 30 ? '...' : '');
      setCurrentSession(prev => prev ? { ...prev, title: newTitle } : prev);
      sessionApi.updateSession(currentSession.id, { title: newTitle }).catch(() => {});
    }

    // 智能路由分析（静默，快速）
    const analysis = smartRouter.analyzeTask(content);

    // 如果需要专业Agent，创建任务窗口
    if (analysis.needsSpecialist && analysis.tasks.length > 0) {
      const group = smartRouter.createParallelTaskGroup(analysis.tasks);
      
      // 1. 主Agent先回复用户，说明要分配任务
      const mainAgentReply: ChatMessage = {
        id: `main-${Date.now()}`,
        sessionId: currentSession.id,
        role: 'agent',
        content: `${analysis.summary}\n\n${analysis.tasks.map(t => `> ${t.agentAvatar} **${t.agentName}**: ${t.taskDescription.slice(0, 60)}...`).join('\n')}\n\n正在创建任务窗口执行...`,
        agentId: 'main',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, mainAgentReply]);
      
      // 2. 保存主Agent回复到数据库
      try {
        await messageApi.sendMessage(currentSession.id, { 
          content: mainAgentReply.content, 
          agentId: 'main' 
        });
      } catch (e) {
        console.error('[ChatPage] 保存主Agent消息失败:', e);
      }

      // 3. 创建任务窗口（使用 windowService 创建真正的窗口）
      for (const task of analysis.tasks) {
        const windowTitle = `${task.agentAvatar} ${task.agentName} - ${task.taskDescription.slice(0, 30)}`;
        
        // 使用 windowService 创建独立任务窗口
        const windowId = windowService.openTaskWindow({
          agentId: task.agentId,
          title: windowTitle,
          initialMessage: task.taskDescription, // 传递任务描述
        });
        
        smartRouter.updateTaskStatus(group.groupId, task.id, 'running', undefined, windowId);
        
        console.log(`[ChatPage] 创建任务窗口: ${windowId} for ${task.agentName}`);
      }

      setSending(false);
      return;
    }

    // 普通对话 -> SSE 流式响应（节流优化）
    try {
      setIsTyping(true);
      streamingRef.current = '';
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${apiUrl}/stream/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify({ 
          prompt: enhancedContent,  // 使用增强后的内容（包含项目上下文）
          agentId: activeAgentId || 'main', 
          sessionId: currentSession.id,
          projectContext: currentProject,  // 传递项目上下文
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // SSE节流：使用requestAnimationFrame
      const flushToState = () => {
        if (streamingRef.current !== '') {
          setStreamingContent(streamingRef.current);
        }
      };
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk' && data.data?.content) {
                streamingRef.current += data.data.content;
                // 节流：每帧最多更新一次
                if (!rafRef.current) {
                  rafRef.current = requestAnimationFrame(() => {
                    flushToState();
                    rafRef.current = null;
                  });
                }
              }
            } catch (e) {}
          }
        }
      }

      // 最终内容
      const fullContent = streamingRef.current;
      
      // 取消未执行的RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // 保存 AI 消息到数据库
      if (fullContent) {
        let savedAgentMsg;
        try {
          savedAgentMsg = await messageApi.sendMessage(currentSession.id, { 
            content: fullContent, 
            agentId: activeAgentId || 'main' 
          });
        } catch (e) {
          console.error('[ChatPage] 保存AI消息失败:', e);
        }
        
        const agentMessage: ChatMessage = {
          id: savedAgentMsg?.id || `agent-${Date.now()}`,
          sessionId: currentSession.id,
          role: 'agent',
          content: fullContent,
          agentId: activeAgentId || 'main',
          createdAt: savedAgentMsg?.createdAt || new Date().toISOString(),
        };
        setMessages(prev => {
          const newMessages = [...prev, agentMessage];
          // 更新缓存
          messageCache.set(currentSession.id, newMessages);
          return newMessages;
        });
      }

      setStreamingContent('');
      setIsTyping(false);
      setSending(false);
      
      console.log('[ChatPage] 发送完成', `${(performance.now() - startTime).toFixed(0)}ms`);

    } catch (err) {
      console.error('[ChatPage] Send failed:', err);
      setError('发送失败，请重试');
      setIsTyping(false);
      setSending(false);
    }
  }, [currentSession, sending, activeAgentId]);

  // 加载状态
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl animate-pulse bg-slate-800 border border-red-500/50">
            🦞
          </div>
          <p className="text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* 左侧：会话列表 */}
      <AnimatePresence>
        {showSessionList && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-white/5 overflow-hidden"
          >
            <SessionList
              sessions={sessions}
              currentSessionId={currentSession?.id || null}
              onSelectSession={selectSession}
              onNewSession={createNewSession}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 右侧：聊天区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5" style={{ background: '#0F172A' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSessionList(!showSessionList)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showSessionList ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'} />
              </svg>
            </button>
            
            <div>
              <h2 className="text-lg font-semibold text-white truncate max-w-[200px]">
                {currentSession?.title || '新对话'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="text-lg">{currentAgent.avatar}</span>
                <span>{currentAgent.name}</span>
              </div>
            </div>
          </div>

          {/* Agent 选择器 */}
          <select
            value={activeAgentId}
            onChange={(e) => switchAgent(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            {agents.map((agent: any) => (
              <option key={agent.id} value={agent.id}>
                {agent.avatar} {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* 压缩指示器 */}
        {currentSession && (
          <CompressionIndicator
            compressed={!!compression.compressionSummary}
            compressionSummary={compression.compressionSummary}
            isCompressing={compression.isCompressing}
          />
        )}

        {/* 会话摘要 */}
        {currentSession && summary.summary && (
          <SessionSummary
            summary={summary.summary}
            isGenerating={summary.isGeneratingSummary}
          />
        )}

        {/* 消息列表 */}
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            isTyping={isTyping}
            typingAgentId={activeAgentId}
            streamingContent={streamingContent}
            streamingAgentId={activeAgentId}
          />
        </div>

        {/* 项目上下文选择器 */}
        <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">项目上下文:</span>
            <select
              value={projectContext?.projectId || ''}
              onChange={(e) => {
                const project = projectService.getProjectById(e.target.value);
                setProjectContext(project || null);
              }}
              className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 border border-slate-600 focus:outline-none focus:border-cyan-500"
            >
              <option value="">自动检测</option>
              {projectService.getAllProjects().map(p => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectName}
                </option>
              ))}
            </select>
            {projectContext && (
              <span className="text-xs text-cyan-400/70">
                📁 {projectContext.projectPath}
              </span>
            )}
          </div>
        </div>

        {/* 输入区域 */}
        <MessageInput
          onSend={handleSend}
          disabled={sending}
          agentName={currentAgent.name}
          agentAvatar={currentAgent.avatar}
        />
      </div>

    </div>
  );
}