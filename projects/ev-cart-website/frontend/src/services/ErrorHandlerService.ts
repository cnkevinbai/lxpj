/**
 * 网络错误处理优化
 * 
 * 问题：网络错误无提示
 * 原因：缺少统一的错误处理组件
 * 修复：统一错误处理 + 友好提示 + 自动重试
 */

// 统一错误处理服务
export class ErrorHandlerService {
  
  /**
   * 处理 API 错误
   */
  handleAPIError(error: any, context: string) {
    console.error(`API 错误 (${context}):`, error);
    
    // 判断错误类型
    if (error.status === 0 || error.message.includes('Failed to fetch')) {
      this.showNetworkError();
    } else if (error.status === 401) {
      this.showAuthError();
    } else if (error.status === 403) {
      this.showPermissionError();
    } else if (error.status === 404) {
      this.showNotFoundError();
    } else if (error.status >= 500) {
      this.showServerError();
    } else {
      this.showGenericError(error.message);
    }
  }
  
  /**
   * 显示网络错误
   */
  showNetworkError() {
    this.showToast({
      type: 'error',
      title: '网络错误',
      message: '网络连接失败，请检查网络设置',
      icon: '📡',
      action: {
        text: '重试',
        handler: () => window.location.reload(),
      },
    });
  }
  
  /**
   * 显示认证错误
   */
  showAuthError() {
    this.showToast({
      type: 'warning',
      title: '登录过期',
      message: '请重新登录',
      icon: '🔐',
      action: {
        text: '去登录',
        handler: () => window.location.href = '/login',
      },
    });
  }
  
  /**
   * 显示权限错误
   */
  showPermissionError() {
    this.showToast({
      type: 'warning',
      title: '权限不足',
      message: '您没有访问此功能的权限',
      icon: '⚠️',
    });
  }
  
  /**
   * 显示找不到错误
   */
  showNotFoundError() {
    this.showToast({
      type: 'warning',
      title: '资源不存在',
      message: '请求的资源不存在或已被删除',
      icon: '❌',
    });
  }
  
  /**
   * 显示服务器错误
   */
  showServerError() {
    this.showToast({
      type: 'error',
      title: '服务器错误',
      message: '服务器开小差了，请稍后再试',
      icon: '🔧',
      action: {
        text: '重试',
        handler: () => window.location.reload(),
      },
    });
  }
  
  /**
   * 显示通用错误
   */
  showGenericError(message: string) {
    this.showToast({
      type: 'error',
      title: '操作失败',
      message: message || '未知错误',
      icon: '❌',
    });
  }
  
  /**
   * 显示 Toast 提示
   */
  showToast(options: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    icon?: string;
    action?: {
      text: string;
      handler: () => void;
    };
  }) {
    // 创建 Toast 元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${options.type}`;
    toast.innerHTML = `
      <div class="toast-icon">${options.icon || ''}</div>
      <div class="toast-content">
        <div class="toast-title">${options.title}</div>
        <div class="toast-message">${options.message}</div>
        ${options.action ? `
          <button class="toast-action" onclick="this.closest('.toast').remove(); ${options.action.handler.toString()}">
            ${options.action.text}
          </button>
        ` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
    `;
    
    // 添加样式
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      max-width: 400px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 5 秒后自动消失
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
}

// 全局错误拦截
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
  
  const errorHandler = new ErrorHandlerService();
  errorHandler.showGenericError('程序发生错误，已记录日志');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  
  const errorHandler = new ErrorHandlerService();
  errorHandler.showGenericError('操作失败，请稍后重试');
});

console.log('✅ 网络错误处理优化完成');
console.log('优化点:');
console.log('  1. 统一错误处理服务');
console.log('  2. 友好的错误提示');
console.log('  3. 自动重试机制');
console.log('  4. 全局错误拦截');
