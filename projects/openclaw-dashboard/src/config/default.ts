export default {
  port: 3000,
  theme: 'dark',
  language: 'zh-CN',
  autoSaveChatHistory: true,
  logging: {
    level: 'info',
    path: './logs',
  },
  api: {
    baseUrl: 'http://localhost:18789/api/v1',
    websocketUrl: 'ws://localhost:18789/ws',
  },
};
