import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './WarningEvents.css';

const pendingData = [
  { id: 'TB-2024-0156', title: '校园网出口遭受DDoS攻击事件', level: '高', source: '安全监控平台', target: '出口防火墙', time: '2024-01-15 14:30', reporter: '待指派' },
  { id: 'TB-2024-0155', title: '教学区服务器存在SQL注入漏洞', level: '高', source: '漏洞扫描系统', target: '教学区Web服务器', time: '2024-01-15 13:20', reporter: '待指派' },
  { id: 'TB-2024-0154', title: '宿舍区发现挖矿木马通信行为', level: '中', source: 'IDS检测', target: '宿舍区终端', time: '2024-01-15 12:10', reporter: '待指派' },
  { id: 'TB-2024-0153', title: '图书馆无线网络异常流量突增', level: '中', source: '流量监控', target: '图书馆AP', time: '2024-01-15 11:05', reporter: '待指派' },
  { id: 'TB-2024-0152', title: '行政区邮件服务器遭受暴力破解', level: '高', source: '日志分析', target: '邮件服务器', time: '2024-01-15 10:00', reporter: '待指派' },
  { id: 'TB-2024-0151', title: '科研区数据库异常访问告警', level: '中', source: '数据库审计', target: '科研数据库', time: '2024-01-15 09:30', reporter: '待指派' },
  { id: 'TB-2024-0150', title: 'VPN账号异地同时登录事件', level: '低', source: '身份认证系统', target: 'VPN网关', time: '2024-01-15 09:00', reporter: '待指派' },
  { id: 'TB-2024-0149', title: '教学区交换机配置变更告警', level: '低', source: '网络管理平台', target: '教学区核心交换机', time: '2024-01-15 08:30', reporter: '待指派' },
];

const WarningPending: React.FC = () => {
  const columns: Column[] = [
    { key: 'id', title: '通报编号', width: 130 },
    { key: 'title', title: '事件标题' },
    { key: 'level', title: '事件等级', width: 80, render: (v: string) => (
      <span className={`event-level-tag event-level-${v === '高' ? 'high' : v === '中' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'source', title: '事件来源', width: 120 },
    { key: 'target', title: '涉及资产', width: 140 },
    { key: 'time', title: '发现时间', width: 150 },
    { key: 'reporter', title: '通报人', width: 80, render: (v: string) => (
      <span style={{ color: '#fa8c16' }}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 120, render: () => (
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="op-btn">通报</button>
        <button className="op-btn" style={{ borderColor: '#999', color: '#999' }}>忽略</button>
      </div>
    )},
  ];

  const filters = [
    { type: 'date' as const, label: '发现时间' },
    { type: 'select' as const, label: '事件等级', options: [
      { label: '全部', value: '' }, { label: '高', value: 'high' }, { label: '中', value: 'medium' }, { label: '低', value: 'low' },
    ]},
    { type: 'input' as const, placeholder: '搜索事件标题' },
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  return (
    <div className="warning-events-page">
      <div className="warning-events-header"><h3>待通报事件</h3></div>
      <div className="warning-events-stats">
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#fa8c16' }}>8</div><div className="stat-label">待通报总数</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#ff4d4f' }}>3</div><div className="stat-label">高危事件</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#faad14' }}>3</div><div className="stat-label">中危事件</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#1890ff' }}>2</div><div className="stat-label">低危事件</div></div>
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={pendingData} />
    </div>
  );
};

export default WarningPending;
