import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './DisposalStrategy.css';

const mockStrategies = [
  { name: 'DDoS自动封锁', type: '自动响应', trigger: '流量超过阈值500Mbps', action: '自动封锁源IP', priority: 1, status: '启用', createTime: '2026-01-15 10:00:00' },
  { name: '端口扫描告警', type: '人工确认', trigger: '单IP扫描端口>100', action: '告警通知管理员', priority: 2, status: '启用', createTime: '2026-01-20 14:30:00' },
  { name: '蠕虫传播阻断', type: '联动封锁', trigger: '检测到蠕虫特征', action: '隔离感染主机', priority: 1, status: '启用', createTime: '2026-02-05 09:15:00' },
  { name: '暴力破解防护', type: '自动响应', trigger: '登录失败>10次/分钟', action: '锁定账户30分钟', priority: 3, status: '启用', createTime: '2026-02-10 16:00:00' },
  { name: '钓鱼邮件拦截', type: '联动封锁', trigger: '匹配钓鱼特征库', action: '拦截邮件并告警', priority: 2, status: '停用', createTime: '2026-02-18 11:20:00' },
  { name: 'SQL注入防护', type: '自动响应', trigger: '检测到SQL注入特征', action: '阻断请求并记录', priority: 1, status: '启用', createTime: '2026-03-01 08:45:00' },
  { name: '异常流量监控', type: '人工确认', trigger: '流量偏离基线>200%', action: '生成工单待确认', priority: 4, status: '启用', createTime: '2026-03-05 13:30:00' },
  { name: 'XSS攻击防护', type: '自动响应', trigger: '检测到XSS攻击特征', action: '阻断并清洗请求', priority: 2, status: '停用', createTime: '2026-03-10 10:00:00' },
];

const DisposalStrategy: React.FC = () => {
  const filters = [
    { type: 'select' as const, label: '策略类型', options: [
      { label: '全部', value: '' }, { label: '自动响应', value: 'auto' },
      { label: '人工确认', value: 'manual' }, { label: '联动封锁', value: 'linked' },
    ]},
    { type: 'select' as const, label: '状态', options: [
      { label: '全部', value: '' }, { label: '启用', value: 'on' }, { label: '停用', value: 'off' },
    ]},
  ];

  const columns: Column[] = [
    { key: 'name', title: '策略名称' },
    { key: 'type', title: '策略类型', width: 90 },
    { key: 'trigger', title: '触发条件' },
    { key: 'action', title: '响应动作' },
    { key: 'priority', title: '优先级', width: 70 },
    { key: 'status', title: '状态', width: 70, render: (v: string) => (
      <span className={v === '启用' ? 'strategy-status-on' : 'strategy-status-off'}>{v}</span>
    )},
    { key: 'createTime', title: '创建时间', width: 150 },
    { key: 'op', title: '操作', width: 120, render: () => (
      <span>
        <button className="op-btn">编辑</button>
        <button className="op-btn-danger">删除</button>
      </span>
    )},
  ];

  return (
    <div className="disposal-strategy-page">
      <div className="disposal-strategy-toolbar">
        <button className="toolbar-btn" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>+ 新建策略</button>
        <button className="toolbar-btn">导入</button>
        <button className="toolbar-btn">导出</button>
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={mockStrategies} />
    </div>
  );
};

export default DisposalStrategy;
