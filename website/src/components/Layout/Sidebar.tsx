import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

const icons: Record<string, React.ReactNode> = {
  overview: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
  event: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
  alert: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>,
  host: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>,
  network: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>,
  risk: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/></svg>,
  user: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  threat: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
  strategy: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  record: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  correlation: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8v-2z"/></svg>,
  behavior: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>,
  intel: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>,
  asset: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg>,
  baseline: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H5v-2h7v2zm5-4H5v-2h12v2zm0-4H5V7h12v2z"/></svg>,
  discover: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/></svg>,
  config: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58-1.92-3.32-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54h-3.84l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96-1.92 3.32 2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58 1.92 3.32 2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54h3.84l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96 1.92-3.32-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  report: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
  export: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>,
  subscribe: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  notice: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>,
  realtime: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>,
  attacker: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
  block: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/></svg>,
  exposure: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
  bulletin: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>,
};

const sidebarConfig: Record<string, MenuItem[]> = {
  '/monitor': [
    { label: '概览', path: '/monitor', icon: 'overview' },
    { label: '安全事件', path: '/monitor/events', icon: 'event' },
    { label: '告警管理', path: '/monitor/alerts', icon: 'alert' },
    { label: '主机安全', path: '/monitor/host', icon: 'host' },
    { label: '网络安全', path: '/monitor/network', icon: 'network' },
  ],
  '/disposal': [
    { label: '风险资产视角', path: '/disposal', icon: 'risk' },
    { label: '风险用户视角', path: '/disposal/users', icon: 'user' },
    { label: '威胁视角', path: '/disposal/threats', icon: 'threat' },
    { label: '响应策略管理', path: '/disposal/strategy', icon: 'strategy' },
    { label: '处置记录', path: '/disposal/records', icon: 'record' },
  ],
  '/analysis': [
    { label: '日志检索', path: '/analysis', icon: 'search' },
    { label: '关联分析', path: '/analysis/correlation', icon: 'correlation' },
    { label: '行为分析', path: '/analysis/behavior', icon: 'behavior' },
    { label: '威胁情报', path: '/analysis/threat-intel', icon: 'intel' },
  ],
  '/assets': [
    { label: '总览', path: '/assets', icon: 'overview' },
    { label: '资产管理', path: '/assets/manage', icon: 'asset' },
    { label: '基线异常', path: '/assets/baseline', icon: 'baseline' },
    { label: '资产发现', path: '/assets/discovery', icon: 'discover' },
    { label: '配置', path: '/assets/config', icon: 'config' },
  ],
  '/reports': [
    { label: '预设报告', path: '/reports', icon: 'report' },
    { label: '手动导出', path: '/reports/export', icon: 'export' },
    { label: '报告订阅', path: '/reports/subscribe', icon: 'subscribe' },
    { label: '设置', path: '/reports/settings', icon: 'config' },
  ],
  '/warning': [
    {
      label: '通报中心', path: '/warning', icon: 'notice', children: [
        { label: '通报总览', path: '/warning' },
        { label: '待通报事件', path: '/warning/pending' },
        { label: '通报中事件', path: '/warning/processing' },
        { label: '已归档事件', path: '/warning/archived' },
        { label: '无需通报事件', path: '/warning/ignored' },
      ]
    },
    { label: '预警中心', path: '/warning/alert-center', icon: 'alert' },
    { label: '公告栏', path: '/warning/bulletin', icon: 'bulletin' },
    { label: '设置', path: '/warning/settings', icon: 'config' },
  ],
  '/protection': [
    { label: '实时告警分析', path: '/protection/realtime', icon: 'realtime' },
    { label: '攻击者分析', path: '/protection', icon: 'attacker' },
    { label: '联动封锁', path: '/protection/block', icon: 'block' },
    { label: '重保威胁情报', path: '/protection/threat-intel', icon: 'intel' },
    { label: '暴露面分析', path: '/protection/exposure', icon: 'exposure' },
  ],
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ '/warning': true });

  const currentBase = '/' + location.pathname.split('/')[1];
  const menuItems = sidebarConfig[currentBase] || [];

  const toggleGroup = (path: string) => {
    setExpandedGroups(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderItem = (item: MenuItem) => {
    const isActive = location.pathname === item.path;

    if (item.children) {
      const isExpanded = expandedGroups[item.path] !== false;
      return (
        <div key={item.path}>
          <div className="sidebar-group-header" onClick={() => toggleGroup(item.path)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {item.icon && <span className="item-icon">{icons[item.icon]}</span>}
              <span>{item.label}</span>
            </div>
            <span className={`sidebar-group-arrow ${isExpanded ? 'expanded' : ''}`}>▸</span>
          </div>
          {isExpanded && (
            <div className="sidebar-submenu">
              {item.children.map(child => {
                const childActive = location.pathname === child.path;
                return (
                  <div
                    key={child.path}
                    className={`sidebar-menu-item ${childActive ? 'active' : ''}`}
                    onClick={() => navigate(child.path)}
                  >
                    <span className="item-label">{child.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={item.path}
        className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
        onClick={() => navigate(item.path)}
      >
        {item.icon && <span className="item-icon">{icons[item.icon]}</span>}
        <span className="item-label">{item.label}</span>
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section-title">导航菜单</div>
      {menuItems.map(renderItem)}
    </div>
  );
};

export default Sidebar;
