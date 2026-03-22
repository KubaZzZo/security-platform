import React, { useState } from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import './AssetsConfig.css';

const rulesData = [
  { name: '密码复杂度检测', type: '账户安全', severity: '高', os: 'Windows/Linux', enabled: true },
  { name: '端口开放检测', type: '网络安全', severity: '中', os: '全部', enabled: true },
  { name: 'SSH配置检测', type: '服务配置', severity: '高', os: 'Linux', enabled: true },
  { name: '补丁更新检测', type: '系统安全', severity: '中', os: 'Windows', enabled: false },
  { name: '防火墙状态检测', type: '网络安全', severity: '高', os: '全部', enabled: true },
  { name: '日志审计策略检测', type: '合规审计', severity: '低', os: '全部', enabled: false },
];

const AssetsConfig: React.FC = () => {
  const [rules, setRules] = useState(rulesData);
  const [notifications, setNotifications] = useState({ email: true, sms: false, wechat: true });

  const toggleRule = (idx: number) => {
    setRules(prev => prev.map((r, i) => i === idx ? { ...r, enabled: !r.enabled } : r));
  };

  const columns: Column[] = [
    { key: 'name', title: '规则名称' },
    { key: 'type', title: '检测类型', width: 100 },
    { key: 'severity', title: '严重程度', width: 80, render: (v: string) => (
      <span style={{ color: v === '高' ? 'var(--danger)' : v === '中' ? 'var(--warning)' : 'var(--primary)' }}>{v}</span>
    )},
    { key: 'os', title: '适用系统', width: 120 },
    { key: 'enabled', title: '状态', width: 80, render: (v: boolean, _: any, idx: number) => (
      <span className="config-toggle" onClick={() => toggleRule(idx)}>
        <span className={`config-toggle-track ${v ? 'active' : ''}`} />
      </span>
    )},
    { key: 'op', title: '操作', width: 60, render: () => (
      <button className="op-btn">编辑</button>
    )},
  ];

  return (
    <div className="assets-config-page">
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>扫描配置</h3></div>
        <div className="monitor-section-body">
          <div className="config-form">
            <div className="config-form-item">
              <label>扫描周期</label>
              <select defaultValue="daily">
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>
            <div className="config-form-item">
              <label>扫描时间</label>
              <input type="time" defaultValue="02:00" />
            </div>
            <div className="config-form-item">
              <label>扫描范围</label>
              <textarea defaultValue={"10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16"} />
            </div>
            <div className="config-form-item">
              <label>并发数</label>
              <input type="number" defaultValue={50} min={1} max={200} />
            </div>
          </div>
        </div>
      </div>

      <div className="monitor-section">
        <div className="monitor-section-header"><h3>基线规则配置</h3></div>
        <div className="monitor-section-body">
          <DataTable columns={columns} data={rules} showPagination={false} />
        </div>
      </div>

      <div className="monitor-section">
        <div className="monitor-section-header"><h3>告警通知配置</h3></div>
        <div className="monitor-section-body">
          <div className="config-form">
            <div className="config-form-item">
              <label>通知渠道</label>
              <div className="config-checkbox-group">
                <label><input type="checkbox" checked={notifications.email} onChange={() => setNotifications(p => ({ ...p, email: !p.email }))} /> 邮件</label>
                <label><input type="checkbox" checked={notifications.sms} onChange={() => setNotifications(p => ({ ...p, sms: !p.sms }))} /> 短信</label>
                <label><input type="checkbox" checked={notifications.wechat} onChange={() => setNotifications(p => ({ ...p, wechat: !p.wechat }))} /> 企业微信</label>
              </div>
            </div>
            <div className="config-form-item">
              <label>告警阈值</label>
              <div className="config-threshold">
                <input type="number" defaultValue={10} min={1} />
                <span>条/小时 触发告警</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsConfig;
