#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
百炼 Coding Plan API 测试脚本
用于在本地快速测试百炼 API 调用
"""

from openai import OpenAI
import os

# 配置
API_KEY = "sk-sp-9352c9c946ea46ec93c6a4ca375db68e"
BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
MODEL = "qwen-coder-plus"

def test_chat():
    """测试对话功能"""
    print("=" * 60)
    print("百炼 Coding Plan API 测试")
    print("=" * 60)
    
    # 初始化客户端
    client = OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL
    )
    
    # 测试对话
    messages = [
        {"role": "system", "content": "你是一个专业的编程助手"},
        {"role": "user", "content": "请用 Python 写一个车辆数据解析函数，支持解析 JSON 格式的车辆状态数据"}
    ]
    
    print("\n正在调用百炼 API...\n")
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )
        
        print("✅ API 调用成功！\n")
        print("响应内容：")
        print("-" * 60)
        print(response.choices[0].message.content)
        print("-" * 60)
        
        # 打印使用信息
        if hasattr(response, 'usage'):
            print(f"\nToken 使用情况:")
            print(f"  输入：{response.usage.prompt_tokens}")
            print(f"  输出：{response.usage.completion_tokens}")
            print(f"  总计：{response.usage.total_tokens}")
            
    except Exception as e:
        print(f"❌ API 调用失败：{str(e)}")
        return False
    
    return True

def test_code_generation():
    """测试代码生成功能"""
    print("\n" + "=" * 60)
    print("代码生成测试")
    print("=" * 60 + "\n")
    
    client = OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL
    )
    
    messages = [
        {"role": "system", "content": "你是一个专业的 Java 开发工程师"},
        {"role": "user", "content": "请用 Java 写一个 MQTT 消息发送工具类，包含连接、发送、关闭功能"}
    ]
    
    print("正在生成代码...\n")
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.3,  # 降低随机性，让代码更稳定
            max_tokens=3000
        )
        
        print("✅ 代码生成成功！\n")
        print(response.choices[0].message.content)
        
    except Exception as e:
        print(f"❌ 代码生成失败：{str(e)}")
        return False
    
    return True

def test_api_key_validity():
    """测试 API Key 是否有效"""
    print("=" * 60)
    print("API Key 有效性测试")
    print("=" * 60 + "\n")
    
    client = OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL
    )
    
    try:
        # 简单测试
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": "你好"}],
            max_tokens=10
        )
        print("✅ API Key 有效！")
        print(f"响应：{response.choices[0].message.content}\n")
        return True
    except Exception as e:
        print(f"❌ API Key 无效或已过期")
        print(f"错误信息：{str(e)}\n")
        return False

if __name__ == "__main__":
    import sys
    
    print("\n请选择测试模式：")
    print("1. 测试 API Key 有效性")
    print("2. 测试对话功能")
    print("3. 测试代码生成")
    print("4. 全部测试")
    print("0. 退出")
    print()
    
    choice = input("请输入选项 (0-4): ").strip()
    
    if choice == "0":
        sys.exit(0)
    elif choice == "1":
        test_api_key_validity()
    elif choice == "2":
        test_chat()
    elif choice == "3":
        test_code_generation()
    elif choice == "4":
        if test_api_key_validity():
            test_chat()
            test_code_generation()
    else:
        print("无效的选项！")
        sys.exit(1)
    
    print("\n测试完成！")
