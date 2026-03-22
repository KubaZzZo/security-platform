import React, { useState } from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import './ReportsExport.css';

const historyData = [
  { name: '安全日报-20260322', type: '安全日报', range: '2026-03-22', format: 'PDF', size: '2.3MB', time: '2026-03-22 08:00', status: '已完成' },
  { name: '安全周报-第12周', type: '安全周报', range: '2026-03-16 ~ 2026-03-22', format: 'Word', size: '5.1MB', time: '2026-03-22 07:00', status: '已完成' },
  { name: '资产报告-202603', type: '资产报告', range: '2026-03-01 ~ 2026-03-22', format: 'Excel', size: '1.8MB', time: '2026-03-21 18:00', status: '已完成' },
  { name: '威胁分析报告-Q1', type: '威胁分析报告', range: '2026-01-01 ~ 2026-03-22', format: 'PDF', size: '8.5MB', time: '2026-03-21 15:00', status: '已完成' },
  { name: '安全月报-202602', type: '安全月报', range: '2026-02-01 ~ 2026-02-28', format: 'PDF', size: '4.2MB', time: '2026-03-01 08:00', status: '已完成' },
  { name: '安全日报-20260321', type: '安全日报', range: '2026-03-21', format: 'PDF', size: '—', time: '2026-03-21 23:50', status: '生成失败' },
];

const ReportsExport: React.FC = () => {
  const [format, setFormat] = useState('PDF');
  const [modules, setModules] = useState({ overview: true, threat: true, asset: true, traffic: false, disposal: false });

  const toggleModule = (key: string) => {
    setModules(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const columns: Column[] = [
    { key: 'name', title: '报告名称' },
    { key: 'type', title: '报告类型', width: 110 },
    { key: 'range', title: '时间范围', width: 180 },
    { key: 'format', title: '格式', width: 60 },
    { key: 'size', title: '大小', width: 70 },
    { key: 'time', title: '导出时间', width: 140 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`export-status-tag ${v === '已完成' ? 'done' : v === '生成中' ? 'generating' : 'failed'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 60, render: (_: any, row: any) => (
      row.status === '已完成' ? <button className="op-btn">下载</button> : null
    )},
  ];

  return (
    <div className="reports-export-page">
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>导出配置</h3></div>
        <div className="monitor-section-body">
          <div className="export-form">
            <div className="export-form-item">
              <label>报告类型</label>
              <select>
                <option>安全日报</option>
                <option>安全周报</option>
                <option>安全月报</option>
                <option>资产报告</option>
                <option>威胁分析报告</option>
              </select>
            </div>
            <div className="export-form-item">
              <label>时间范围</label>
              <div className="export-date-range">
                <input type="date" defaultValue="2026-03-22" />
                <span>~</span>
                <input type="date" defaultValue="2026-03-22" />
              </div>
            </div>
            <div className="export-form-item">
              <label>导出格式</label>
              <div className="export-format-group">
                {['PDF', 'Word', 'Excel'].map(f => (
                  <button key={f} className={`format-btn ${format === f ? 'active' : ''}`} onClick={() => setFormat(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="export-form-item">
              <label>包含模块</label>
              <div className="export-checkbox-group">
                {[
                  { key: 'overview', label: '安全概览' },
                  { key: 'threat', label: '威胁分析' },
                  { key: 'asset', label: '资产状态' },
                  { key: 'traffic', label: '流量分析' },
                  { key: 'disposal', label: '处置记录' },
                ].map(m => (
                  <label key={m.key}>
                    <input type="checkbox" checked={modules[m.key as keyof typeof modules]} onChange={() => toggleModule(m.key)} />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
            <button className="export-primary-btn">导出</button>
          </div>
        </div>
      </div>

      <div className="monitor-section">
        <div className="monitor-section-header"><h3>导出历史</h3></div>
        <div className="monitor-section-body">
          <DataTable columns={columns} data={historyData} showPagination={false} />
        </div>
      </div>
    </div>
  );
};

export default ReportsExport;
