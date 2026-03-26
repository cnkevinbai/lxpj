/**
 * Footer 组件 - 简化版
 */

import { Typography, Input, Button, Space, Divider } from 'antd'
import { WechatOutlined, WeiboOutlined, LinkedinOutlined, YoutubeOutlined, RightOutlined } from '@ant-design/icons'

const { Title, Paragraph, Link } = Typography

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* 订阅区域 */}
        <div className="footer-subscribe">
          <div className="footer-brand">
            <Title level={2} style={{ color: '#FFFFFF', marginBottom: 8 }}>
              道达智能
            </Title>
            <Paragraph style={{ color: '#A0A0A0', fontSize: 14 }}>
              DAODA INTELLIGENT
            </Paragraph>
          </div>
          
          <div className="subscribe-section">
            <Title level={5} style={{ color: '#FFFFFF', marginBottom: 8 }}>
              订阅我们
            </Title>
            <Paragraph style={{ color: '#A0A0A0', marginBottom: 16 }}>
              获取最新资讯和产品动态
            </Paragraph>
            <div className="subscribe-form">
              <Input
                placeholder="输入邮箱地址"
                style={{
                  width: 280,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                }}
              />
              <Button
                type="primary"
                icon={<RightOutlined />}
                style={{
                  marginLeft: 12,
                  background: '#0066FF',
                  border: 'none',
                }}
              >
                订阅
              </Button>
            </div>
          </div>
        </div>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '48px 0' }} />

        {/* 链接区域 */}
        <div className="footer-links">
          <div className="footer-column">
            <Title level={5} style={{ color: '#FFFFFF', marginBottom: 20 }}>
              产品中心
            </Title>
            <ul className="footer-list">
              <li><Link href="#" style={{ color: '#A0A0A0' }}>新能源观光车</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>电动巡逻车</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>高尔夫球车</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>无人驾驶观光车</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>景区共享漫游车</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <Title level={5} style={{ color: '#FFFFFF', marginBottom: 20 }}>
              解决方案
            </Title>
            <ul className="footer-list">
              <li><Link href="#" style={{ color: '#A0A0A0' }}>景区出行方案</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>园区通勤方案</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>智慧城市方案</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>高尔夫球场方案</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>定制解决方案</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <Title level={5} style={{ color: '#FFFFFF', marginBottom: 20 }}>
              服务支持
            </Title>
            <ul className="footer-list">
              <li><Link href="#" style={{ color: '#A0A0A0' }}>售后服务</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>配件供应</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>技术支持</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>下载中心</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>常见问题</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <Title level={5} style={{ color: '#FFFFFF', marginBottom: 20 }}>
              关于道达
            </Title>
            <ul className="footer-list">
              <li><Link href="#" style={{ color: '#A0A0A0' }}>公司简介</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>发展历程</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>荣誉资质</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>新闻中心</Link></li>
              <li><Link href="#" style={{ color: '#A0A0A0' }}>加入我们</Link></li>
            </ul>
          </div>
        </div>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '48px 0' }} />

        {/* 底部信息 */}
        <div className="footer-bottom">
          <div className="social-links">
            <Space size="large">
              <a href="#" className="social-icon"><WechatOutlined style={{ fontSize: 24, color: '#A0A0A0' }} /></a>
              <a href="#" className="social-icon"><WeiboOutlined style={{ fontSize: 24, color: '#A0A0A0' }} /></a>
              <a href="#" className="social-icon"><LinkedinOutlined style={{ fontSize: 24, color: '#A0A0A0' }} /></a>
              <a href="#" className="social-icon"><YoutubeOutlined style={{ fontSize: 24, color: '#A0A0A0' }} /></a>
            </Space>
          </div>

          <div className="copyright">
            <Paragraph style={{ color: '#606060', marginBottom: 8 }}>
              © 2026 四川道达智能车辆制造有限公司。All rights reserved.
            </Paragraph>
            <div className="footer-legal">
              <Link href="#" style={{ color: '#606060', marginRight: 16 }}>隐私政策</Link>
              <Link href="#" style={{ color: '#606060', marginRight: 16 }}>使用条款</Link>
              <Link href="#" style={{ color: '#606060', marginRight: 16 }}>网站地图</Link>
            </div>
          </div>

          <div className="language-switch">
            <Space size="middle">
              <a style={{ color: '#0066FF', cursor: 'pointer' }}>中文</a>
              <span style={{ color: '#606060' }}>|</span>
              <a style={{ color: '#606060', cursor: 'pointer' }}>English</a>
            </Space>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #050505;
          padding: 80px 24px 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-subscribe {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 48px;
        }

        .subscribe-form {
          display: flex;
          gap: 12px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 48px;
        }

        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-list li {
          margin-bottom: 12px;
        }

        .footer-list a:hover {
          color: #0066FF !important;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .social-icon:hover {
          color: #0066FF !important;
        }

        .footer-legal {
          display: flex;
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .footer-subscribe {
            flex-direction: column;
            gap: 32px;
          }

          .footer-links {
            grid-template-columns: 1fr;
          }

          .subscribe-form {
            flex-direction: column;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
