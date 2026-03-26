export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  agentId?: string;
  summary?: string; // 会话摘要
  metadata?: {
    // 项目上下文
    projectContext?: {
      projectId: string;
      projectName: string;
      projectPath: string;
      description?: string;
      lastDiscussedAt?: string;
      lastTaskId?: string;
      lastTaskTitle?: string;
    };
    // 其他元数据
    [key: string]: any;
  };
}
