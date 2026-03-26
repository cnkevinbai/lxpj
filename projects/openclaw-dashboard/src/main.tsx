/**
 * OpenClaw Dashboard - 应用入口
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './providers/ThemeProvider';
import { NotificationProvider } from './providers/NotificationProvider';
import App from './App';
import './index.css'; // Tailwind CSS 基础样式 (必须先导入)
import './styles/global.css';
import './i18n'; // 国际化

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>,
);