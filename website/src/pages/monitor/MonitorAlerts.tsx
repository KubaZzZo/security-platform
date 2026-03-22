import React, { useState } from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import './MonitorAlerts.css';

const alertsData = [
  { id: 'ALT-20260322-001', name: '异常登录行为检测', level: '高危', source: 'HIDS', time: '2026-03-22 14:30:12', asset: '10.0.1.15', status: '未处理' },
  { id: 'ALT-20260322-002', name: '端口扫描告警', level: '中危', source: 'NIDS', time: '2026-03-22 14:25:08', asset: '192.168.1.0/24', status: '处理中' },
  { id: 'ALT-20260322-003', name: '恶意文件下载', level: '高危', source: 'WAF', time: '2026-03-22 14:18:33', asset: '10.0.2.8', status: '未处理' },
  { id: 'ALT-20260322-004', name: 'DNS异常查询', level: '低危', source: 'DNS防火墙', time: '2026-03-22 14:10:45', asset: '172.16.3.50', status: '已关闭' },
  { id: 'ALT-20260322-005', name: '弱口令登录告警', level: '中危', source: 'HIDS', time: '2026-03-22 13:55:20', asset: '10.0.0.22', status: '已关闭' },
  { id: 'ALT-20260322-006', name: 'CC攻击检测', level: '高危', source: 'WAF', time: '2026-03-22 13:42:11', asset: '10.0.1.8', status: '处理中' },
  { id: 'ALT-20260322-007', name: '非法外联告警', level: '高危', source: 'FW', time: '2026-03-22 13:30:05', asset: '192.168.5.100', status: '未处理' },
  { id: 'ALT-20260322-008', name: 'ARP欺骗检测', level: '中危', source: 'NIDS', time: '2026-03-22 13:15:48', asset: '192.168.2.0/24', status: '已关闭' },
  { id: 'ALT-20260322-009', name: '数据库异常访问', level: '高危', source: '数据库审计', time: '2026-03-22 12:58:30', asset: '10.0.3.5', status: '已关闭' },
  { id: 'ALT-20260322-010', name: '文件篡改告警', level: '中危', source: 'HIDS', time: '2026-03-22 12:40:15', asset: '10.0.1.20', status: '已关闭' },
];

const stats = [
  { label: '未处理告警', value: 156, color: '#ff4d4f' },
  { label: '处理中', value: 43, color: '#faad14' },
  { label: '已关闭', value: 1364, color: '#52c41a' },
  { label: '今日新增', value: 28, color: '#1890ff' },
];

const tabs = ['全部', '未处理', '处理中', '已关闭'];

const MonitorAlerts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('全部');

  const filtered = activeTab === '全部' ? alertsData : alertsData.filter(a => a.status === activeTab);

  const columns: Column[] = [
    { key: 'id', title: '告警ID', width: 180 },
    { key: 'name', title: '告警名称' },
    { key: 'level', title: '告警级别', width: 80, render: (v: string) => (
      <span className={`severity-tag severity-${v === '高危' ? 'high' : v === '中危' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'source', title: '告警来源', width: 100 },
    { key: 'time', title: '触发时间', width: 160 },
    { key: 'asset', title: '关联资产', width: 140 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`status-tag status-${v === '已关闭' ? 'done' : v === '处理中' ? 'processing' : 'pending'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 70, render: () => (
      <button className="table-action-btn">处理</button>
    )},
  ];

  return (
    <div className="monitor-alerts-page">
      <div className="monitor-alerts-stats">
        {stats.map(s => (
          <div className="monitor-alerts-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value.toLocaleString()}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>告警管理</h3></div>
        <div className="monitor-section-body">
          <div className="alerts-tabs">
            {tabs.map(tab => (
              <div key={tab} className={`alerts-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
            ))}
          </div>
          <DataTable columns={columns} data={filtered} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default MonitorAlerts;
