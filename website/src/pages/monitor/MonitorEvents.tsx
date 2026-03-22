import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './MonitorEvents.css';

const eventsData = [
  { time: '2026-03-22 14:32:18', name: 'Trojan.GenericKD.46542', type: '恶意软件', severity: '高危', srcIp: '192.168.1.105', dstIp: '10.0.0.12', status: '已处置' },
  { time: '2026-03-22 14:28:05', name: 'SQL注入攻击检测', type: 'Web攻击', severity: '高危', srcIp: '172.16.5.33', dstIp: '10.0.1.8', status: '待处置' },
  { time: '2026-03-22 14:15:42', name: 'SSH暴力破解尝试', type: '暴力破解', severity: '中危', srcIp: '192.168.3.201', dstIp: '10.0.0.5', status: '处理中' },
  { time: '2026-03-22 13:58:31', name: 'CVE-2025-21388漏洞利用', type: '漏洞利用', severity: '高危', srcIp: '172.16.8.15', dstIp: '10.0.2.3', status: '已处置' },
  { time: '2026-03-22 13:45:20', name: 'DNS隧道通信检测', type: '异常流量', severity: '中危', srcIp: '192.168.2.88', dstIp: '10.0.0.1', status: '已处置' },
  { time: '2026-03-22 13:30:11', name: 'XSS跨站脚本攻击', type: 'Web攻击', severity: '中危', srcIp: '172.16.3.42', dstIp: '10.0.1.15', status: '已处置' },
  { time: '2026-03-22 13:12:55', name: 'Webshell上传检测', type: 'Web攻击', severity: '高危', srcIp: '192.168.5.67', dstIp: '10.0.1.8', status: '处理中' },
  { time: '2026-03-22 12:58:03', name: 'RDP暴力破解', type: '暴力破解', severity: '中危', srcIp: '172.16.9.100', dstIp: '10.0.3.22', status: '已处置' },
  { time: '2026-03-22 12:40:18', name: '异常大流量传输', type: '异常流量', severity: '低危', srcIp: '192.168.1.200', dstIp: '10.0.0.50', status: '已处置' },
  { time: '2026-03-22 12:25:44', name: 'Ransomware.WannaCry变种', type: '恶意软件', severity: '高危', srcIp: '172.16.2.18', dstIp: '10.0.2.9', status: '已处置' },
  { time: '2026-03-22 12:10:30', name: 'ICMP Flood攻击', type: '异常流量', severity: '中危', srcIp: '192.168.4.55', dstIp: '10.0.0.1', status: '已处置' },
  { time: '2026-03-22 11:55:12', name: 'Apache Log4j漏洞利用', type: '漏洞利用', severity: '高危', srcIp: '172.16.7.88', dstIp: '10.0.1.20', status: '待处置' },
];

const stats = [
  { label: '今日事件总数', value: 486, color: '#1890ff' },
  { label: '高危事件', value: 23, color: '#ff4d4f' },
  { label: '中危事件', value: 89, color: '#faad14' },
  { label: '已处置', value: 412, color: '#52c41a' },
];

const MonitorEvents: React.FC = () => {
  const columns: Column[] = [
    { key: 'time', title: '时间', width: 160 },
    { key: 'name', title: '事件名称' },
    { key: 'type', title: '事件类型', width: 100 },
    { key: 'severity', title: '威胁等级', width: 80, render: (v: string) => (
      <span className={`severity-tag severity-${v === '高危' ? 'high' : v === '中危' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'srcIp', title: '源IP', width: 140 },
    { key: 'dstIp', title: '目的IP', width: 120 },
    { key: 'status', title: '处置状态', width: 80, render: (v: string) => (
      <span className={`status-tag status-${v === '已处置' ? 'done' : v === '处理中' ? 'processing' : 'pending'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 70, render: () => (
      <button className="table-action-btn">详情</button>
    )},
  ];

  const filters = [
    { type: 'date' as const, label: '时间范围' },
    { type: 'select' as const, label: '威胁等级', options: [
      { label: '全部', value: '' }, { label: '高危', value: 'high' }, { label: '中危', value: 'medium' }, { label: '低危', value: 'low' },
    ]},
    { type: 'select' as const, label: '事件类型', options: [
      { label: '全部', value: '' }, { label: '恶意软件', value: 'malware' }, { label: '漏洞利用', value: 'exploit' },
      { label: '暴力破解', value: 'bruteforce' }, { label: 'Web攻击', value: 'web' }, { label: '异常流量', value: 'traffic' },
    ]},
    { type: 'input' as const, placeholder: '关键词搜索' },
    { type: 'button' as const, label: '查询', buttonType: 'primary' as const },
  ];

  return (
    <div className="monitor-events-page">
      <div className="monitor-events-stats">
        {stats.map(s => (
          <div className="monitor-events-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>安全事件列表</h3></div>
        <div className="monitor-section-body">
          <FilterBar filters={filters} />
          <DataTable columns={columns} data={eventsData} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default MonitorEvents;
