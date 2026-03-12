'use client';

import { useEffect } from 'react';

/**
 * 网站统计组件
 * 支持百度统计、Google Analytics、友盟等
 * 
 * 使用方法：
 * 1. 在 .env 中配置对应的统计 ID
 * 2. 在 layout.tsx 中引入此组件
 */

export default function Analytics() {
  const baiduId = process.env.NEXT_PUBLIC_BAIDU_TONGJI;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // 百度统计
    if (baiduId) {
      const script = document.createElement('script');
      script.innerHTML = `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?${baiduId}";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `;
      document.head.appendChild(script);
    }

    // Google Analytics
    if (gaId) {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(script2);
    }
  }, [baiduId, gaId]);

  return null;
}
