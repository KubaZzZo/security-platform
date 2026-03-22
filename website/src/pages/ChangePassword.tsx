import React, { useState } from 'react';
import { systemApi } from '../api';
import './ChangePassword.css';

const ChangePassword: React.FC = () => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setMessage({ type: 'error', text: '请填写所有字段' });
      return;
    }
    if (form.newPassword.length < 8) {
      setMessage({ type: 'error', text: '新密码长度不能少于8位' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的新密码不一致' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await systemApi.changePassword(form.oldPassword, form.newPassword);
      if (res.success) {
        setMessage({ type: 'success', text: '密码修改成功' });
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch {
      setMessage({ type: 'error', text: '密码修改失败，请检查当前密码是否正确' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="page-header">
        <h2>修改密码</h2>
        <p>定期修改密码有助于保障账户安全</p>
      </div>

      <div className="password-card">
        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`pwd-message ${message.type}`}>{message.text}</div>
          )}
          <div className="pwd-form-row">
            <label>当前密码</label>
            <input
              type="password"
              value={form.oldPassword}
              onChange={e => setForm({ ...form, oldPassword: e.target.value })}
              placeholder="请输入当前密码"
              className="pwd-input"
            />
          </div>
          <div className="pwd-form-row">
            <label>新密码</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              placeholder="请输入新密码（至少8位）"
              className="pwd-input"
            />
          </div>
          <div className="pwd-form-row">
            <label>确认新密码</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="请再次输入新密码"
              className="pwd-input"
            />
          </div>
          <div className="pwd-form-row">
            <label />
            <button type="submit" className="pwd-submit" disabled={submitting}>
              {submitting ? '提交中...' : '确认修改'}
            </button>
          </div>
        </form>

        <div className="pwd-tips">
          <h4>密码要求</h4>
          <ul>
            <li>长度不少于8个字符</li>
            <li>建议包含大小写字母、数字和特殊字符</li>
            <li>不要使用与旧密码相同的密码</li>
            <li>避免使用连续数字或常见词汇</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
