'use client';

import { useState, useEffect } from 'react';

/**
 * 在线客服组件
 * 支持美洽、环信、腾讯企点等主流客服系统
 * 
 * 使用方法：
 * 1. 在 .env 中配置 NEXT_PUBLIC_CHAT_PROVIDER 和 NEXT_PUBLIC_CHAT_ID
 * 2. 在 layout.tsx 中引入此组件
 * 3. 根据服务商文档替换对应的脚本
 */

export default function ChatWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 客服配置（从环境变量读取）
  const provider = process.env.NEXT_PUBLIC_CHAT_PROVIDER || 'meiqia';
  const chatId = process.env.NEXT_PUBLIC_CHAT_ID || 'xxxxx';

  useEffect(() => {
    // 延迟加载客服脚本，避免影响首屏加载
    const timer = setTimeout(() => {
      loadChatScript();
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const loadChatScript = () => {
    if (provider === 'meiqia') {
      // 美洽客服
      const script = document.createElement('script');
      script.src = `https://s.meiqia.com/meiqia.js?eid=${chatId}`;
      script.async = true;
      document.body.appendChild(script);
    } else if (provider === 'easemob') {
      // 环信客服
      const script = document.createElement('script');
      script.src = `https://cdn.easemob.com/${chatId}/static/wechat/jswebim.min.js`;
      script.async = true;
      document.body.appendChild(script);
    } else if (provider === 'qidian') {
      // 腾讯企点
      const script = document.createElement('script');
      script.src = `https://qidian.qq.com/script/${chatId}`;
      script.async = true;
      document.body.appendChild(script);
    }
  };

  const openChat = () => {
    setIsVisible(true);
    
    // 调用客服系统 API 打开窗口
    if (provider === 'meiqia' && (window as any).MEIQIA) {
      (window as any).MEIQIA('workbenchMode', 'open');
    }
  };

  if (!isLoaded) return null;

  return (
    <>
      {/* 客服按钮 */}
      <button
        onClick={openChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="在线客服"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {/* 提示文字 */}
        <span className="absolute right-full mr-3 bg-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          在线咨询
        </span>
        
        {/* 未读消息提示 */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          1
        </span>
      </button>

      {/* 工作时间提示 */}
      <div className="fixed bottom-24 right-6 z-50 bg-white px-4 py-3 rounded-lg shadow-lg max-w-xs hidden group-hover:block">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-900 text-sm">在线客服</div>
            <div className="text-xs text-gray-500 mt-1">
              工作时间：9:00-18:00<br />
              非工作时间请留言
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
