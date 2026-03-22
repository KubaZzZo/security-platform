import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './DisposalRecords.css';

const mockRecords = [
  { id: 'DSP-20260322-001', target: '192.168.45.102', threatType: 'DDoS攻击', method: '自动封锁', result: '成功', operator: '系统', time: '2026-03-22 10:30:15', duration: '0.8s' },
  { id: 'DSP-20260322-002', target: '张三(学生)', threatType: '暴力破解', method: '账户锁定', result: '成功', operator: '王管理', time: '2026-03-22 09:20:00', duration: '1.2s' },
  { id: 'DSP-20260322-003', target: '172.16.8.201', threatType: '蠕虫传播', method: '主机隔离', result: '成功', operator: '系统', time: '2026-03-22 08:15:30', duration: '2.5s' },
  { id: 'DSP-20260321-004', target: '10.0.12.55', threatType: '端口扫描', method: 'IP封禁', result: '成功', operator: '李工程师', time: '2026-03-21 22:45:00', duration: '0.5s' },
  { id: 'DSP-20260321-005', target: 'mail.campus.edu', threatType: '钓鱼攻击', method: '域名封锁', result: '失败', operator: '系统', time: '2026-03-21 18:30:20', duration: '5.0s' },
  { id: 'DSP-20260321-006', target: '192.168.100.33', threatType: 'DDoS攻击', method: '流量清洗', result: '成功', operator: '系统', time: '2026-03-21 16:10:00', duration: '3.8s' },
  { id: 'DSP-20260321-007', target: '赵六(管理员)', threatType: '异常登录', method: '账户锁定', result: '成功', operator: '王管理', time: '2026-03-21 14:55:45', duration: '1.0s' },
  { id: 'DSP-20260321-008', target: '10.0.20.177', threatType: '暴力破解', method: 'IP封禁', result: '成功', operator: '系统', time: '2026-03-21 11:40:10', duration: '0.6s' },
  { id: 'DSP-20260320-009', target: '172.16.3.99', threatType: '蠕虫传播', method: '主机隔离', result: '失败', operator: '李工程师', time: '2026-03-20 23:20:00', duration: '8.2s' },
  { id: 'DSP-20260320-010', target: '10.0.8.42', threatType: '端口扫描', method: 'IP封禁', result: '成功', operator: '系统', time: '2026-03-20 17:30:55', duration: '0.4s' },
];

const DisposalRecords: React.FC = () => {
  const stats = [
    { label: '总处置数', value: '1,856', color: 'var(--primary)' },
    { label: '本月处置', value: '234', color: '#722ed1' },
    { label: '成功率', value: '96.8%', color: 'var(--success)' },
    { label: '平均响应时间', value: '4.2min', color: 'var(--warning)' },
  ];

  const filters = [
    { type: 'date' as const, label: '时间范围' },
    { type: 'select' as const, label: '处置类型', options: [
      { label: '全部', value: '' }, { label: '自动封锁', value: 'auto-block' },
      { label: 'IP封禁', value: 'ip-ban' }, { label: '主机隔离', value: 'isolate' },
      { label: '账户锁定', value: 'lock' },
    ]},
    { type: 'select' as const, label: '处置结果', options: [
      { label: '全部', value: '' }, { label: '成功', value: 'success' }, { label: '失败', value: 'fail' },
    ]},
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  const columns: Column[] = [
    { key: 'id', title: '处置编号', width: 160 },
    { key: 'target', title: '处置对象' },
    { key: 'threatType', title: '威胁类型', width: 90 },
    { key: 'method', title: '处置方式', width: 80 },
    { key: 'result', title: '处置结果', width: 80, render: (v: string) => (
      <span className={v === '成功' ? 'result-success' : 'result-fail'}>{v}</span>
    )},
    { key: 'operator', title: '处置人', width: 80 },
    { key: 'time', title: '处置时间', width: 150 },
    { key: 'duration', title: '耗时', width: 60 },
    { key: 'op', title: '操作', width: 70, render: () => <button className="op-btn">详情</button> },
  ];

  return (
    <div className="disposal-records-page">
      <div className="disposal-records-stats">
        {stats.map(s => (
          <div className="disposal-records-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={mockRecords} />
    </div>
  );
};

export default DisposalRecords;
