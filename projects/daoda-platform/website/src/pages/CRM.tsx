/**
 * CRM 客户管理 V2 - 中英双语版
 * 基于 Figma 设计实现
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CRM.css';

const CRM: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [searchQuery, setSearchQuery] = useState('');

  const t = {
    zh: {
      // 导航
      navDashboard: '仪表盘',
      navCustomers: '客户管理',
      navLeads: '潜在客户',
      navOrders: '订单管理',
      navReports: '数据报表',
      
      // 页面标题
      pageTitle: '客户管理',
      pageDesc: '管理企业客户关系与沟通历史记录。',
      btnNewCustomer: '新建客户',
      
      // 筛选
      searchPlaceholder: '按姓名、邮箱或公司名称搜索...',
      filterLevel: '级别:',
      filterLevelAll: '所有层级',
      filterStatus: '状态:',
      filterStatusActive: '活跃',
      filterSource: '来源:',
      filterSourceDirect: '直接访问',
      
      // 表头
      colName: '客户姓名',
      colContact: '联系方式与来源',
      colPhone: '电话',
      colLevel: '层级',
      colStatus: '状态',
      colLastFollow: '最后跟进',
      colActions: '操作',
      
      // 客户数据
      levelEnterprise: '企业级',
      levelStandard: '标准级',
      levelVIP: 'VIP 高级',
      statusActive: '活跃',
      statusPending: '待定',
      statusInactive: '非活跃',
      sourceDirect: '直接拓展',
      sourceLinkedIn: '领英广告',
      sourceReferral: '转介绍',
      
      // 分页
      paginationText: '显示第 1 至 4 名客户，共 24 名',
      
      // 统计
      statsTotal: '总客户数',
      statsActive: '活跃客户',
      statsNew: '本月新增',
      statsConversion: '转化率',
      
      // 页脚
      footerCopyright: '© 2024 道达智能科技有限公司',
    },
    en: {
      // Navigation
      navDashboard: 'Dashboard',
      navCustomers: 'Customers',
      navLeads: 'Leads',
      navOrders: 'Orders',
      navReports: 'Reports',
      
      // Page Title
      pageTitle: 'Customer Management',
      pageDesc: 'Manage enterprise customer relationships and communication history.',
      btnNewCustomer: 'New Customer',
      
      // Filters
      searchPlaceholder: 'Search by name, email or company...',
      filterLevel: 'Level:',
      filterLevelAll: 'All Levels',
      filterStatus: 'Status:',
      filterStatusActive: 'Active',
      filterSource: 'Source:',
      filterSourceDirect: 'Direct',
      
      // Table Headers
      colName: 'Customer Name',
      colContact: 'Contact & Source',
      colPhone: 'Phone',
      colLevel: 'Level',
      colStatus: 'Status',
      colLastFollow: 'Last Follow-up',
      colActions: 'Actions',
      
      // Customer Data
      levelEnterprise: 'Enterprise',
      levelStandard: 'Standard',
      levelVIP: 'VIP Premium',
      statusActive: 'Active',
      statusPending: 'Pending',
      statusInactive: 'Inactive',
      sourceDirect: 'Direct Outreach',
      sourceLinkedIn: 'LinkedIn Ads',
      sourceReferral: 'Referral',
      
      // Pagination
      paginationText: 'Showing 1-4 of 24 customers',
      
      // Stats
      statsTotal: 'Total Customers',
      statsActive: 'Active Customers',
      statsNew: 'New This Month',
      statsConversion: 'Conversion Rate',
      
      // Footer
      footerCopyright: '© 2024 DAODA Smart Technology',
    },
  };

  const currentText = t[language];

  const customers = [
    {
      initials: 'JD',
      name: 'Jane Doe',
      company: 'Acme Corporation',
      email: 'jane.doe@acme.com',
      source: currentText.sourceDirect,
      phone: '+1 (555) 012-3456',
      level: 'enterprise',
      status: 'active',
      lastFollow: '2023年10月24日',
    },
    {
      initials: 'MS',
      name: 'Marcus Smith',
      company: 'Stellar Tech',
      email: 'm.smith@stellar.io',
      source: currentText.sourceLinkedIn,
      phone: '+1 (555) 987-6543',
      level: 'standard',
      status: 'active',
      lastFollow: '2023年10月22日',
    },
    {
      initials: 'AL',
      name: 'Alice Lawson',
      company: 'Lawson & Partners',
      email: 'alice@lawson.law',
      source: currentText.sourceReferral,
      phone: '+1 (555) 246-8101',
      level: 'vip',
      status: 'pending',
      lastFollow: '2023年10月18日',
    },
    {
      initials: 'BK',
      name: 'Bob Knight',
      company: '自由顾问',
      email: 'bob.k@email.com',
      source: currentText.filterSourceDirect,
      phone: '+44 20 7946 0958',
      level: 'standard',
      status: 'inactive',
      lastFollow: '2023年9月30日',
    },
  ];

  const getLevelBadge = (level: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      enterprise: { text: currentText.levelEnterprise, className: 'badge-enterprise' },
      standard: { text: currentText.levelStandard, className: 'badge-standard' },
      vip: { text: currentText.levelVIP, className: 'badge-vip' },
    };
    return badges[level] || badges.standard;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      active: { text: currentText.statusActive, className: 'status-active' },
      pending: { text: currentText.statusPending, className: 'status-pending' },
      inactive: { text: currentText.statusInactive, className: 'status-inactive' },
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="crm-page">
      {/* Sidebar */}
      <aside className="crm-sidebar">
        <div className="sidebar-header">
          <div className="brand-icon"></div>
          <span className="brand-name">道达智能</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/portal/dashboard" className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            <span>{currentText.navDashboard}</span>
          </Link>
          <Link to="/portal/crm" className="nav-item active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <span>{currentText.navCustomers}</span>
          </Link>
          <Link to="/portal/leads" className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <span>{currentText.navLeads}</span>
          </Link>
          <Link to="/portal/orders" className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
            </svg>
            <span>{currentText.navOrders}</span>
          </Link>
          <Link to="/portal/reports" className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span>{currentText.navReports}</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">
            <span>张</span>
          </div>
          <div className="user-info">
            <span className="user-name">张经理</span>
            <span className="user-role">客户经理</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="crm-main">
        {/* Top Header */}
        <header className="crm-header">
          <div className="header-left">
            <div className="breadcrumb">
              <Link to="/portal">{currentText.navDashboard}</Link>
              <span className="separator">/</span>
              <span className="current">{currentText.navCustomers}</span>
            </div>
            <div className="page-info">
              <h1 className="page-title">{currentText.pageTitle}</h1>
              <p className="page-desc">{currentText.pageDesc}</p>
            </div>
          </div>
          <div className="header-right">
            <button className="btn-primary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              {currentText.btnNewCustomer}
            </button>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder={currentText.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>{currentText.filterLevel}</label>
            <select defaultValue="all">
              <option value="all">{currentText.filterLevelAll}</option>
              <option value="enterprise">{currentText.levelEnterprise}</option>
              <option value="vip">{currentText.levelVIP}</option>
              <option value="standard">{currentText.levelStandard}</option>
            </select>
            <svg className="select-arrow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
          <div className="filter-group">
            <label>{currentText.filterStatus}</label>
            <select defaultValue="active">
              <option value="active">{currentText.statusActive}</option>
              <option value="pending">{currentText.statusPending}</option>
              <option value="inactive">{currentText.statusInactive}</option>
            </select>
            <svg className="select-arrow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
          <div className="filter-group">
            <label>{currentText.filterSource}</label>
            <select defaultValue="direct">
              <option value="direct">{currentText.filterSourceDirect}</option>
              <option value="linkedin">{currentText.sourceLinkedIn}</option>
              <option value="referral">{currentText.sourceReferral}</option>
            </select>
            <svg className="select-arrow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
          <div className="language-switcher">
            <button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中文</button>
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>{currentText.colName}</th>
                <th>{currentText.colContact}</th>
                <th>{currentText.colPhone}</th>
                <th>{currentText.colLevel}</th>
                <th>{currentText.colStatus}</th>
                <th>{currentText.colLastFollow}</th>
                <th>{currentText.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index}>
                  <td className="name-cell">
                    <div className="customer-avatar">{customer.initials}</div>
                    <div className="customer-info">
                      <span className="customer-name">{customer.name}</span>
                      <span className="customer-company">{customer.company}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="email">{customer.email}</span>
                      <span className="source">{customer.source}</span>
                    </div>
                  </td>
                  <td>{customer.phone}</td>
                  <td>
                    <span className={`level-badge ${getLevelBadge(customer.level).className}`}>
                      {getLevelBadge(customer.level).text}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(customer.status).className}`}>
                      {getStatusBadge(customer.status).text}
                    </span>
                  </td>
                  <td>{customer.lastFollow}</td>
                  <td className="actions-cell">
                    <button className="action-btn view">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </button>
                    <button className="action-btn edit">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="table-footer">
            <span className="pagination-info">{currentText.paginationText}</span>
            <div className="pagination">
              <button className="page-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span className="page-ellipsis">...</span>
              <button className="page-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">1,234</span>
              <span className="stat-label">{currentText.statsTotal}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">892</span>
              <span className="stat-label">{currentText.statsActive}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">56</span>
              <span className="stat-label">{currentText.statsNew}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="crm-footer">
          <span>{currentText.footerCopyright}</span>
        </footer>
      </main>
    </div>
  );
};

export default CRM;