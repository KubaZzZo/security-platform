import React, { useState, useEffect } from 'react';
import { systemApi } from '../api';
import { useApi } from '../api/useApi';
import type { SystemSettingsData } from '../api/system';
import './SystemSettings.css';

const defaultSettings: SystemSettingsData = {
  siteName: '安全感知平台',
  sessionTimeout: 30,
  logRetention: 90,
  autoRefresh: true,
  refreshInterval: 60,
  emailNotify: true,
  smsNotify: false,
  loginVerify: true,
  ipWhitelist: false,
  maxLoginAttempts: 5,
};

const SystemSettings: React.FC = () => {
  const { data, loading } = useApi<SystemSettingsData>(() => systemApi.getSystemSettings());
  const [settings, setSettings] = useState<SystemSettingsData>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setSettings(data);
  }, [data]);

  const handleSave = async () => {
    await systemApi.saveSystemSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggle = (key: keyof SystemSettingsData) => {
    setSettings({ ...settings, [key]: !settings[key] } as SystemSettingsData);
  };

  if (loading) {
    return <div className="system-settings-page"><div style={{ padding: 40, textAlign: 'center', color: '#999' }}>加载中...</div></div>;
  }

  return (
    <div className="system-settings-page">
      <div className="page-header">
        <h2>系统设置</h2>
        <p>配置系统参数和安全策略</p>
      </div>

      {saved && <div className="settings-saved-tip">设置已保存</div>}

      <div className="settings-sections">
        <div className="settings-section">
          <h3>基本设置</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">平台名称</span>
              <span className="setting-desc">显示在导航栏的系统名称</span>
            </div>
            <input
              className="setting-input"
              value={settings.siteName}
              onChange={e => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">会话超时（分钟）</span>
              <span className="setting-desc">用户无操作后自动登出的时间</span>
            </div>
            <input
              className="setting-input setting-input-sm"
              type="number"
              value={settings.sessionTimeout}
              onChange={e => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })}
            />
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">日志保留天数</span>
              <span className="setting-desc">系统操作日志的保留周期</span>
            </div>
            <input
              className="setting-input setting-input-sm"
              type="number"
              value={settings.logRetention}
              onChange={e => setSettings({ ...settings, logRetention: Number(e.target.value) })}
            />
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">自动刷新</span>
              <span className="setting-desc">监控数据是否自动刷新</span>
            </div>
            <div className={`setting-switch ${settings.autoRefresh ? 'on' : ''}`} onClick={() => toggle('autoRefresh')}>
              <div className="switch-handle" />
            </div>
          </div>
          {settings.autoRefresh && (
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">刷新间隔（秒）</span>
                <span className="setting-desc">数据自动刷新的时间间隔</span>
              </div>
              <input
                className="setting-input setting-input-sm"
                type="number"
                value={settings.refreshInterval}
                onChange={e => setSettings({ ...settings, refreshInterval: Number(e.target.value) })}
              />
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3>通知设置</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">邮件通知</span>
              <span className="setting-desc">安全事件通过邮件推送</span>
            </div>
            <div className={`setting-switch ${settings.emailNotify ? 'on' : ''}`} onClick={() => toggle('emailNotify')}>
              <div className="switch-handle" />
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">短信通知</span>
              <span className="setting-desc">高危事件通过短信推送</span>
            </div>
            <div className={`setting-switch ${settings.smsNotify ? 'on' : ''}`} onClick={() => toggle('smsNotify')}>
              <div className="switch-handle" />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>安全设置</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">登录二次验证</span>
              <span className="setting-desc">登录时需要额外验证码</span>
            </div>
            <div className={`setting-switch ${settings.loginVerify ? 'on' : ''}`} onClick={() => toggle('loginVerify')}>
              <div className="switch-handle" />
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">IP白名单</span>
              <span className="setting-desc">仅允许白名单IP访问系统</span>
            </div>
            <div className={`setting-switch ${settings.ipWhitelist ? 'on' : ''}`} onClick={() => toggle('ipWhitelist')}>
              <div className="switch-handle" />
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">最大登录尝试次数</span>
              <span className="setting-desc">超过次数后锁定账户</span>
            </div>
            <input
              className="setting-input setting-input-sm"
              type="number"
              value={settings.maxLoginAttempts}
              onChange={e => setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn-save-settings" onClick={handleSave}>保存设置</button>
      </div>
    </div>
  );
};

export default SystemSettings;
