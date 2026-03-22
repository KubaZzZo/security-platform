import React from 'react';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../../components/common/DataTable';
import './ProtectionThreatIntel.css';

const mockData = [
  { ioc: '103.45.67.0/24', type: 'IP', tag: 'APT攻击', confidence: 95, hits: 234, lastHit: '2024-03-15 10:12:00', source: '国家威胁情报中心' },
  { ioc: 'evil-domain.example.com', type: '域名', tag: '钓鱼攻击', confidence: 88, hits: 156, lastHit: '2024-03-15 09:45:00', source: '教育行业情报共享' },
  { ioc: 'a1b2c3d4e5f6...', type: 'Hash', tag: '勒索软件', confidence: 92, hits: 12, lastHit: '2024-03-15 08:30:00', source: '开源情报社区' },
  { ioc: '185.23.45.0/24', type: 'IP', tag: '僵尸网络', confidence: 78, hits: 89, lastHit: '2024-03-14 22:15:00', source: '国家威胁情报中心' },
  { ioc: 'malware-c2.example.net', type: '域名', tag: '挖矿木马', confidence: 85, hits: 67, lastHit: '2024-03-14 18:40:00', source: '安全厂商情报' },
  { ioc: 'f7e8d9c0b1a2...', type: 'Hash', tag: '勒索软件', confidence: 90, hits: 5, lastHit: '2024-03-14 15:20:00', source: '开源情报社区' },
  { ioc: '91.234.56.0/24', type: 'IP', tag: 'APT攻击', confidence: 72, hits: 345, lastHit: '2024-03-14 12:05:00', source: '安全厂商情报' },
  { ioc: 'phishing-site.example.org', type: '域名', tag: '钓鱼攻击', confidence: 65, hits: 23, lastHit: '2024-03-13 20:30:00', source: '教育行业情报共享' },
  { ioc: '45.67.89.0/24', type: 'IP', tag: '僵尸网络', confidence: 82, hits: 178, lastHit: '2024-03-13 16:45:00', source: '国家威胁情报中心' },
  { ioc: 'c3d4e5f6a7b8...', type: 'Hash', tag: '挖矿木马', confidence: 58, hits: 8, lastHit: '2024-03-13 11:10:00', source: '开源情报社区' },
];

const ProtectionThreatIntel: React.FC = () => {
  const columns: Column[] = [
    { key: 'ioc', title: 'IOC值', width: 180 },
    { key: 'type', title: '类型', width: 70, render: (v: string) => <span className="threat-type-tag">{v}</span> },
    { key: 'tag', title: '威胁标签', width: 100 },
    { key: 'confidence', title: '置信度', width: 140, render: (v: number) => {
      const cls = v >= 80 ? 'high' : v >= 60 ? 'medium' : 'low';
      return (
        <div className="confidence-bar">
          <div className="bar-track"><div className={`bar-fill ${cls}`} style={{ width: `${v}%` }} /></div>
          <span className="bar-text">{v}%</span>
        </div>
      );
    }},
    { key: 'hits', title: '命中次数', width: 80 },
    { key: 'lastHit', title: '最近命中', width: 160 },
    { key: 'source', title: '来源', width: 140 },
    { key: 'op', title: '操作', width: 120, render: () => (
      <><button className="op-btn">加入封锁</button> <button className="op-btn">详情</button></>
    )},
  ];

  const barOption = {
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'category' as const, data: ['03-09', '03-10', '03-11', '03-12', '03-13', '03-14', '03-15'], axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value' as const, axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', data: [120, 98, 145, 167, 134, 189, 167], itemStyle: { color: '#1890ff' }, barWidth: 24 }],
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
  };

  const hBarOption = {
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'value' as const, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'category' as const, data: ['钓鱼攻击', '僵尸网络', '挖矿木马', '勒索软件', 'APT攻击'], axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', data: [156, 267, 189, 98, 345], itemStyle: { color: '#722ed1' }, barWidth: 18 }],
    grid: { left: 80, right: 20, top: 10, bottom: 20 },
  };

  return (
    <div className="protection-threat-intel-page">
      <div className="threat-stats-row">
        <div className="threat-stat-card">
          <span className="stat-label">情报源</span>
          <span className="stat-value">12</span>
        </div>
        <div className="threat-stat-card">
          <span className="stat-label">活跃IOC</span>
          <span className="stat-value">8,956</span>
        </div>
        <div className="threat-stat-card">
          <span className="stat-label">今日命中</span>
          <span className="stat-value">167</span>
        </div>
        <div className="threat-stat-card danger">
          <span className="stat-label">高危情报</span>
          <span className="stat-value">234</span>
        </div>
      </div>

      <div className="threat-charts">
        <div className="threat-chart-card">
          <div className="chart-card-header"><h4>情报命中趋势</h4></div>
          <div className="chart-card-body"><ReactECharts option={barOption} style={{ height: 260 }} /></div>
        </div>
        <div className="threat-chart-card">
          <div className="chart-card-header"><h4>威胁类型分布</h4></div>
          <div className="chart-card-body"><ReactECharts option={hBarOption} style={{ height: 260 }} /></div>
        </div>
      </div>

      <DataTable columns={columns} data={mockData} />
    </div>
  );
};

export default ProtectionThreatIntel;
