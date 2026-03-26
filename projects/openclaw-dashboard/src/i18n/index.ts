/**
 * 国际化配置 - i18next
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 中文翻译
const zhCN = {
  common: {
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    search: '搜索',
    confirm: '确认',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',
  },
  nav: {
    dashboard: '仪表盘',
    chat: '对话',
    agents: '代理',
    tasks: '任务',
    files: '文件',
    system: '系统',
    settings: '设置',
    logout: '退出登录',
  },
  dashboard: {
    title: '仪表盘',
    welcome: '欢迎回来',
    activeSessions: '活跃会话',
    tasksCompleted: '任务完成',
    agentsOnline: '代理在线',
    messageCount: '消息数量',
    quickActions: '快捷操作',
    newChat: '新对话',
    createTask: '创建任务',
    fileManagement: '文件管理',
    systemSettings: '系统设置',
    recentActivity: '最近活动',
    agentStatus: '代理状态',
  },
  chat: {
    title: '对话',
    newSession: '新会话',
    inputPlaceholder: '输入消息... (Enter 发送)',
    send: '发送',
    sending: '发送中',
    typing: '正在输入...',
    thinking: '正在思考...',
    noMessages: '开始新对话',
    selectAgent: '选择代理',
    autoDispatch: '自动派发',
  },
  agents: {
    title: '代理管理',
    activeAgent: '当前活跃代理',
    enabled: '已启用',
    disabled: '已禁用',
    switchAgent: '切换代理',
    specialties: '专长',
  },
  tasks: {
    title: '任务管理',
    newTask: '新建任务',
    pending: '待处理',
    inProgress: '进行中',
    completed: '已完成',
    priority: {
      low: '低',
      medium: '中',
      high: '高',
      critical: '紧急',
    },
    boardView: '看板视图',
    listView: '列表视图',
  },
  settings: {
    title: '设置',
    general: '常规',
    api: 'API 配置',
    notifications: '通知',
    security: '安全',
    theme: '主题设置',
    language: '语言设置',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    systemTheme: '跟随系统',
    resetToDefault: '重置为默认',
  },
  system: {
    title: '系统状态',
    status: '状态',
    health: '健康状态',
    metrics: '系统指标',
    uptime: '运行时间',
    version: '版本',
    platform: '平台',
  },
  auth: {
    login: '登录',
    logout: '退出',
    username: '用户名',
    password: '密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
  },
};

// 英文翻译
const enUS = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  },
  nav: {
    dashboard: 'Dashboard',
    chat: 'Chat',
    agents: 'Agents',
    tasks: 'Tasks',
    files: 'Files',
    system: 'System',
    settings: 'Settings',
    logout: 'Logout',
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    activeSessions: 'Active Sessions',
    tasksCompleted: 'Tasks Completed',
    agentsOnline: 'Agents Online',
    messageCount: 'Messages',
    quickActions: 'Quick Actions',
    newChat: 'New Chat',
    createTask: 'Create Task',
    fileManagement: 'File Management',
    systemSettings: 'System Settings',
    recentActivity: 'Recent Activity',
    agentStatus: 'Agent Status',
  },
  chat: {
    title: 'Chat',
    newSession: 'New Session',
    inputPlaceholder: 'Type a message... (Enter to send)',
    send: 'Send',
    sending: 'Sending',
    typing: 'Typing...',
    thinking: 'Thinking...',
    noMessages: 'Start a new conversation',
    selectAgent: 'Select Agent',
    autoDispatch: 'Auto Dispatch',
  },
  agents: {
    title: 'Agent Management',
    activeAgent: 'Active Agent',
    enabled: 'Enabled',
    disabled: 'Disabled',
    switchAgent: 'Switch Agent',
    specialties: 'Specialties',
  },
  tasks: {
    title: 'Task Management',
    newTask: 'New Task',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    },
    boardView: 'Board View',
    listView: 'List View',
  },
  settings: {
    title: 'Settings',
    general: 'General',
    api: 'API Configuration',
    notifications: 'Notifications',
    security: 'Security',
    theme: 'Theme',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemTheme: 'Follow System',
    resetToDefault: 'Reset to Default',
  },
  system: {
    title: 'System Status',
    status: 'Status',
    health: 'Health',
    metrics: 'Metrics',
    uptime: 'Uptime',
    version: 'Version',
    platform: 'Platform',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    loginSuccess: 'Login Successful',
    loginFailed: 'Login Failed',
  },
};

// 初始化 i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      'en-US': { translation: enUS },
    },
    fallbackLng: 'zh-CN',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

// 语言列表
export const LANGUAGES = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
];