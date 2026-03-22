import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './WarningEvents.css';

const archivedData = [
  { id: 'TB-2024-0120', title: '校园网出口遭受SYN Flood攻击', level: '高', source: '安全监控平台', reporter: '张明', time: '2024-01-10 14:30', archiveTime: '2024-01-12 16:00', result: '已修复' },
  { id: 'TB-2024-0118', title: '教务系统存在未授权访问漏洞', level: '高', source: '漏洞扫描系统', reporter: '李华', time: '2024-01-09 10:20', archiveTime: '2024-01-11 14:30', result: '已修复' },
  { id: 'TB-2024-0115', title: '宿舍区终端感染勒索病毒', level: '高', source: 'EDR告警', reporter: '王强', time: '2024-01-08 09:15', archiveTime: '2024-01-10 11:00', result: '已隔离处置' },
  { id: 'TB-2024-0112', title: '科研区FTP服务器弱口令', level: '中', source: '基线检查', reporter: '赵丽', time: '2024-01-07 15:40', archiveTime: '2024-01-09 09:30', result: '已修复' },
  { id: 'TB-2024-0110', title: '行政区邮件钓鱼攻击事件', level: '中', source: '邮件网关', reporter: '张明', time: '2024-01-06 11:20', archiveTime: '2024-01-08 15:00', result: '已处置' },
  { id: 'TB-2024-0108', title: '图书馆WiFi伪造热点事件', level: '中', source: '无线控制器', reporter: '李华', time: '2024-01-05 14:00', archiveTime: '2024-01-07 10:00', result: '已清除' },
  { id: 'TB-2024-0105', title: '教学区交换机端口环路告警', level: '低', source: '网络管理平台', reporter: '王强', time: '2024-01-04 09:30', archiveTime: '2024-01-05 16:00', result: '已修复' },
  { id: 'TB-2024-0102', title: 'VPN系统日志异常中断', level: '低', source: '日志审计', reporter: '赵丽', time: '2024-01-03 16:20', archiveTime: '2024-01-04 11:00', result: '已恢复' },
  { id: 'TB-2024-0100', title: '校园网BGP路由异常波动', level: '中', source: '路由监控', reporter: '张明', time: '2024-01-02 10:00', archiveTime: '2024-01-03 14:30', result: '已修复' },
  { id: 'TB-2024-0098', title: '数据中心UPS电源告警', level: '低', source: '动环监控', reporter: '李华', time: '2024-01-01 08:00', archiveTime: '2024-01-02 09:00', result: '已处置' },
];

const WarningArchived: React.FC = () => {
  const columns: Column[] = [
    { key: 'id', title: '通报编号', width: 130 },
    { key: 'title', title: '事件标题' },
    { key: 'level', title: '事件等级', width: 80, render: (v: string) => (
      <span className={`event-level-tag event-level-${v === '高' ? 'high' : v === '中' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'reporter', title: '通报人', width: 80 },
    { key: 'time', title: '通报时间', width: 150 },
    { key: 'archiveTime', title: '归档时间', width: 150 },
    { key: 'result', title: '处置结果', width: 100, render: (v: string) => (
      <span className="event-status-tag event-status-archived">{v}</span>
    )},
    { key: 'op', title: '操作', width: 60, render: () => (
      <button className="op-btn">详情</button>
    )},
  ];

  const filters = [
    { type: 'date' as const, label: '归档时间' },
    { type: 'select' as const, label: '事件等级', options: [
      { label: '全部', value: '' }, { label: '高', value: 'high' }, { label: '中', value: 'medium' }, { label: '低', value: 'low' },
    ]},
    { type: 'input' as const, placeholder: '搜索事件标题' },
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  return (
    <div className="warning-events-page">
      <div className="warning-events-header"><h3>已归档事件</h3></div>
      <div className="warning-events-stats">
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#52c41a' }}>156</div><div className="stat-label">归档总数</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#ff4d4f' }}>34</div><div className="stat-label">高危事件</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#faad14' }}>68</div><div className="stat-label">中危事件</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#1890ff' }}>54</div><div className="stat-label">低危事件</div></div>
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={archivedData} />
    </div>
  );
};

export default WarningArchived;
