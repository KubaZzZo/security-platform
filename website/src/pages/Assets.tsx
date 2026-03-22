import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { assetOverview } from '../data/mockData';
import AssetsManage from './assets/AssetsManage';
import AssetsBaseline from './assets/AssetsBaseline';
import AssetsDiscovery from './assets/AssetsDiscovery';
import AssetsConfig from './assets/AssetsConfig';
import './Assets.css';

const AssetsOverview: React.FC = () => {
  return (
    <div className="assets-page">
      <div className="assets-cards">
        {assetOverview.cards.map(card => (
          <div className="assets-card" key={card.title}>
            <div className="card-value" style={{ color: card.color }}>{card.value}</div>
            <div className="card-label">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="assets-section">
        <div className="assets-section-header">基线异常统计</div>
        <div className="assets-section-body">
          <div className="assets-charts-row">
            <ReactECharts option={{
              tooltip: { trigger: 'item' },
              series: [{
                type: 'pie',
                radius: ['50%', '70%'],
                data: assetOverview.baselineDistribution.map(d => ({
                  value: d.value, name: d.name, itemStyle: { color: d.color },
                })),
                label: { formatter: '{b}: {c}', fontSize: 12 },
              }],
            }} style={{ height: 260 }} />

            <ReactECharts option={{
              tooltip: { trigger: 'axis' },
              legend: { data: ['合规', '不合规'], top: 0, textStyle: { fontSize: 12 } },
              xAxis: { type: 'category', data: assetOverview.baselineTrend.dates, axisLabel: { fontSize: 11 } },
              yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
              series: [
                { name: '合规', type: 'line', data: assetOverview.baselineTrend.compliant, smooth: true, itemStyle: { color: '#52c41a' }, areaStyle: { color: 'rgba(82,196,26,0.1)' } },
                { name: '不合规', type: 'line', data: assetOverview.baselineTrend.nonCompliant, smooth: true, itemStyle: { color: '#ff4d4f' }, areaStyle: { color: 'rgba(255,77,79,0.1)' } },
              ],
              grid: { left: 50, right: 20, top: 40, bottom: 30 },
            }} style={{ height: 260 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Assets: React.FC = () => (
  <Routes>
    <Route index element={<AssetsOverview />} />
    <Route path="manage" element={<AssetsManage />} />
    <Route path="baseline" element={<AssetsBaseline />} />
    <Route path="discovery" element={<AssetsDiscovery />} />
    <Route path="config" element={<AssetsConfig />} />
  </Routes>
);

export default Assets;
