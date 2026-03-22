import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './DisposalUsers.css';

const mockUsers = [
  { username: '张三', userType: '学生', department: '计算机学院', riskLevel: '高危', abnormalCount: 12, relatedAssets: 5, lastActive: '2026-03-22 10:23:45' },
  { username: '李四', userType: '教职工', department: '网络中心', riskLevel: '高危', abnormalCount: 9, relatedAssets: 8, lastActive: '2026-03-22 09:15:30' },
  { username: '王五', userType: '学生', department: '信息学院', riskLevel: '中危', abnormalCount: 6, relatedAssets: 3, lastActive: '2026-03-22 08:45:12' },
  { username: '赵六', userType: '管理员', department: '信息中心', riskLevel: '高危', abnormalCount: 15, relatedAssets: 12, lastActive: '2026-03-21 22:30:00' },
  { username: '孙七', userType: '学生', department: '电子工程学院', riskLevel: '中危', abnormalCount: 4, relatedAssets: 2, lastActive: '2026-03-21 18:20:33' },
  { username: '周八', userType: '教职工', department: '图书馆', riskLevel: '低危', abnormalCount: 2, relatedAssets: 1, lastActive: '2026-03-21 16:10:22' },
  { username: '吴九', userType: '学生', department: '数学学院', riskLevel: '中危', abnormalCount: 5, relatedAssets: 4, lastActive: '2026-03-21 14:55:18' },
  { username: '郑十', userType: '管理员', department: '教务处', riskLevel: '低危', abnormalCount: 1, relatedAssets: 2, lastActive: '2026-03-21 11:40:05' },
  { username: '陈明', userType: '学生', department: '物理学院', riskLevel: '高危', abnormalCount: 11, relatedAssets: 6, lastActive: '2026-03-20 23:15:40' },
  { username: '林华', userType: '教职工', department: '后勤处', riskLevel: '低危', abnormalCount: 3, relatedAssets: 1, lastActive: '2026-03-20 17:30:55' },
];

const DisposalUsers: React.FC = () => {
  const stats = [
    { label: '风险用户总数', value: 64, color: 'var(--primary)' },
    { label: '高危用户', value: 18, color: 'var(--danger)' },
    { label: '中危用户', value: 26, color: 'var(--warning)' },
    { label: '低危用户', value: 20, color: 'var(--success)' },
  ];

  const filters = [
    { type: 'select' as const, label: '用户类型', options: [
      { label: '全部', value: '' }, { label: '学生', value: 'student' },
      { label: '教职工', value: 'staff' }, { label: '管理员', value: 'admin' },
    ]},
    { type: 'select' as const, label: '风险等级', options: [
      { label: '全部', value: '' }, { label: '高危', value: 'high' },
      { label: '中危', value: 'medium' }, { label: '低危', value: 'low' },
    ]},
    { type: 'input' as const, placeholder: '搜索关键词' },
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  const columns: Column[] = [
    { key: 'username', title: '用户名' },
    { key: 'userType', title: '用户类型', width: 80 },
    { key: 'department', title: '所属部门', width: 120 },
    { key: 'riskLevel', title: '风险等级', width: 80, render: (v: string) => (
      <span className={`risk-tag risk-${v === '高危' ? 'high' : v === '中危' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'abnormalCount', title: '异常行为数', width: 90 },
    { key: 'relatedAssets', title: '关联资产', width: 80 },
    { key: 'lastActive', title: '最近活动时间', width: 160 },
    { key: 'op', title: '操作', width: 80, render: () => <button className="op-btn">处置</button> },
  ];

  return (
    <div className="disposal-users-page">
      <div className="disposal-users-stats">
        {stats.map(s => (
          <div className="disposal-users-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={mockUsers} />
    </div>
  );
};

export default DisposalUsers;
