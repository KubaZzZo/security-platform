import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DataTable, { Column } from '../components/common/DataTable';
import FilterBar from '../components/common/FilterBar';
import { assetGroups, disposalStats, disposalTableData } from '../data/mockData';
import DisposalUsers from './disposal/DisposalUsers';
import DisposalThreats from './disposal/DisposalThreats';
import DisposalStrategy from './disposal/DisposalStrategy';
import DisposalRecords from './disposal/DisposalRecords';
import './Disposal.css';

const DisposalOverview: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const columns: Column[] = [
    { key: 'name', title: '资产名称' },
    { key: 'type', title: '类型', width: 80 },
    { key: 'riskLevel', title: '风险等级', width: 80, render: (v: string) => (
      <span className={`risk-tag risk-${v === '高危' ? 'high' : v === '中危' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'events', title: '安全事件', width: 80 },
    { key: 'time', title: '时间', width: 160 },
    { key: 'hasEDR', title: 'aES-EDR', width: 80, render: (v: boolean) => (
      <span className={`edr-tag ${v ? 'edr-on' : 'edr-off'}`}>{v ? '已安装' : '未安装'}</span>
    )},
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`status-tag status-${v === '待处置' ? 'pending' : v === '处置中' ? 'processing' : 'done'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 80, render: () => <button className="op-btn">处置</button> },
  ];

  const filters = [
    { type: 'select' as const, label: '处置状态', options: [
      { label: '全部', value: '' }, { label: '待处置', value: 'pending' },
      { label: '处置中', value: 'processing' }, { label: '已处置', value: 'done' },
    ]},
    { type: 'select' as const, label: '风险等级', options: [
      { label: '全部', value: '' }, { label: '高危', value: 'high' },
      { label: '中危', value: 'medium' }, { label: '低危', value: 'low' },
    ]},
    { type: 'input' as const, placeholder: '请输入IP搜索' },
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  return (
    <div className="disposal-page">
      <div className="disposal-left">
        <div className="disposal-left-title">资产组</div>
        {assetGroups.map(g => (
          <div key={g.id}>
            <div className={`tree-item ${activeGroup === g.id ? 'active' : ''}`} onClick={() => setActiveGroup(g.id)}>
              <span>{g.name}</span>
              <span className="tree-count">{g.count}</span>
            </div>
            {g.children && (
              <div className="tree-children">
                {g.children.map(c => (
                  <div key={c.id} className={`tree-item ${activeGroup === c.id ? 'active' : ''}`} onClick={() => setActiveGroup(c.id)}>
                    <span>{c.name}</span>
                    <span className="tree-count">{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="disposal-right">
        <FilterBar filters={filters} />
        <div className="disposal-stat-cards">
          {Object.entries(disposalStats).map(([key, s]) => (
            <div key={key} className={`disposal-stat-card ${activeType === key ? 'active' : ''}`} onClick={() => setActiveType(key)}>
              <div className="card-value" style={{ color: s.color }}>{s.value}</div>
              <div className="card-label">{s.label}</div>
            </div>
          ))}
          <div className="disposal-stat-card">
            <div className="card-value" style={{ color: '#faad14' }}>☆</div>
            <div className="card-label">我的关注</div>
          </div>
        </div>
        <DataTable columns={columns} data={disposalTableData} />
      </div>
    </div>
  );
};

const Disposal: React.FC = () => (
  <Routes>
    <Route index element={<DisposalOverview />} />
    <Route path="users" element={<DisposalUsers />} />
    <Route path="threats" element={<DisposalThreats />} />
    <Route path="strategy" element={<DisposalStrategy />} />
    <Route path="records" element={<DisposalRecords />} />
  </Routes>
);

export default Disposal;
