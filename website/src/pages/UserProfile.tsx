import React, { useState, useEffect } from 'react';
import { systemApi } from '../api';
import { useApi } from '../api/useApi';
import type { UserInfo } from '../api/system';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { data: userInfo, loading } = useApi<UserInfo>(() => systemApi.getUserInfo());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    department: '',
  });

  useEffect(() => {
    if (userInfo) {
      setForm({ email: userInfo.email, phone: userInfo.phone, department: userInfo.department });
    }
  }, [userInfo]);

  const handleSave = async () => {
    await systemApi.updateUserInfo(form);
    setEditing(false);
  };

  if (loading || !userInfo) {
    return <div className="user-profile-page"><div style={{ padding: 40, textAlign: 'center', color: '#999' }}>加载中...</div></div>;
  }

  return (
    <div className="user-profile-page">
      <div className="page-header">
        <h2>个人信息</h2>
        <p>查看和编辑您的账户信息</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">{userInfo.username.charAt(0).toUpperCase()}</div>
            <div className="profile-name">{userInfo.username}</div>
            <div className="profile-role-tag">{userInfo.role}</div>
          </div>
          <div className="profile-stats">
            <div className="profile-stat-item">
              <span className="stat-label">上次登录</span>
              <span className="stat-value">{userInfo.lastLogin}</span>
            </div>
            <div className="profile-stat-item">
              <span className="stat-label">登录IP</span>
              <span className="stat-value">{userInfo.loginIp}</span>
            </div>
          </div>
        </div>

        <div className="profile-form-card">
          <div className="form-card-header">
            <h3>基本信息</h3>
            {!editing ? (
              <button className="btn-edit" onClick={() => setEditing(true)}>编辑</button>
            ) : (
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => { setEditing(false); setForm({ email: userInfo.email, phone: userInfo.phone, department: userInfo.department }); }}>取消</button>
                <button className="btn-save" onClick={handleSave}>保存</button>
              </div>
            )}
          </div>
          <div className="form-body">
            <div className="form-row">
              <label>用户名</label>
              <input value={userInfo.username} disabled className="form-input" />
            </div>
            <div className="form-row">
              <label>角色</label>
              <input value={userInfo.role} disabled className="form-input" />
            </div>
            <div className="form-row">
              <label>邮箱</label>
              <input
                value={form.email}
                disabled={!editing}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label>联系电话</label>
              <input
                value={form.phone}
                disabled={!editing}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label>所属部门</label>
              <input
                value={form.department}
                disabled={!editing}
                onChange={e => setForm({ ...form, department: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
