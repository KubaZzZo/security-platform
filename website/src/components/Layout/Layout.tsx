import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <TopNav />
      <Sidebar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
