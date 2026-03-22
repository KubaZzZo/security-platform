import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './WarningEvents.css';

const processingData = [
  { id: 'TB-2024-0148', title: '宿舍区蠕虫病毒传播事件', level: '高', source: 'IDS检测', target: '宿舍区网段', time: '2024-01-14 16:30', reporter: '张明', progress: '已通知责任单位' },
  { id: 'TB-2024-0147', title: '教学区Web应用XSS漏洞利用', level: '高', source: 'WAF日志', target: '教务系统', time: '2024-01-14 15:20', reporter: '李华', progress: '修复中' },
  { id: 'TB-2024-0146', title: '科研区服务器异常外联行为', level: '中', source: '流量分析', target: '科研服务器集群', time: '2024-01-14 14:10', reporter: '王强', progress: '排查中' },
  { id: 'TB-2024-0145', title: '行政区打印机网络扫描行为', level: '中', source: 'IDS检测', target: '行政区IoT设备', time: '2024-01-14 11:00', reporter: '赵丽', progress: '已通知责任单位' },
  { id: 'TB-2024-0144', title: '校园网DNS劫持疑似事件', level: '高', source: 'DNS监控', target: 'DNS服务器', time: '2024-01-14 09:45', reporter: '张明', progress: '处置中' },
  { id: 'TB-2024-0143', title: '图书馆区域ARP欺骗告警', level: '中', source: '交换机日志', target: '图书馆网段', time: '2024-01-13 16:30', reporter: '李华', progress: '已通知责任单位' },
];

const WarningProcessing: React.FC = () => {
  const columns: Column[] = [
    { key: 'id', title: '通报编号', width: 130 },
    { key: 'title', title: '事件标题' },
    { key: 'level', title: '事件等级', width: 80, render: (v: string) => (
      <span className={`event-level-tag event-level-${v === '高' ? 'high' : v === '中' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'reporter', title: '通报人', width: 80 },
    { key: 'target', title: '涉及资产', width: 140 },
    { key: 'time', title: '通报时间', width: 150 },
    { key: 'progress', title: '处理进度', width: 120, render: (v: string) => (
      <span className="event-status-tag event-status-processing">{v}</span>
    )},
    { key: 'op', title: '操作', width: 120, render: () => (
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="op-btn">跟进</button>
        <button className="op-btn">归档</button>
      </div>
    )},
  ];

  const filters = [
    { type: 'date' as const, label: '通报时间' },
    { type: 'select' as const, label: '事件等级', options: [
      { label: '全部', value: '' }, { label: '高', value: 'high' }, { label: '中', value: 'medium' }, { label: '低', value: 'low' },
    ]},
    { type: 'input' as const, placeholder: '搜索事件标题' },
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  return (
    <div className="warning-events-page">
      <div className="warning-events-header"><h3>通报中事件</h3></div>
      <div className="warning-events-stats">
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#1890ff' }}>6</div><div className="stat-label">通报中总数</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#ff4d4f' }}>3</div><div className="stat-label">高危事件</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#52c41a' }}>2</div><div className="stat-label">已通知责任单位</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#fa8c16' }}>1</div><div className="stat-label">处置中</div></div>
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={processingData} />
    </div>
  );
};

export default WarningProcessing;
