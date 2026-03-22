import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import './GlobalView.css';

const areaData = [
  { name: '宿舍区', devices: 4200, online: 3856, traffic: 3.2, alerts: 12, color: '#1890ff' },
  { name: '教学区', devices: 1860, online: 1720, traffic: 2.1, alerts: 5, color: '#52c41a' },
  { name: '行政区', devices: 680, online: 645, traffic: 0.8, alerts: 3, color: '#722ed1' },
  { name: '科研区', devices: 520, online: 498, traffic: 1.5, alerts: 8, color: '#fa8c16' },
  { name: '图书馆', devices: 360, online: 342, traffic: 0.6, alerts: 1, color: '#13c2c2' },
  { name: '体育场馆', devices: 120, online: 108, traffic: 0.2, alerts: 0, color: '#eb2f96' },
];

const overviewStats = [
  { label: '全网设备总数', value: '7,742', color: '#1890ff' },
  { label: '在线设备', value: '7,169', color: '#52c41a' },
  { label: '实时总吞吐量', value: '8.4 Gbps', color: '#722ed1' },
  { label: '活跃IP数', value: '12,458', color: '#fa8c16' },
  { label: '今日告警', value: '29', color: '#ff4d4f' },
  { label: '安全评分', value: '85', color: '#52c41a' },
];

const trafficTrend = {
  hours: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
  dormitory: [1.2,0.8,0.4,0.3,1.5,2.0,2.8,2.5,2.2,3.0,3.5,2.8],
  teaching: [0.1,0.05,0.02,0.1,1.8,2.2,1.5,2.1,2.0,1.2,0.3,0.1],
  admin: [0.05,0.02,0.01,0.05,0.6,0.8,0.7,0.8,0.7,0.4,0.1,0.05],
  research: [0.8,0.6,0.5,0.4,1.0,1.2,1.0,1.5,1.4,1.2,1.0,0.9],
};

const recentAlerts = [
  { time: '14:30', area: '科研区', content: 'SQL注入攻击检测', level: '高' },
  { time: '14:25', area: '宿舍区', content: '异常外联行为告警', level: '中' },
  { time: '14:20', area: '教学区', content: '暴力破解尝试', level: '高' },
  { time: '14:15', area: '宿舍区', content: '挖矿流量检测', level: '中' },
  { time: '14:10', area: '行政区', content: '弱口令登录告警', level: '低' },
  { time: '14:05', area: '科研区', content: '数据库异常访问', level: '中' },
];

const GlobalView: React.FC = () => {
  const [dimension, setDimension] = useState<'traffic' | 'devices'>('traffic');

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category' as const, data: areaData.map(a => a.name), axisLabel: { fontSize: 12 } },
    yAxis: { type: 'value' as const, name: dimension === 'traffic' ? '流量 (Gbps)' : '设备数', axisLabel: { fontSize: 11 } },
    series: [{
      type: 'bar',
      data: areaData.map(a => ({
        value: dimension === 'traffic' ? a.traffic : a.devices,
        itemStyle: { color: a.color },
      })),
      barWidth: 36,
      label: { show: true, position: 'top' as const, fontSize: 12, fontWeight: 'bold' as const },
    }],
    grid: { left: 60, right: 20, top: 40, bottom: 30 },
  };

  const lineOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['宿舍区', '教学区', '行政区', '科研区'], top: 0, textStyle: { fontSize: 11 } },
    xAxis: { type: 'category' as const, data: trafficTrend.hours, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value' as const, name: 'Gbps', axisLabel: { fontSize: 11 } },
    series: [
      { name: '宿舍区', type: 'line', data: trafficTrend.dormitory, smooth: true, itemStyle: { color: '#1890ff' } },
      { name: '教学区', type: 'line', data: trafficTrend.teaching, smooth: true, itemStyle: { color: '#52c41a' } },
      { name: '行政区', type: 'line', data: trafficTrend.admin, smooth: true, itemStyle: { color: '#722ed1' } },
      { name: '科研区', type: 'line', data: trafficTrend.research, smooth: true, itemStyle: { color: '#fa8c16' } },
    ],
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
  };

  return (
    <div className="global-view-page">
      <div className="global-stats">
        {overviewStats.map(s => (
          <div className="global-stat-card" key={s.label}>
            <div className="global-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="global-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="global-row">
        <div className="global-section">
          <div className="global-section-header">
            <h3>区域流量/设备概览</h3>
            <div className="global-tabs">
              <span className={`global-tab ${dimension === 'traffic' ? 'active' : ''}`} onClick={() => setDimension('traffic')}>流量</span>
              <span className={`global-tab ${dimension === 'devices' ? 'active' : ''}`} onClick={() => setDimension('devices')}>设备</span>
            </div>
          </div>
          <div className="global-section-body">
            <ReactECharts option={barOption} style={{ height: 300 }} />
          </div>
        </div>

        <div className="global-section">
          <div className="global-section-header"><h3>各区域流量趋势</h3></div>
          <div className="global-section-body">
            <ReactECharts option={lineOption} style={{ height: 300 }} />
          </div>
        </div>
      </div>

      <div className="global-row">
        <div className="global-section" style={{ flex: 2 }}>
          <div className="global-section-header"><h3>区域详情</h3></div>
          <div className="global-section-body">
            <div className="area-cards">
              {areaData.map(area => (
                <div className="area-card" key={area.name}>
                  <div className="area-card-header" style={{ borderLeftColor: area.color }}>
                    <span className="area-name">{area.name}</span>
                    {area.alerts > 0 && <span className="area-alert-badge">{area.alerts}</span>}
                  </div>
                  <div className="area-card-body">
                    <div className="area-metric"><span>设备总数</span><span style={{ fontWeight: 600 }}>{area.devices.toLocaleString()}</span></div>
                    <div className="area-metric"><span>在线</span><span style={{ color: '#52c41a', fontWeight: 600 }}>{area.online.toLocaleString()}</span></div>
                    <div className="area-metric"><span>流量</span><span style={{ color: area.color, fontWeight: 600 }}>{area.traffic} Gbps</span></div>
                    <div className="area-metric"><span>在线率</span><span style={{ fontWeight: 600 }}>{(area.online / area.devices * 100).toFixed(1)}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="global-section" style={{ flex: 1 }}>
          <div className="global-section-header"><h3>最新告警</h3></div>
          <div className="global-section-body">
            <div className="alert-list">
              {recentAlerts.map((a, i) => (
                <div className="alert-item" key={i}>
                  <span className="alert-time">{a.time}</span>
                  <span className={`alert-level-dot level-${a.level === '高' ? 'high' : a.level === '中' ? 'medium' : 'low'}`} />
                  <span className="alert-area">[{a.area}]</span>
                  <span className="alert-content">{a.content}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalView;
