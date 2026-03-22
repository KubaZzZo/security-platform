import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './ProtectionBlock.css';

const mockData = [
  { ip: '103.45.67.89', cSegment: '103.45.67.0/24', type: '自动', reason: 'DDoS攻击源，流量超过阈值', blockTime: '2024-03-15 09:12:00', unblockTime: '-', status: '已封锁' },
  { ip: '185.23.45.12', cSegment: '185.23.45.0/24', type: '自动', reason: '高频端口扫描，触发IDS规则', blockTime: '2024-03-15 08:45:00', unblockTime: '-', status: '已封锁' },
  { ip: '91.234.56.78', cSegment: '91.234.56.0/24', type: '手动', reason: 'SQL注入攻击，威胁数据库安全', blockTime: '2024-03-14 16:30:00', unblockTime: '-', status: '封锁中' },
  { ip: '45.67.89.101', cSegment: '45.67.89.0/24', type: '自动', reason: 'XSS攻击尝试，多次触发WAF规则', blockTime: '2024-03-14 14:20:00', unblockTime: '2024-03-15 14:20:00', status: '已封锁' },
  { ip: '112.34.56.78', cSegment: '112.34.56.0/24', type: '手动', reason: 'SSH暴力破解，失败登录超过500次', blockTime: '2024-03-14 11:05:00', unblockTime: '-', status: '已封锁' },
  { ip: '203.45.67.23', cSegment: '203.45.67.0/24', type: '自动', reason: '恶意爬虫，高频访问教务系统', blockTime: '2024-03-13 17:40:00', unblockTime: '2024-03-14 17:40:00', status: '已解封' },
  { ip: '78.90.12.34', cSegment: '78.90.12.0/24', type: '自动', reason: 'CC攻击，并发连接数异常', blockTime: '2024-03-13 15:22:00', unblockTime: '-', status: '封锁中' },
  { ip: '156.78.90.12', cSegment: '156.78.90.0/24', type: '手动', reason: '挖矿木马C2通信地址', blockTime: '2024-03-13 10:18:00', unblockTime: '-', status: '已封锁' },
  { ip: '67.89.101.23', cSegment: '67.89.101.0/24', type: '自动', reason: 'RDP暴力破解，来自已知恶意IP段', blockTime: '2024-03-12 22:15:00', unblockTime: '2024-03-13 22:15:00', status: '已解封' },
  { ip: '34.56.78.90', cSegment: '34.56.78.0/24', type: '手动', reason: '钓鱼网站托管IP，威胁师生信息安全', blockTime: '2024-03-12 16:00:00', unblockTime: '-', status: '已封锁' },
];

const ProtectionBlock: React.FC = () => {
  const columns: Column[] = [
    { key: 'ip', title: 'IP地址', width: 130 },
    { key: 'cSegment', title: 'C段', width: 150 },
    { key: 'type', title: '封锁类型', width: 80, render: (v: string) => (
      <span className={`block-type-tag ${v === '自动' ? 'type-auto' : 'type-manual'}`}>{v}</span>
    )},
    { key: 'reason', title: '封锁原因' },
    { key: 'blockTime', title: '封锁时间', width: 160 },
    { key: 'unblockTime', title: '解封时间', width: 160 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`block-status ${v === '已封锁' ? 'block-done' : v === '封锁中' ? 'block-ing' : 'block-no'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 100, render: () => (
      <><button className="op-btn">解封</button> <button className="op-btn">详情</button></>
    )},
  ];

  const filters = [
    { type: 'select' as const, label: '封锁状态', options: [
      { label: '全部', value: '' }, { label: '已封锁', value: 'blocked' }, { label: '封锁中', value: 'blocking' }, { label: '已解封', value: 'unblocked' },
    ]},
    { type: 'select' as const, label: '来源', options: [
      { label: '全部', value: '' }, { label: '自动', value: 'auto' }, { label: '手动', value: 'manual' },
    ]},
    { type: 'input' as const, placeholder: '请输入IP地址搜索' },
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  return (
    <div className="protection-block-page">
      <div className="block-stats-row">
        <div className="block-stat-card">
          <span className="stat-label">封锁IP总数</span>
          <span className="stat-value">2,345</span>
        </div>
        <div className="block-stat-card">
          <span className="stat-label">今日新增</span>
          <span className="stat-value">56</span>
        </div>
        <div className="block-stat-card">
          <span className="stat-label">自动封锁</span>
          <span className="stat-value">1,890</span>
        </div>
        <div className="block-stat-card">
          <span className="stat-label">手动封锁</span>
          <span className="stat-value">455</span>
        </div>
      </div>

      <div className="block-toolbar">
        <button className="toolbar-btn">手动封锁</button>
        <button className="toolbar-btn">批量导入</button>
        <button className="toolbar-btn">导出封锁列表</button>
      </div>

      <FilterBar filters={filters} />
      <DataTable columns={columns} data={mockData} />
    </div>
  );
};

export default ProtectionBlock;
