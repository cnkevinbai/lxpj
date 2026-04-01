/**
 * Workflow 审批流程路由配置
 * 
 * @version 1.0.0
 * @since 2026-03-30
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 页面组件
import WorkflowDefinitionList from './WorkflowDefinitionList';
import PendingApproval from './PendingApproval';

// 懒加载组件
const WorkflowInitiated = React.lazy(() => import('./WorkflowInitiated'));
const WorkflowApproved = React.lazy(() => import('./WorkflowApproved'));

/**
 * Workflow 路由组件
 */
const WorkflowRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 流程定义管理 */}
      <Route path="/definitions" element={<WorkflowDefinitionList />} />
      
      {/* 待审批 */}
      <Route path="/pending" element={<PendingApproval />} />
      
      {/* 我发起的 */}
      <Route 
        path="/initiated" 
        element={
          <React.Suspense fallback={<div>加载中...</div>}>
            <WorkflowInitiated />
          </React.Suspense>
        }
      />
      
      {/* 已审批 */}
      <Route 
        path="/approved" 
        element={
          <React.Suspense fallback={<div>加载中...</div>}>
            <WorkflowApproved />
          </React.Suspense>
        }
      />
      
      {/* 默认路由 */}
      <Route path="/" element={<PendingApproval />} />
      <Route path="*" element={<PendingApproval />} />
    </Routes>
  );
};

export default WorkflowRoutes;

// 导出页面组件
export { WorkflowDefinitionList, PendingApproval };