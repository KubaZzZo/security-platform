import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DataTable, { Column } from '../components/common/DataTable';
import { reportCards, reportTableData } from '../data/mockData';
import ReportsExport from './reports/ReportsExport';
import ReportsSubscribe from './reports/ReportsSubscribe';
import ReportsSettings from './reports/ReportsSettings';
import './Reports.css';

const tabs = ['全部', '日报', '周报', '月报', '季度报', '年报'];

const ReportsOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('全部');

  const columns: Column[] = [
    { key: 'id', title: '序号', width: 60 },
    { key: 'name', title: '报告名称' },
    { key: 'type', title: '类型', width: 80 },
    { key: 'createTime', title: '生成时间', width: 160 },
    { key: 'size', title: '大小', width: 80 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span style={{ color: '#52c41a' }}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 120, render: () => (
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="op-link">下载</button>
        <button className="op-link">预览</button>
      </div>
    )},
  ];

  const filtered = activeTab === '全部' ? reportTableData : reportTableData.filter(r => r.type === activeTab);

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div className="reports-date">2024年1月15日 星期一</div>
        <div className="reports-status">今日报告：<span style={{ color: '#52c41a' }}>已生成</span></div>
      </div>

      <div className="report-cards">
        {reportCards.map((card, idx) => (
          <div className="report-card" key={idx}>
            <div className="report-card-type">{card.type}</div>
            <div className="report-card-title">{card.title}</div>
            <div className="report-card-footer">
              <span className="report-card-status">{card.status}</span>
              <span className="report-card-date">{card.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="reports-table-section">
        <div className="reports-tabs">
          {tabs.map(tab => (
            <div key={tab} className={`reports-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
          ))}
        </div>
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
};

const Reports: React.FC = () => (
  <Routes>
    <Route index element={<ReportsOverview />} />
    <Route path="export" element={<ReportsExport />} />
    <Route path="subscribe" element={<ReportsSubscribe />} />
    <Route path="settings" element={<ReportsSettings />} />
  </Routes>
);

export default Reports;
