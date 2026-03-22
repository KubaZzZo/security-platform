import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DataTable, { Column } from '../components/common/DataTable';
import FilterBar from '../components/common/FilterBar';
import { logStats, logTableData } from '../data/mockData';
import AnalysisCorrelation from './analysis/AnalysisCorrelation';
import AnalysisBehavior from './analysis/AnalysisBehavior';
import AnalysisThreatIntel from './analysis/AnalysisThreatIntel';
import './Analysis.css';

const AnalysisOverview: React.FC = () => {
  const columns: Column[] = [
    { key: 'time', title: '时间', width: 160 },
    { key: 'desc', title: '描述' },
    { key: 'logType', title: '日志类型', width: 80 },
    { key: 'attackType', title: '攻击类型', width: 100 },
    { key: 'srcIp', title: '源IP', width: 130 },
    { key: 'dstIp', title: '目的IP', width: 130 },
    { key: 'severity', title: '严重等级', width: 80, render: (v: string) => (
      <span className={`severity-badge severity-${v === '高' ? 'high' : v === '中' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'action', title: '动作', width: 80, render: (v: string) => (
      <span className={`action-tag action-${v === '阻断' ? 'block' : v === '告警' ? 'alert' : 'pass'}`}>{v}</span>
    )},
  ];

  const filters = [
    { type: 'date' as const, label: '时间范围' },
    { type: 'select' as const, label: '日志类型', options: [
      { label: '全部', value: '' }, { label: 'IDS', value: 'ids' },
      { label: 'WAF', value: 'waf' }, { label: '防火墙', value: 'fw' },
    ]},
    { type: 'select' as const, label: '访问方向', options: [
      { label: '全部', value: '' }, { label: '入站', value: 'in' }, { label: '出站', value: 'out' },
    ]},
    { type: 'input' as const, placeholder: '搜索关键词' },
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  return (
    <div className="analysis-page">
      <div className="analysis-toolbar">
        <button className="toolbar-btn">📤 导出</button>
        <button className="toolbar-btn">🔧 解码小助手</button>
        <button className="toolbar-btn">📖 检索说明</button>
        <button className="toolbar-btn">📺 投屏</button>
        <button className="toolbar-btn">🔄 刷新</button>
      </div>

      <FilterBar filters={filters} />

      <div className="log-total">
        日志数量统计：共 <strong>{logStats.total.toLocaleString()}</strong> 条
      </div>

      <div className="log-categories">
        {logStats.categories.map(cat => (
          <div className="log-cat-tag" key={cat.name}>
            <span className="log-cat-dot" style={{ background: cat.color }} />
            <span>{cat.name}</span>
            <span className="log-cat-count">{cat.count.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={logTableData} />
    </div>
  );
};

const Analysis: React.FC = () => (
  <Routes>
    <Route index element={<AnalysisOverview />} />
    <Route path="correlation" element={<AnalysisCorrelation />} />
    <Route path="behavior" element={<AnalysisBehavior />} />
    <Route path="threat-intel" element={<AnalysisThreatIntel />} />
  </Routes>
);

export default Analysis;
