import React from 'react';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../../components/common/DataTable';
import './DisposalThreats.css';

const mockThreats = [
  { threatId: 'THR-20260322-001', threatType: 'DDoS攻击', level: '高', affectedAssets: 15, srcIp: '192.168.45.102', firstSeen: '2026-03-20 08:12:00', lastActive: '2026-03-22 10:30:00', status: '处置中' },
  { threatId: 'THR-20260322-002', threatType: '端口扫描', level: '中', affectedAssets: 8, srcIp: '10.0.12.55', firstSeen: '2026-03-21 14:20:00', lastActive: '2026-03-22 09:45:00', status: '待处置' },
  { threatId: 'THR-20260322-003', threatType: '蠕虫传播', level: '高', affectedAssets: 23, srcIp: '172.16.8.201', firstSeen: '2026-03-19 22:00:00', lastActive: '2026-03-22 08:10:00', status: '处置中' },
  { threatId: 'THR-20260322-004', threatType: '钓鱼攻击', level: '高', affectedAssets: 5, srcIp: '203.0.113.45', firstSeen: '2026-03-22 06:30:00', lastActive: '2026-03-22 10:15:00', status: '待处置' },
  { threatId: 'THR-20260322-005', threatType: '端口扫描', level: '低', affectedAssets: 3, srcIp: '10.0.5.88', firstSeen: '2026-03-21 09:00:00', lastActive: '2026-03-21 23:50:00', status: '已处置' },
  { threatId: 'THR-20260322-006', threatType: 'DDoS攻击', level: '中', affectedAssets: 10, srcIp: '192.168.100.33', firstSeen: '2026-03-20 16:45:00', lastActive: '2026-03-22 07:20:00', status: '处置中' },
  { threatId: 'THR-20260322-007', threatType: '暴力破解', level: '中', affectedAssets: 4, srcIp: '10.0.20.177', firstSeen: '2026-03-21 20:10:00', lastActive: '2026-03-22 01:30:00', status: '已处置' },
  { threatId: 'THR-20260322-008', threatType: '钓鱼攻击', level: '低', affectedAssets: 2, srcIp: '198.51.100.12', firstSeen: '2026-03-22 03:00:00', lastActive: '2026-03-22 09:00:00', status: '待处置' },
  { threatId: 'THR-20260322-009', threatType: '蠕虫传播', level: '高', affectedAssets: 18, srcIp: '172.16.3.99', firstSeen: '2026-03-18 11:00:00', lastActive: '2026-03-22 10:00:00', status: '处置中' },
  { threatId: 'THR-20260322-010', threatType: '端口扫描', level: '低', affectedAssets: 1, srcIp: '10.0.8.42', firstSeen: '2026-03-22 07:45:00', lastActive: '2026-03-22 08:30:00', status: '已处置' },
];

const DisposalThreats: React.FC = () => {
  const stats = [
    { label: '活跃威胁', value: 89, color: 'var(--danger)' },
    { label: 'DDoS攻击', value: 12, color: '#722ed1' },
    { label: '端口扫描', value: 34, color: 'var(--primary)' },
    { label: '蠕虫传播', value: 8, color: '#eb2f96' },
    { label: '钓鱼攻击', value: 15, color: 'var(--warning)' },
    { label: '其他', value: 20, color: 'var(--text-light)' },
  ];

  const pieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center', textStyle: { fontSize: 12 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, fontSize: 12 },
      data: [
        { value: 12, name: 'DDoS攻击', itemStyle: { color: '#722ed1' } },
        { value: 34, name: '端口扫描', itemStyle: { color: '#1890ff' } },
        { value: 8, name: '蠕虫传播', itemStyle: { color: '#eb2f96' } },
        { value: 15, name: '钓鱼攻击', itemStyle: { color: '#faad14' } },
        { value: 20, name: '其他', itemStyle: { color: '#8c8c8c' } },
      ],
    }],
  };

  const columns: Column[] = [
    { key: 'threatId', title: '威胁ID', width: 160 },
    { key: 'threatType', title: '威胁类型', width: 90 },
    { key: 'level', title: '威胁等级', width: 80, render: (v: string) => (
      <span className={`severity-badge severity-${v === '高' ? 'high' : v === '中' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'affectedAssets', title: '影响资产数', width: 90 },
    { key: 'srcIp', title: '攻击源IP', width: 130 },
    { key: 'firstSeen', title: '首次发现', width: 150 },
    { key: 'lastActive', title: '最近活动', width: 150 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`status-tag status-${v === '待处置' ? 'pending' : v === '处置中' ? 'processing' : 'done'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 80, render: () => <button className="op-btn">处置</button> },
  ];

  return (
    <div className="disposal-threats-page">
      <div className="disposal-threats-stats">
        {stats.map(s => (
          <div className="disposal-threats-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="disposal-threats-chart">
        <h3>威胁类型分布</h3>
        <ReactECharts option={pieOption} style={{ height: 300 }} />
      </div>
      <DataTable columns={columns} data={mockThreats} />
    </div>
  );
};

export default DisposalThreats;
