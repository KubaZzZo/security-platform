import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Monitor from './pages/Monitor';
import Disposal from './pages/Disposal';
import Analysis from './pages/Analysis';
import Assets from './pages/Assets';
import Reports from './pages/Reports';
import Warning from './pages/Warning';
import Protection from './pages/Protection';
import GlobalView from './pages/GlobalView';
import Help from './pages/Help';
import Messages from './pages/Messages';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';
import SystemSettings from './pages/SystemSettings';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/monitor" replace />} />
        <Route path="monitor/*" element={<Monitor />} />
        <Route path="disposal/*" element={<Disposal />} />
        <Route path="analysis/*" element={<Analysis />} />
        <Route path="assets/*" element={<Assets />} />
        <Route path="reports/*" element={<Reports />} />
        <Route path="warning/*" element={<Warning />} />
        <Route path="protection/*" element={<Protection />} />
        <Route path="global" element={<GlobalView />} />
        <Route path="help" element={<Help />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="system-settings" element={<SystemSettings />} />
        <Route path="*" element={<Navigate to="/monitor" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
