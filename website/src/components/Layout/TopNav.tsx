import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TopNav.css';

const menuItems = [
  { label: '监控中心', path: '/monitor', icon: '⊙' },
  { label: '处置中心', path: '/disposal', icon: '⚡' },
  { label: '分析中心', path: '/analysis', icon: '◎' },
  { label: '资产中心', path: '/assets', icon: '▣' },
  { label: '报告中心', path: '/reports', icon: '▤' },
  { label: '通报预警', path: '/warning', icon: '△' },
  { label: '重保中心', path: '/protection', icon: '◈' },
  { label: '云端订阅中心', path: '/cloud', icon: '☁' },
];

const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="topnav">
      <div className="topnav-logo" onClick={() => navigate('/monitor')}>
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="rgba(255,255,255,0.9)"/>
            <path d="M12 6l-5 3v6l5 3 5-3V9l-5-3z" fill="#1890ff"/>
          </svg>
        </div>
        <span className="logo-text">安全感知平台</span>
        <span className="logo-version">V3.0.92</span>
      </div>
      <div className="topnav-menu">
        {menuItems.map(item => (
          <div
            key={item.path}
            className={`topnav-menu-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="topnav-right">
        <div className="topnav-right-item" onClick={() => navigate('/global')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          全局视角
        </div>
        <div className="topnav-right-item" onClick={() => navigate('/help')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
          帮助
        </div>
        <div className="topnav-right-item topnav-msg" onClick={() => navigate('/messages')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          消息
          <span className="topnav-badge">3</span>
        </div>
        <div className="topnav-divider" />
        <div className="topnav-user-wrapper" ref={userMenuRef}>
          <div className="topnav-right-item topnav-user" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <div className="topnav-avatar">A</div>
            admin
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="dropdown-avatar">A</div>
                <div>
                  <div className="dropdown-username">admin</div>
                  <div className="dropdown-role">系统管理员</div>
                </div>
              </div>
              <div className="user-dropdown-divider" />
              <div className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                个人信息
              </div>
              <div className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); navigate('/change-password'); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                修改密码
              </div>
              <div className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); navigate('/system-settings'); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58-1.92-3.32-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54h-3.84l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96-1.92 3.32 2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58 1.92 3.32 2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54h3.84l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96 1.92-3.32-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                系统设置
              </div>
              <div className="user-dropdown-divider" />
              <div className="user-dropdown-item user-dropdown-logout" onClick={() => { setUserMenuOpen(false); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                退出登录
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
