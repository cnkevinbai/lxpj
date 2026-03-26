export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: '仪表盘', path: '/dashboard' },
  { id: 'chat', label: '对话', path: '/chat' },
  { id: 'agents', label: '代理管理', path: '/agents' },
  { id: 'tasks', label: '任务管理', path: '/tasks' },
  { id: 'files', label: '文件管理', path: '/files' },
  { id: 'system', label: '系统运维', path: '/system' },
  { id: 'settings', label: '系统设置', path: '/settings' },
];
