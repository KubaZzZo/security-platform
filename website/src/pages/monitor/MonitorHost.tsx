import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './MonitorHost.css';

const hostData = [
  { ip: '10.0.1.15', hostname: 'web-server-01', os: 'CentOS 7.9', risk: '高危', vulns: 12, alerts: 5, online: true, lastScan: '2026-03-22 14:00:00' },
  { ip: '10.0.1.16', hostname: 'web-server-02', os: 'Ubuntu 22.04', risk: '低危', vulns: 2, alerts: 0, online: true, lastScan: '2026-03-22 14:00:00' },
  { ip: '10.0.2.8', hostname: 'db-master', os: 'CentOS 8.5', risk: '中危', vulns: 5, alerts: 3, online: true, lastScan: '2026-03-22 13:55:00' },
  { ip: '10.0.2.9', hostname: 'db-slave-01', os: 'CentOS 8.5', risk: '低危', vulns: 1, alerts: 0, online: true, lastScan: '2026-03-22 13:55:00' },
  { ip: '10.0.3.5', hostname: 'app-server-01', os: 'Windows Server 2022', risk: '高危', vulns: 8, alerts: 4, online: true, lastScan: '2026-03-22 13:50:00' },
  { ip: '10.0.3.6', hostname: 'app-server-02', os: 'Windows Server 2022', risk: '中危', vulns: 4, alerts: 1, online: false, lastScan: '2026-03-21 22:00:00' },
  { ip: '192.168.1.100', hostname: 'file-server', os: 'Windows Server 2019', risk: '低危', vulns: 1, alerts: 0, online: true, lastScan: '2026-03-22 14:00:00' },
  { ip: '192.168.1.105', hostname: 'mail-server', os: 'Ubuntu 20.04', risk: '中危', vulns: 3, alerts: 2, online: true, lastScan: '2026-03-22 13:58:00' },
  { ip: '192.168.2.50', hostname: 'dns-server', os: 'CentOS 7.9', risk: '低危', vulns: 0, alerts: 0, online: true, lastScan: '2026-03-22 14:00:00' },
  { ip: '172.16.5.10', hostname: 'monitor-node', os: 'Ubuntu 22.04', risk: '低危', vulns: 1, alerts: 0, online: false, lastScan: '2026-03-20 08:00:00' },
];

const stats = [
  { label: '主机总数', value: 1408, color: '#1890ff' },
  { label: '安全主机', value: 1280, color: '#52c41a' },
  { label: '风险主机', value: 96, color: '#ff4d4f' },
  { label: '离线主机', value: 32, color: '#999' },
];

const MonitorHost: React.FC = () => {
  const columns: Column[] = [
    { key: 'ip', title: 'IP地址', width: 130 },
    { key: 'hostname', title: '主机名' },
    { key: 'os', title: '操作系统', width: 160 },
    { key: 'risk', title: '风险等级', width: 80, render: (v: string) => (
      <span className={`severity-tag severity-${v === '高危' ? 'high' : v === '中危' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'vulns', title: '漏洞数', width: 70 },
    { key: 'alerts', title: '告警数', width: 70 },
    { key: 'online', title: '在线状态', width: 80, render: (v: boolean) => (
      <span className={`online-dot ${v ? 'online' : 'offline'}`}>{v ? '在线' : '离线'}</span>
    )},
    { key: 'lastScan', title: '最后检测时间', width: 160 },
    { key: 'op', title: '操作', width: 70, render: () => (
      <button className="table-action-btn">详情</button>
    )},
  ];

  const filters = [
    { type: 'select' as const, label: '操作系统', options: [
      { label: '全部', value: '' }, { label: 'CentOS', value: 'centos' }, { label: 'Ubuntu', value: 'ubuntu' }, { label: 'Windows', value: 'windows' },
    ]},
    { type: 'select' as const, label: '风险等级', options: [
      { label: '全部', value: '' }, { label: '高危', value: 'high' }, { label: '中危', value: 'medium' }, { label: '低危', value: 'low' },
    ]},
    { type: 'input' as const, placeholder: 'IP地址搜索' },
    { type: 'button' as const, label: '查询', buttonType: 'primary' as const },
  ];

  return (
    <div className="monitor-host-page">
      <div className="monitor-host-stats">
        {stats.map(s => (
          <div className="monitor-host-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value.toLocaleString()}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>主机安全</h3></div>
        <div className="monitor-section-body">
          <FilterBar filters={filters} />
          <DataTable columns={columns} data={hostData} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default MonitorHost;
