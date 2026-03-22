import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './AnalysisCorrelation.css';

const mockCorrelations = [
  { ruleName: 'SSH暴力破解关联', ruleType: 'IP关联', eventCount: 15, level: '高', srcGroup: '10.0.12.0/24', dstGroup: '192.168.1.0/24', triggerTime: '2026-03-22 10:15:00', status: '已确认' },
  { ruleName: '横向移动检测', ruleType: '行为关联', eventCount: 8, level: '高', srcGroup: '172.16.8.100-110', dstGroup: '172.16.8.200-220', triggerTime: '2026-03-22 09:30:00', status: '待确认' },
  { ruleName: '定时外联检测', ruleType: '时间关联', eventCount: 23, level: '中', srcGroup: '10.0.5.88', dstGroup: '203.0.113.0/24', triggerTime: '2026-03-22 08:00:00', status: '已确认' },
  { ruleName: 'DDoS多源攻击', ruleType: 'IP关联', eventCount: 45, level: '高', srcGroup: '多个外部IP', dstGroup: '192.168.45.102', triggerTime: '2026-03-21 22:10:00', status: '处置中' },
  { ruleName: '数据泄露行为链', ruleType: '行为关联', eventCount: 6, level: '中', srcGroup: '10.0.20.55', dstGroup: '外部多个IP', triggerTime: '2026-03-21 18:45:00', status: '待确认' },
  { ruleName: '凌晨异常访问', ruleType: '时间关联', eventCount: 12, level: '低', srcGroup: '10.0.0.0/16', dstGroup: '内部服务器组', triggerTime: '2026-03-21 03:20:00', status: '已忽略' },
  { ruleName: '扫描后渗透关联', ruleType: '行为关联', eventCount: 9, level: '高', srcGroup: '10.0.12.55', dstGroup: '192.168.100.0/24', triggerTime: '2026-03-21 14:00:00', status: '处置中' },
  { ruleName: '同源多目标攻击', ruleType: 'IP关联', eventCount: 18, level: '中', srcGroup: '198.51.100.12', dstGroup: '多个内部IP', triggerTime: '2026-03-21 10:30:00', status: '待确认' },
];

const AnalysisCorrelation: React.FC = () => {
  const stats = [
    { label: '关联规则数', value: 156, color: 'var(--primary)' },
    { label: '今日触发', value: 43, color: 'var(--warning)' },
    { label: '关联事件组', value: 28, color: '#722ed1' },
    { label: '待确认', value: 12, color: 'var(--danger)' },
  ];

  const filters = [
    { type: 'date' as const, label: '时间范围' },
    { type: 'select' as const, label: '规则类型', options: [
      { label: '全部', value: '' }, { label: 'IP关联', value: 'ip' },
      { label: '时间关联', value: 'time' }, { label: '行为关联', value: 'behavior' },
    ]},
    { type: 'select' as const, label: '严重等级', options: [
      { label: '全部', value: '' }, { label: '高', value: 'high' },
      { label: '中', value: 'medium' }, { label: '低', value: 'low' },
    ]},
  ];

  const columns: Column[] = [
    { key: 'ruleName', title: '规则名称' },
    { key: 'ruleType', title: '规则类型', width: 90 },
    { key: 'eventCount', title: '关联事件数', width: 90 },
    { key: 'level', title: '威胁等级', width: 80, render: (v: string) => (
      <span className={`severity-badge severity-${v === '高' ? 'high' : v === '中' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'srcGroup', title: '源IP组', width: 140 },
    { key: 'dstGroup', title: '目的IP组', width: 140 },
    { key: 'triggerTime', title: '触发时间', width: 150 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`corr-status corr-status-${v === '已确认' ? 'confirmed' : v === '待确认' ? 'pending' : v === '处置中' ? 'processing' : 'ignored'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 70, render: () => <button className="op-btn">详情</button> },
  ];

  return (
    <div className="analysis-correlation-page">
      <div className="analysis-correlation-stats">
        {stats.map(s => (
          <div className="analysis-correlation-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={mockCorrelations} />
    </div>
  );
};

export default AnalysisCorrelation;
