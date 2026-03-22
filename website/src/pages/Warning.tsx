import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DataTable, { Column } from '../components/common/DataTable';
import FilterBar from '../components/common/FilterBar';
import { warningTableData } from '../data/mockData';
import WarningAlertCenter from './warning/WarningAlertCenter';
import WarningBulletin from './warning/WarningBulletin';
import WarningSettings from './warning/WarningSettings';
import WarningPending from './warning/WarningPending';
import WarningProcessing from './warning/WarningProcessing';
import WarningArchived from './warning/WarningArchived';
import WarningIgnored from './warning/WarningIgnored';
import './Warning.css';

const WarningOverview: React.FC = () => {
  const columns: Column[] = [
    { key: 'id', title: '序号', width: 60 },
    { key: 'title', title: '标题' },
    { key: 'source', title: '数据来源', width: 200 },
    { key: 'time', title: '推送时间', width: 160 },
    { key: 'type', title: '预警类型', width: 100, render: (v: string) => (
      <span className={`warning-type-tag ${v === '漏洞预警' ? 'type-vuln' : 'type-security'}`}>{v}</span>
    )},
  ];

  const filters = [
    { type: 'date' as const, label: '推送时间' },
    { type: 'input' as const, placeholder: '请输入标题搜索' },
    { type: 'select' as const, label: '预警类型', options: [
      { label: '全部', value: '' },
      { label: '漏洞预警', value: 'vuln' },
      { label: '安全预警', value: 'security' },
    ]},
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  return (
    <div className="warning-page">
      <div className="warning-header">
        <h3>收到的预警</h3>
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={warningTableData} />
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
