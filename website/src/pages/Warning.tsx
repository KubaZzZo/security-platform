import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DataTable, { Column } from '../components/common/DataTable';
import WarningAlertCenter from './warning/WarningAlertCenter';
import WarningBulletin from './warning/WarningBulletin';
import WarningSettings from './warning/WarningSettings';
import WarningPending from './warning/WarningPending';
import WarningProcessing from './warning/WarningProcessing';
import WarningArchived from './warning/WarningArchived';
import WarningIgnored from './warning/WarningIgnored';
import './Warning.css';

const recentEvents = [
  { id: 'TB-2024-0156', title: '校园网出口遭受DDoS攻击事件', level: '高', status: '待通报', time: '2024-01-15 14:30' },
  { id: 'TB-2024-0148', title: '宿舍区蠕虫病毒传播事件', level: '高', status: '通报中', time: '2024-01-14 16:30' },
  { id: 'TB-2024-0120', title: '校园网出口遭受SYN Flood攻击', level: '高', status: '已归档', time: '2024-01-10 14:30' },
  { id: 'TB-2024-0155', title: '教学区服务器存在SQL注入漏洞', level: '高', status: '待通报', time: '2024-01-15 13:20' },
  { id: 'TB-2024-0147', title: '教学区Web应用XSS漏洞利用', level: '高', status: '通报中', time: '2024-01-14 15:20' },
  { id: 'TB-2024-0142', title: '教学区打印机固件版本过低', level: '低', status: '已忽略', time: '2024-01-13 14:30' },
];

const WarningOverview: React.FC = () => {
  const navigate = useNavigate();

  const summaryCards = [
    { label: '待通报事件', value: 8, color: '#fa8c16', path: '/warning/pending' },
    { label: '通报中事件', value: 6, color: '#1890ff', path: '/warning/processing' },
    { label: '已归档事件', value: 156, color: '#52c41a', path: '/warning/archived' },
    { label: '无需通报事件', value: 86, color: '#999', path: '/warning/ignored' },
  ];

  const columns: Column[] = [
    { key: 'id', title: '通报编号', width: 130 },
    { key: 'title', title: '事件标题' },
    { key: 'level', title: '事件等级', width: 80, render: (v: string) => (
      <span className={`warning-type-tag ${v === '高' ? 'type-vuln' : v === '中' ? 'type-security' : ''}`}>{v}</span>
    )},
    { key: 'status', title: '状态', width: 100, render: (v: string) => {
      const cls = v === '待通报' ? 'status-pending' : v === '通报中' ? 'status-processing' : v === '已归档' ? 'status-archived' : 'status-ignored';
      return <span className={`warning-status-tag ${cls}`}>{v}</span>;
    }},
    { key: 'time', title: '时间', width: 150 },
  ];

  return (
    <div className="warning-page">
      <div className="warning-header">
        <h3>通报总览</h3>
      </div>
      <div className="warning-summary-cards">
        {summaryCards.map(card => (
          <div className="warning-summary-card" key={card.label} onClick={() => navigate(card.path)} style={{ cursor: 'pointer' }}>
            <div className="card-value" style={{ color: card.color }}>{card.value}</div>
            <div className="card-label">{card.label}</div>
          </div>
        ))}
      </div>
      <div className="warning-recent">
        <h4>最近通报事件</h4>
        <DataTable columns={columns} data={recentEvents} showPagination={false} />
      </div>
    </div>
  );
};

const Warning: React.FC = () => (
  <Routes>
    <Route index element={<WarningOverview />} />
    <Route path="pending" element={<WarningPending />} />
    <Route path="processing" element={<WarningProcessing />} />
    <Route path="archived" element={<WarningArchived />} />
    <Route path="ignored" element={<WarningIgnored />} />
    <Route path="alert-center" element={<WarningAlertCenter />} />
    <Route path="bulletin" element={<WarningBulletin />} />
    <Route path="settings" element={<WarningSettings />} />
  </Routes>
);

export default Warning;
