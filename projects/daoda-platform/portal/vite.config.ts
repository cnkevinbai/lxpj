import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 图表库体积较大，调整警告阈值
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 更细粒度的 manualChunks 配置
        manualChunks: (id) => {
          // 排除 node_modules 之外的文件
          if (!id.includes('node_modules')) {
            // 按模块分割页面 - 业务模块
            if (id.includes('/pages/')) {
              if (id.includes('/workflow/')) return 'workflow-pages';
              if (id.includes('/notification/')) return 'notification-pages';
              if (id.includes('/crm/')) return 'crm-pages';
              if (id.includes('/erp/')) return 'erp-pages';
              if (id.includes('/finance/')) return 'finance-pages';
              if (id.includes('/hr/')) return 'hr-pages';
              if (id.includes('/service/')) return 'service-pages';
              if (id.includes('/cms/')) return 'cms-pages';
              if (id.includes('/settings/')) return 'settings-pages';
              if (id.includes('/common/')) return 'common-pages';
              if (id.includes('/auth/')) return 'auth-pages';
              return 'pages';
            }
            // 组件库分离
            if (id.includes('/components/')) {
              if (id.includes('/layout/')) return 'layout-components';
              return 'ui-components';
            }
            // Store 分离
            if (id.includes('/stores/')) return 'stores';
            // Hooks 分离
            if (id.includes('/hooks/')) return 'hooks';
            // Utils 分离
            if (id.includes('/utils/')) return 'app-utils';
            // Types 分离
            if (id.includes('/types/')) return 'types';
            return;
          }

          // ========== node_modules 分割 ==========

          // React 核心
          if (id.includes('/react/') || id.includes('/react-dom/')) {
            return 'react-core';
          }
          if (id.includes('react-router-dom') || id.includes('react-router')) {
            return 'react-router';
          }

          // Ant Design 图标（单独分离，体积大）
          if (id.includes('@ant-design/icons')) {
            return 'antd-icons';
          }

          // Ant Design Plots 图表库 - 按图表类型分割
          if (id.includes('@ant-design/plots')) {
            // 基础图表
            if (id.includes('/lib/plots/pie') || id.includes('/lib/plots/donut')) return 'plot-pie';
            if (id.includes('/lib/plots/line') || id.includes('/lib/plots/area')) return 'plot-line';
            if (id.includes('/lib/plots/column') || id.includes('/lib/plots/bar')) return 'plot-column';
            if (id.includes('/lib/plots/scatter') || id.includes('/lib/plots/bubble')) return 'plot-scatter';
            if (id.includes('/lib/plots/radar') || id.includes('/lib/plots/gauge')) return 'plot-other';
            return 'plots-core';
          }

          // Ant Design Pro 组件按类型分割
          if (id.includes('@ant-design/pro-components')) {
            if (id.includes('pro-table') || id.includes('pro-list')) return 'pro-table';
            if (id.includes('pro-form') || id.includes('pro-field')) return 'pro-form';
            if (id.includes('pro-layout') || id.includes('pro-menu')) return 'pro-layout';
            return 'pro-components';
          }

          // Ant Design 核心按组件类别分割
          if (id.includes('antd/es') || id.includes('antd/lib')) {
            // 表单组件
            if (id.includes('/form/') || id.includes('/input/') || id.includes('/select/') || 
                id.includes('/date-picker/') || id.includes('/time-picker/') || id.includes('/upload/')) {
              return 'antd-form';
            }
            // 表格和数据展示
            if (id.includes('/table/') || id.includes('/list/') || id.includes('/tree/') || 
                id.includes('/pagination/') || id.includes('/statistic/')) {
              return 'antd-data';
            }
            // 布局组件
            if (id.includes('/layout/') || id.includes('/grid/') || id.includes('/space/') || 
                id.includes('/divider/')) {
              return 'antd-layout';
            }
            // 导航组件
            if (id.includes('/menu/') || id.includes('/dropdown/') || id.includes('/breadcrumb/') || 
                id.includes('/tabs/') || id.includes('/steps/')) {
              return 'antd-nav';
            }
            // 反馈组件
            if (id.includes('/modal/') || id.includes('/drawer/') || id.includes('/message/') || 
                id.includes('/notification/') || id.includes('/progress/') || id.includes('/spin/')) {
              return 'antd-feedback';
            }
            // 其他 antd 组件
            return 'antd-ui';
          }

          // 图表库
          if (id.includes('echarts') || id.includes('echarts-for-react') || id.includes('@ant-design/charts')) {
            return 'charts';
          }

          // 工具库
          if (id.includes('dayjs')) return 'dayjs';
          if (id.includes('axios')) return 'axios';
          if (id.includes('zustand')) return 'zustand';
          if (id.includes('lodash') || id.includes('lodash-es')) return 'lodash';
          if (id.includes('@tanstack/react-query')) return 'react-query';
          if (id.includes('immer')) return 'immer';

          // 其他第三方库
          if (id.includes('rc-')) return 'rc-components';
        },
      },
    },
  },
})