/**
 * ERP 库存管理 V2 - 中英双语版
 * 基于 Figma 设计实现
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ERP.css';

const ERP: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const t = {
    zh: {
      // 导航
      navDashboard: '控制面板',
      navWarehouses: '仓库管理',
      navShipments: '物流发货',
      navReports: '数据报表',
      navSettings: '系统设置',
      
      // 页面
      pageTitle: '库存概览',
      pageDesc: '实时供应链健康状况与库存分布。',
      
      // 筛选
      filterWarehouse: '仓库',
      filterAllWarehouses: '全部仓库',
      filterCategory: '类别',
      filterAllCategories: '全部类别',
      filterStatus: '状态',
      filterAnyStatus: '所有状态',
      
      // 统计卡片
      statsSKUs: 'SKU 总数',
      statsWarehouses: '活跃仓库',
      statsOrders: '待处理订单',
      statsAlerts: '低库存警报',
      
      // 图表
      chartTurnover: '库存周转趋势',
      chartInbound: '入库',
      chartOutbound: '出库',
      chartCapacity: '库存容量',
      chartAvailableSpace: '可用空间',
      chartOccupied: '已占用',
      
      // 表格
      tableCriticalAlerts: '关键库存警报',
      tableViewAll: '查看所有报表',
      colItem: '物品名称',
      colSKU: '货号',
      colWarehouse: '仓库',
      colStock: '当前库存',
      colMinLevel: '最低水位',
      colStatus: '状态',
      colAction: '操作',
      
      // 状态
      statusCritical: '紧急',
      statusWarning: '警告',
      
      // 按钮
      btnReorder: '补货',
      
      // 用户
      userName: 'Alex Rivera',
      userRole: '库存主管',
      
      // 页脚
      footerCopyright: '© 2024 StockMaster Pro',
    },
    en: {
      // Navigation
      navDashboard: 'Dashboard',
      navWarehouses: 'Warehouses',
      navShipments: 'Shipments',
      navReports: 'Reports',
      navSettings: 'Settings',
      
      // Page
      pageTitle: 'Inventory Overview',
      pageDesc: 'Real-time supply chain health and stock distribution.',
      
      // Filters
      filterWarehouse: 'Warehouse',
      filterAllWarehouses: 'All Warehouses',
      filterCategory: 'Category',
      filterAllCategories: 'All Categories',
      filterStatus: 'Status',
      filterAnyStatus: 'Any Status',
      
      // Stats Cards
      statsSKUs: 'Total SKUs',
      statsWarehouses: 'Active Warehouses',
      statsOrders: 'Pending Orders',
      statsAlerts: 'Low Stock Alerts',
      
      // Charts
      chartTurnover: 'Stock Turnover Trend',
      chartInbound: 'Inbound',
      chartOutbound: 'Outbound',
      chartCapacity: 'Stock Capacity',
      chartAvailableSpace: 'Available Space',
      chartOccupied: 'Occupied',
      
      // Table
      tableCriticalAlerts: 'Critical Stock Alerts',
      tableViewAll: 'View all reports',
      colItem: 'Item Name',
      colSKU: 'SKU',
      colWarehouse: 'Warehouse',
      colStock: 'Current Stock',
      colMinLevel: 'Min Level',
      colStatus: 'Status',
      colAction: 'Action',
      
      // Status
      statusCritical: 'Critical',
      statusWarning: 'Warning',
      
      // Button
      btnReorder: 'Reorder',
      
      // User
      userName: 'Alex Rivera',
      userRole: 'Inventory Lead',
      
      // Footer
      footerCopyright: '© 2024 StockMaster Pro',
    },
  };

  const currentText = t[language];

  const alerts = [
    { item: 'Electric Motor A1', sku: 'EM-001', warehouse: 'Shenzhen DC', stock: 23, minLevel: 50, status: 'critical' },
    { item: 'Battery Pack 48V', sku: 'BP-048', warehouse: 'Shanghai Hub', stock: 45, minLevel: 60, status: 'warning' },
    { item: 'Control Unit V2', sku: 'CU-V2', warehouse: 'Shenzhen DC', stock: 12, minLevel: 40, status: 'critical' },
    { item: 'LED Display Panel', sku: 'LED-P1', warehouse: 'Beijing Store', stock: 28, minLevel: 35, status: 'warning' },
  ];

  const getStatusBadge = (status: string) => {
    return status === 'critical' 
      ? { text: currentText.statusCritical, className: 'status-critical' }
      : { text: currentText.statusWarning, className: 'status-warning' };
  };

  // 图表数据模拟
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const inboundData = [85, 72, 90, 78, 95, 65, 88];
  const outboundData = [70, 65, 80, 85, 72, 55, 75];

  return (
    <div className="erp-page">
      {/* Sidebar */}
      <aside className="erp-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.3 1.41.89 1.89L10 14v6l4 2v-8l7.11-5.1c.59-.48.89-1.17.89-1.89V4c0-1.1-1-2-2-2z"/>
            </svg>
          </div>
          <span className="brand-name">StockMaster</span>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/erp/dashboard" className="nav-item active">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            <span>{currentText.navDashboard}</span>
          </Link>
          <Link to="/erp/warehouses" className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H5c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"/>
            </svg>
            <span>{currentText.navWarehouses}</span>
          </Link>
          <Link to="/erp/shipments" className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            <span>{currentText.navShipments}</span>
          </Link>
          <Link to="/erp/reports" className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span>{currentText.navReports}</span>
          </Link>
          <Link to="/erp/settings" className="nav-item">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            <span>{currentText.navSettings}</span>
          </Link>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-avatar">AR</div>
          <div className="user-info">
            <span className="user-name">{currentText.userName}</span>
            <span className="user-role">{currentText.userRole}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="erp-main">
        {/* Header */}
        <header className="erp-header">
          <div className="header-left">
            <h1 className="page-title">{currentText.pageTitle}</h1>
            <p className="page-desc">{currentText.pageDesc}</p>
          </div>
          <div className="header-right">
            <div className="language-switcher">
              <button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中文</button>
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-group">
            <label>{currentText.filterWarehouse}</label>
            <select>
              <option>{currentText.filterAllWarehouses}</option>
              <option>Shenzhen DC</option>
              <option>Shanghai Hub</option>
            </select>
          </div>
          <div className="filter-group">
            <label>{currentText.filterCategory}</label>
            <select>
              <option>{currentText.filterAllCategories}</option>
              <option>Motors</option>
              <option>Batteries</option>
            </select>
          </div>
          <div className="filter-group">
            <label>{currentText.filterStatus}</label>
            <select>
              <option>{currentText.filterAnyStatus}</option>
              <option>In Stock</option>
              <option>Low Stock</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon blue">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.3 1.41.89 1.89L10 14v6l4 2v-8l7.11-5.1c.59-.48.89-1.17.89-1.89V4c0-1.1-1-2-2-2z"/>
                </svg>
              </div>
              <span className="stat-change positive">+2.4%</span>
            </div>
            <div className="stat-value">12,450</div>
            <div className="stat-label">{currentText.statsSKUs}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <span className="stat-change negative">-1.2%</span>
            </div>
            <div className="stat-value">18</div>
            <div className="stat-label">{currentText.statsWarehouses}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <span className="stat-change positive">+15.0%</span>
            </div>
            <div className="stat-value">342</div>
            <div className="stat-label">{currentText.statsOrders}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon red">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              </div>
              <span className="stat-change alerts">+5 Alerts</span>
            </div>
            <div className="stat-value">15</div>
            <div className="stat-label">{currentText.statsAlerts}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Turnover Chart */}
          <div className="chart-card turnover-chart">
            <div className="chart-header">
              <h3 className="chart-title">{currentText.chartTurnover}</h3>
              <div className="chart-legend">
                <span className="legend-item inbound">
                  <span className="legend-dot"></span>
                  {currentText.chartInbound}
                </span>
                <span className="legend-item outbound">
                  <span className="legend-dot"></span>
                  {currentText.chartOutbound}
                </span>
              </div>
            </div>
            <div className="chart-body">
              <div className="bar-chart">
                {weekDays.map((day, i) => (
                  <div key={day} className="bar-group">
                    <div className="bars">
                      <div className="bar inbound" style={{ height: `${inboundData[i]}%` }}></div>
                      <div className="bar outbound" style={{ height: `${outboundData[i]}%` }}></div>
                    </div>
                    <span className="bar-label">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Capacity Gauge */}
          <div className="chart-card capacity-chart">
            <h3 className="chart-title">{currentText.chartCapacity}</h3>
            <div className="gauge-container">
              <div className="gauge">
                <svg viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" className="gauge-bg"/>
                  <circle cx="100" cy="100" r="80" className="gauge-fill" strokeDasharray={`${75 * 5.03} 251.5`}/>
                </svg>
                <div className="gauge-center">
                  <span className="gauge-value">75%</span>
                  <span className="gauge-label">{currentText.chartOccupied}</span>
                </div>
              </div>
              <div className="capacity-info">
                <div className="info-item">
                  <span className="info-value">2,150 m³</span>
                  <span className="info-label">{currentText.chartAvailableSpace}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="alerts-section">
          <div className="section-header">
            <h3 className="section-title">{currentText.tableCriticalAlerts}</h3>
            <a href="#" className="view-all-link">{currentText.tableViewAll}</a>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>{currentText.colItem}</th>
                <th>{currentText.colSKU}</th>
                <th>{currentText.colWarehouse}</th>
                <th>{currentText.colStock}</th>
                <th>{currentText.colMinLevel}</th>
                <th>{currentText.colStatus}</th>
                <th>{currentText.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, i) => (
                <tr key={i}>
                  <td className="item-name">{alert.item}</td>
                  <td className="sku">{alert.sku}</td>
                  <td>{alert.warehouse}</td>
                  <td className="stock-value">{alert.stock}</td>
                  <td>{alert.minLevel}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(alert.status).className}`}>
                      {getStatusBadge(alert.status).text}
                    </span>
                  </td>
                  <td>
                    <button className="reorder-btn">{currentText.btnReorder}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="erp-footer">
          <span>{currentText.footerCopyright}</span>
        </footer>
      </main>
    </div>
  );
};

export default ERP;