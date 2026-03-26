#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
验证阿里云百炼 API Key 是否有效
"""

import requests
import json

# 配置
API_KEY = "sk-sp-9352c9c946ea46ec93c6a4ca375db68e"
BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"

def test_api_key():
    """测试 API Key 是否有效"""
    print("=" * 60)
    print("阿里云百炼 API Key 验证")
    print("=" * 60)
    print(f"\nAPI Key: {API_KEY[:15]}...{API_KEY[-10:]}")
    print(f"API 端点：{BASE_URL}\n")
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "qwen-turbo",
        "messages": [
            {"role": "user", "content": "你好"}
        ],
        "max_tokens": 10
    }
    
    url = f"{BASE_URL}/chat/completions"
    
    print("正在测试 API Key 有效性...\n")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        print(f"响应状态码：{response.status_code}\n")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Key 有效！")
            print(f"\n响应内容：{result['choices'][0]['message']['content']}")
            
            if 'usage' in result:
                print(f"\nToken 使用:")
                print(f"  输入：{result['usage']['prompt_tokens']}")
                print(f"  输出：{result['usage']['completion_tokens']}")
                print(f"  总计：{result['usage']['total_tokens']}")
            return True
            
        elif response.status_code == 401:
            error = response.json()
            print("❌ API Key 无效或已过期！")
            print(f"\n错误信息：{error.get('error', {}).get('message', 'Unknown error')}")
            print(f"错误代码：{error.get('error', {}).get('code', 'Unknown')}")
            return False
            
        else:
            print(f"❌ 请求失败：{response.status_code}")
            print(f"响应内容：{response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ 网络错误：{str(e)}")
        return False
    except Exception as e:
        print(f"❌ 未知错误：{str(e)}")
        return False

def check_service_status():
    """检查百炼服务状态"""
    print("\n" + "=" * 60)
    print("检查建议")
    print("=" * 60)
    print("""
如果 API Key 无效，请按以下步骤检查：

1. 验证 API Key 是否正确
   - 登录：https://dashscope.console.aliyun.com/
   - 进入「API Key 管理」
   - 确认 API Key 是否正确复制

2. 检查是否开通百炼服务
   - 访问：https://dashscope.console.aliyun.com/
   - 首次使用需要开通服务

3. 检查是否开通 Coding Plan
   - 访问：https://t.aliyun.com/U/isP6Y7
   - 购买或激活 Coding Plan 套餐

4. 重新创建 API Key
   - 删除旧的 API Key
   - 创建新的 API Key
   - 更新配置

5. 检查账户余额
   - 登录阿里云控制台
   - 查看账户余额和欠费状态
""")

if __name__ == "__main__":
    success = test_api_key()
    
    if not success:
        check_service_status()
    
    print("\n按 Enter 键退出...")
    input()
