import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../components/common/DataTable';
import FilterBar from '../components/common/FilterBar';
import { attackerDistribution, attackerTop10 } from '../data/mockData';
import ProtectionRealtime from './protection/ProtectionRealtime';
import ProtectionBlock from './protection/ProtectionBlock';
import ProtectionThreatIntel from './protection/ProtectionThreatIntel';
import ProtectionExposure from './protection/ProtectionExposure';
import './Protection.css';

const ProtectionOverview: React.FC = () => {
  const [distTab, setDistTab] = useState<'domestic' | 'foreign'>('domestic');

  const distData = distTab === 'domestic' ? attackerDistribution.domestic : attackerDistribution.foreign;

  const columns: Column[] = [
    { key: 'ip', title: '攻击者IP', width: 140 },
    { key: 'cSegment', title: '同C段IP数', width: 90 },
    { key: 'victimIps', title: '受害IP', width: 70 },
    { key: 'attackType', title: '攻击类型', width: 90 },
    { key: 'attacks', title: '攻击次数', width: 80 },
    { key: 'lastTime', title: '最近攻击时间', width: 160 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`block-status ${v === '已封锁' ? 'block-done' : v === '封锁中' ? 'block-ing' : 'block-no'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 80, render: () => <button className="op-btn">封锁</button> },
  ];

  const filters = [
    { type: 'select' as const, label: '攻击类型', options: [
      { label: '全部', value: '' }, { label: 'SQL注入', value: 'sql' },
      { label: '暴力破解', value: 'brute' }, { label: 'XSS攻击', value: 'xss' },
      { label: '命令注入', value: 'cmd' }, { label: '恶意扫描', value: 'scan' },
    ]},
    { type: 'select' as const, label: '攻击者区域', options: [
      { label: '全部', value: '' }, { label: '国内', value: 'domestic' }, { label: '国外', value: 'foreign' },
    ]},
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  return (
    <div className="protection-page">
      <div className="protection-toolbar">
        <button className="toolbar-btn">⚙ 攻击类型设置</button>
        <button className="toolbar-btn">📺 投屏</button>
        <button className="toolbar-btn">🔍 溯源分析工具</button>
        <button className="toolbar-btn">🔄 刷新</button>
      </div>

      <FilterBar filters={filters} />

      <div className="protection-charts">
        <div className="protection-chart-card">
          <div className="chart-card-header">
            <h4>攻击者分布TOP10</h4>
            <div className="chart-tabs">
              <div className={`chart-tab ${distTab === 'domestic' ? 'active' : ''}`} onClick={() => setDistTab('domestic')}>国内</div>
              <div className={`chart-tab ${distTab === 'foreign' ? 'active' : ''}`} onClick={() => setDistTab('foreign')}>国外</div>
            </div>
          </div>
          <div className="chart-card-body">
            <ReactECharts option={{
              tooltip: { trigger: 'item' },
              series: [{
                type: 'pie',
                radius: ['40%', '65%'],
                data: distData.map((d, i) => ({
                  value: d.value,
                  name: d.name,
                  itemStyle: { color: ['#1890ff','#52c41a','#faad14','#ff4d4f','#722ed1','#13c2c2','#fa8c16','#eb2f96','#2f54eb','#a0d911'][i] },
                })),
                label: { formatter: '{b}: {c}', fontSize: 11 },
              }],
            }} style={{ height: 280 }} />
          </div>
        </div>

        <div className="protection-chart-card">
          <div className="chart-card-header"><h4>攻击者TOP10</h4></div>
          <div className="chart-card-body">
            <ReactECharts option={{
              tooltip: { trigger: 'axis' },
              xAxis: { type: 'value', axisLabel: { fontSize: 11 } },
              yAxis: { type: 'category', data: [...attackerTop10].reverse().map(a => a.ip), axisLabel: { fontSize: 11 } },
              series: [{ type: 'bar', data: [...attackerTop10].reverse().map(a => a.attacks), itemStyle: { color: '#1890ff' }, barWidth: 16 }],
              grid: { left: 120, right: 20, top: 10, bottom: 20 },
            }} style={{ height: 280 }} />
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={attackerTop10} />
    </div>
  );
};

const Protection: React.FC = () => (
  <Routes>
    <Route index element={<ProtectionOverview />} />
    <Route path="realtime" element={<ProtectionRealtime />} />
    <Route path="block" element={<ProtectionBlock />} />
    <Route path="threat-intel" element={<ProtectionThreatIntel />} />
    <Route path="exposure" element={<ProtectionExposure />} />
  </Routes>
);

export default Protection;
