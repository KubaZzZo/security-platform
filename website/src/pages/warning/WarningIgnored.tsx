import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './WarningEvents.css';

const ignoredData = [
  { id: 'TB-2024-0142', title: '教学区打印机固件版本过低', level: '低', source: '资产扫描', target: '教学区打印机', time: '2024-01-13 14:30', reason: '设备即将淘汰', operator: '张明' },
  { id: 'TB-2024-0140', title: '测试环境SSH弱口令告警', level: '低', source: '基线检查', target: '测试服务器', time: '2024-01-13 11:20', reason: '隔离测试环境', operator: '李华' },
  { id: 'TB-2024-0138', title: '实验室内网扫描行为', level: '低', source: 'IDS检测', target: '实验室网段', time: '2024-01-12 16:00', reason: '授权安全测试', operator: '王强' },
  { id: 'TB-2024-0135', title: '临时访客WiFi流量异常', level: '低', source: '流量监控', target: '访客网络', time: '2024-01-12 10:30', reason: '大型会议期间正常', operator: '赵丽' },
  { id: 'TB-2024-0132', title: '开发区Docker镜像漏洞', level: '中', source: '镜像扫描', target: '开发环境', time: '2024-01-11 15:20', reason: '非生产环境', operator: '张明' },
  { id: 'TB-2024-0130', title: '旧版OA系统SSL证书过期', level: '低', source: '证书监控', target: '旧版OA', time: '2024-01-11 09:00', reason: '系统已停用', operator: '李华' },
  { id: 'TB-2024-0128', title: '体育馆监控摄像头固件告警', level: '低', source: '设备管理', target: '体育馆IoT', time: '2024-01-10 14:00', reason: '已列入升级计划', operator: '王强' },
  { id: 'TB-2024-0125', title: '食堂POS机网络异常', level: '低', source: '网络监控', target: '食堂终端', time: '2024-01-10 08:30', reason: '第三方运维负责', operator: '赵丽' },
];

const WarningIgnored: React.FC = () => {
  const columns: Column[] = [
    { key: 'id', title: '通报编号', width: 130 },
    { key: 'title', title: '事件标题' },
    { key: 'level', title: '事件等级', width: 80, render: (v: string) => (
      <span className={`event-level-tag event-level-${v === '高' ? 'high' : v === '中' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'target', title: '涉及资产', width: 120 },
    { key: 'time', title: '发现时间', width: 150 },
    { key: 'reason', title: '忽略原因', width: 140, render: (v: string) => (
      <span className="event-status-tag event-status-ignored">{v}</span>
    )},
    { key: 'operator', title: '操作人', width: 80 },
    { key: 'op', title: '操作', width: 100, render: () => (
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="op-btn">详情</button>
        <button className="op-btn">恢复</button>
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
      <div className="warning-events-header"><h3>无需通报事件</h3></div>
      <div className="warning-events-stats">
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#999' }}>86</div><div className="stat-label">忽略总数</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#faad14' }}>5</div><div className="stat-label">中危事件</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#1890ff' }}>81</div><div className="stat-label">低危事件</div></div>
        <div className="warning-events-stat"><div className="stat-value" style={{ color: '#52c41a' }}>12</div><div className="stat-label">本月新增</div></div>
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={ignoredData} />
    </div>
  );
};

export default WarningIgnored;
