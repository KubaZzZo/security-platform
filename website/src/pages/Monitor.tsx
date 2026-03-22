import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../components/common/DataTable';
import {
  monitorStats, securityRating, hotEvents, serverSecurity,
  terminalSecurity, userSecurity, assetStats, portTop5,
  eubaData, threatEvents, securityBulletins
} from '../data/mockData';
import MonitorEvents from './monitor/MonitorEvents';
import MonitorAlerts from './monitor/MonitorAlerts';
import MonitorHost from './monitor/MonitorHost';
import MonitorNetwork from './monitor/MonitorNetwork';
import './Monitor.css';

const ringOption = (data: { name: string; value: number; color: string }[], total: number) => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['55%', '75%'],
    center: ['50%', '50%'],
    data: data.map(d => ({ value: d.value, name: d.name, itemStyle: { color: d.color } })),
    label: { show: false },
    emphasis: { scale: false },
  }],
  graphic: {
    type: 'text',
    left: 'center',
    top: 'center',
    style: { text: `${total}`, fontSize: 18, fontWeight: 'bold', fill: '#333', textAlign: 'center' },
  },
});

const SenseModule: React.FC<{
  title: string;
  data: typeof serverSecurity;
}> = ({ title, data }) => {
  const columns: Column[] = [
    { key: 'name', title: '名称' },
    { key: 'type', title: '类型' },
    { key: 'riskLevel', title: '风险等级', render: (v: string) => (
      <span className={`severity-tag severity-${v === '高危' ? 'high' : v === '中危' ? 'medium' : 'low'}`}>{v}</span>
    )},
    { key: 'events', title: '安全事件' },
    { key: 'time', title: '时间' },
  ];

  return (
    <div className="monitor-section">
      <div className="monitor-section-header"><h3>{title}</h3></div>
      <div className="monitor-section-body">
        <div className="sense-module">
          <div className="sense-chart">
            <ReactECharts option={ringOption(data.riskDistribution, data.risk)} style={{ width: 130, height: 130 }} />
          </div>
          <div>
            <div className="sense-stats">
              <div className="sense-stat-item">
                <span className="sense-stat-dot" style={{ background: '#52c41a' }} />
                安全 <span className="sense-stat-value">{data.safe}</span>
              </div>
              <div className="sense-stat-item">
                <span className="sense-stat-dot" style={{ background: '#ff4d4f' }} />
                风险 <span className="sense-stat-value">{data.risk}</span>
              </div>
              <div className="sense-stat-item">
                <span className="sense-stat-dot" style={{ background: '#999' }} />
                离线 <span className="sense-stat-value">{data.offline}</span>
              </div>
            </div>
            <DataTable columns={columns} data={data.top5} showPagination={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

const MonitorOverview: React.FC = () => {
  const [bulletinTab, setBulletinTab] = useState('日报');

  const stats = [
    { label: '服务天数', value: monitorStats.serviceDays, icon: '📅', bg: '#1890ff' },
    { label: '待处置风险', value: monitorStats.pendingRisks, icon: '⚠', bg: '#ff4d4f' },
    { label: '告警', value: monitorStats.alerts, icon: '🔔', bg: '#faad14' },
    { label: '安全事件', value: monitorStats.securityEvents, icon: '🛡', bg: '#722ed1' },
  ];

  const bulletinColumns: Column[] = [
    { key: 'id', title: '序号', width: 60 },
    { key: 'title', title: '标题' },
    { key: 'type', title: '类型', width: 80 },
    { key: 'date', title: '日期', width: 120 },
    { key: 'status', title: '状态', width: 80 },
  ];

  const filteredBulletins = securityBulletins.filter(b => bulletinTab === '全部' || b.type === bulletinTab);

  return (
    <div className="monitor-page">
      {/* 顶部统计 */}
      <div className="monitor-stats">
        {stats.map(s => (
          <div className="monitor-stat-card" key={s.label}>
            <div className="monitor-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="monitor-stat-info">
              <h3>{s.value.toLocaleString()}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 综合安全感知 */}
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>综合安全感知</h3></div>
        <div className="monitor-section-body">
          <div className="security-overview">
            <div className="security-score">
              <div className="score-ring">
                <ReactECharts
                  option={{
                    series: [{
                      type: 'gauge',
                      startAngle: 90,
                      endAngle: -270,
                      pointer: { show: false },
                      progress: { show: true, width: 12, itemStyle: { color: securityRating.color } },
                      axisLine: { lineStyle: { width: 12, color: [[1, '#e8e8e8']] } },
                      axisTick: { show: false },
                      splitLine: { show: false },
                      axisLabel: { show: false },
                      detail: { show: false },
                      data: [{ value: securityRating.score }],
                    }],
                  }}
                  style={{ width: 120, height: 120 }}
                />
                <div className="score-text">
                  <div className="score-num" style={{ color: securityRating.color }}>{securityRating.score}</div>
                  <div className="score-label">{securityRating.level}</div>
                </div>
              </div>
            </div>
            <div className="quick-entry">
              <div className="quick-entry-item"><span>待处置风险</span><span style={{ color: '#ff4d4f', fontWeight: 600 }}>{monitorStats.pendingRisks}</span></div>
              <div className="quick-entry-item"><span>待处置告警</span><span style={{ color: '#faad14', fontWeight: 600 }}>{monitorStats.alerts}</span></div>
              <div className="quick-entry-item"><span>安全事件</span><span style={{ color: '#722ed1', fontWeight: 600 }}>{monitorStats.securityEvents}</span></div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>热点事件</div>
              <div className="hot-events">
                {hotEvents.map(e => <span className="hot-tag" key={e}>{e}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 服务器 + 终端 */}
      <div className="monitor-row">
        <SenseModule title="服务器安全感知" data={serverSecurity} />
        <SenseModule title="终端安全感知" data={terminalSecurity} />
      </div>

      {/* 用户安全感知 */}
      <SenseModule title="用户安全感知" data={userSecurity} />

      {/* 资产感知 + 威胁感知 */}
      <div className="monitor-row">
        <div className="monitor-section">
          <div className="monitor-section-header"><h3>资产感知</h3></div>
          <div className="monitor-section-body">
            <div className="asset-sense-cards">
              {Object.entries(assetStats).map(([key, val]) => (
                <div className="asset-sense-card" key={key}>
                  <div className="card-value" style={{ color: 'var(--primary)' }}>{val}</div>
                  <div className="card-label">{{servers:'服务器',terminals:'终端',iot:'物联网',databases:'数据库'}[key]}</div>
                </div>
              ))}
            </div>
            <div className="monitor-row">
              <div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>端口TOP5</div>
                <ReactECharts option={{
                  tooltip: { trigger: 'axis' },
                  xAxis: { type: 'category', data: portTop5.map(p => `${p.port}`), axisLabel: { fontSize: 11 } },
                  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
                  series: [{ type: 'bar', data: portTop5.map(p => p.count), itemStyle: { color: '#1890ff' }, barWidth: 24 }],
                  grid: { left: 50, right: 16, top: 16, bottom: 30 },
                }} style={{ height: 180 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>EUBA趋势</div>
                <ReactECharts option={{
                  tooltip: { trigger: 'axis' },
                  xAxis: { type: 'category', data: eubaData.dates, axisLabel: { fontSize: 11 } },
                  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
                  series: [{ type: 'line', data: eubaData.values, smooth: true, areaStyle: { color: 'rgba(24,144,255,0.15)' }, itemStyle: { color: '#1890ff' } }],
                  grid: { left: 50, right: 16, top: 16, bottom: 30 },
                }} style={{ height: 180 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="monitor-section">
          <div className="monitor-section-header"><h3>威胁感知</h3></div>
          <div className="monitor-section-body">
            <ReactECharts option={{
              tooltip: { trigger: 'axis' },
              xAxis: { type: 'category', data: threatEvents.categories, axisLabel: { fontSize: 11, rotate: 20 } },
              yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
              series: [{ type: 'bar', data: threatEvents.values, itemStyle: { color: '#ff4d4f' }, barWidth: 28 }],
              grid: { left: 50, right: 16, top: 16, bottom: 50 },
            }} style={{ height: 300 }} />
          </div>
        </div>
      </div>

      {/* 安全播报 */}
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>安全播报</h3></div>
        <div className="monitor-section-body">
          <div className="bulletin-tabs">
            {['日报', '周报', '月报', '全部'].map(tab => (
              <div key={tab} className={`bulletin-tab ${bulletinTab === tab ? 'active' : ''}`} onClick={() => setBulletinTab(tab)}>{tab}</div>
            ))}
          </div>
          <DataTable columns={bulletinColumns} data={filteredBulletins} showPagination={false} />
        </div>
      </div>
    </div>
  );
};

const Monitor: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MonitorOverview />} />
      <Route path="events" element={<MonitorEvents />} />
      <Route path="alerts" element={<MonitorAlerts />} />
      <Route path="host" element={<MonitorHost />} />
      <Route path="network" element={<MonitorNetwork />} />
    </Routes>
  );
};

export default Monitor;
