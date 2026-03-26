/**
 * 登录页面 - 数字化门户登录 V2
 * 统一风格版本
 */
import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = {
    zh: {
      brand: '道达智慧科技',
      subtitle: '数字化管理平台',
      username: '用户名',
      usernamePlaceholder: '请输入用户名',
      password: '密码',
      forgotPassword: '忘记密码？',
      captcha: '验证码',
      login: '安全登录',
      enterprise: '企业级访问',
      sso: '单点登录',
      qrLogin: '扫码登录',
      privacy: '隐私政策',
      terms: '服务条款',
      help: '帮助中心',
      copyright: '© 2024 道达智慧科技有限公司。保留所有权利。',
    },
    en: {
      brand: 'DAODA Smart Tech',
      subtitle: 'Digital Management Platform',
      username: 'Username',
      usernamePlaceholder: 'Enter username',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      captcha: 'Captcha',
      login: 'Secure Login',
      enterprise: 'Enterprise Access',
      sso: 'SSO',
      qrLogin: 'QR Login',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      help: 'Help Center',
      copyright: '© 2024 Daoda Smart Technology Co., Ltd. All rights reserved.',
    },
  };

  const currentText = t[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { username, password, captcha });
  };

  return (
    <div className="daoda-page login-page">
      {/* 背景装饰 */}
      <div className="login-bg-elements">
        <div className="login-bg-circle login-bg-circle-1"></div>
        <div className="login-bg-circle login-bg-circle-2"></div>
      </div>

      {/* 语言切换器 */}
      <div className="login-lang-switch">
        <button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中文</button>
        <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
      </div>

      {/* 登录卡片 */}
      <div className="login-card daoda-glass-panel">
        {/* 品牌 */}
        <div className="login-header">
          <div className="login-logo">
            <div className="daoda-brand-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </div>
          </div>
          <h1 className="login-brand">{currentText.brand}</h1>
          <p className="login-subtitle">{currentText.subtitle}</p>
        </div>

        {/* 表单 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>{currentText.username}</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                className="login-input"
                placeholder={currentText.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="login-field">
            <div className="login-field-header">
              <label>{currentText.password}</label>
              <a href="#" className="login-forgot">{currentText.forgotPassword}</a>
            </div>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="login-field">
            <label>{currentText.captcha}</label>
            <div className="login-captcha-row">
              <div className="login-input-wrap login-captcha-input">
                <span className="login-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4 17 10 11 4 5"/>
                    <line x1="12" y1="19" x2="20" y2="19"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="login-input"
                  placeholder={currentText.captcha}
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                />
              </div>
              <div className="login-captcha-box">
                <span className="login-captcha-text">8G2K</span>
              </div>
            </div>
          </div>

          <button type="submit" className="daoda-btn-primary login-submit">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1v14M1 8l7 7 7-7"/>
            </svg>
            {currentText.login}
          </button>

          <div className="login-enterprise">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0l8 4.5v7L8 16l-8-4.5v-7L8 0z"/>
            </svg>
            {currentText.enterprise}
          </div>

          <div className="login-alt-methods">
            <button type="button" className="login-alt-btn">
              <svg viewBox="0 0 18 18" fill="currentColor">
                <circle cx="9" cy="9" r="7"/>
              </svg>
              {currentText.sso}
            </button>
            <button type="button" className="login-alt-btn">
              <svg viewBox="0 0 14 14" fill="currentColor">
                <rect x="0" y="0" width="6" height="6"/>
                <rect x="8" y="0" width="6" height="6"/>
                <rect x="0" y="8" width="6" height="6"/>
                <rect x="8" y="8" width="6" height="6"/>
              </svg>
              {currentText.qrLogin}
            </button>
          </div>
        </form>
      </div>

      {/* 页脚 */}
      <footer className="login-footer">
        <div className="login-footer-links">
          <a href="#">{currentText.privacy}</a>
          <a href="#">{currentText.terms}</a>
          <a href="#">{currentText.help}</a>
        </div>
        <p className="login-copyright">{currentText.copyright}</p>
      </footer>
    </div>
  );
};

export default Login;