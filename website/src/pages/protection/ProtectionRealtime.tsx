import React from 'react';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../../components/common/DataTable';
import './ProtectionRealtime.css';

const mockAlerts = [
  { time: '2024-03-15 10:23:45', type: 'DDoS攻击', level: '高危', srcIp: '103.45.67.89', dstIp: '10.1.2.100', port: 80, action: '已拦截' },
  { time: '2024-03-15 10:22:31', type: '端口扫描', level: '中危', srcIp: '185.23.45.12', dstIp: '10.1.3.50', port: 22, action: '已告警' },
  { time: '2024-03-15 10:21:18', type: 'SQL注入', level: '高危', srcIp: '91.234.56.78', dstIp: '10.1.1.200', port: 3306, action: '已拦截' },
  { time: '2024-03-15 10:20:05', type: 'XSS攻击', level: '中危', srcIp: '45.67.89.101', dstIp: '10.1.2.150', port: 443, action: '已拦截' },
  { time: '2024-03-15 10:18:52', type: '暴力破解', level: '高危', srcIp: '112.34.56.78', dstIp: '10.1.4.10', port: 22, action: '已拦截' },
  { time: '2024-03-15 10:17:40', type: '端口扫描', level: '低危', srcIp: '203.45.67.23', dstIp: '10.1.5.30', port: 445, action: '已告警' },
  { time: '2024-03-15 10:16:28', type: 'DDoS攻击', level: '高危', srcIp: '78.90.12.34', dstIp: '10.1.1.100', port: 80, action: '已拦截' },
  { time: '2024-03-15 10:15:15', type: 'SQL注入', level: '中危', srcIp: '156.78.90.12', dstIp: '10.1.2.200', port: 8080, action: '已拦截' },
  { time: '2024-03-15 10:14:02', type: '暴力破解', level: '中危', srcIp: '67.89.101.23', dstIp: '10.1.3.10', port: 3389, action: '已告警' },
  { time: '2024-03-15 10:12:50', type: 'XSS攻击', level: '低危', srcIp: '34.56.78.90', dstIp: '10.1.4.50', port: 443, action: '已拦截' },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 80 + 10));
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

const ProtectionRealtime: React.FC = () => {
  const columns: Column[] = [
    { key: 'time', title: '时间', width: 160 },
    { key: 'type', title: '告警类型', width: 100 },
    { key: 'level', title: '威胁等级', width: 80, render: (v: string) => {
      const cls = v === '高危' ? 'severity-high' : v === '中危' ? 'severity-medium' : 'severity-low';
      return <span className={`realtime-severity-tag ${cls}`}>{v}</span>;
    }},
    { key: 'srcIp', title: '攻击源IP', width: 130 },
    { key: 'dstIp', title: '目标IP', width: 120 },
    { key: 'port', title: '目标端口', width: 80 },
    { key: 'action', title: '动作', width: 80, render: (v: string) => (
      <span className={`realtime-action-tag ${v === '已拦截' ? 'action-blocked' : 'action-alerted'}`}>{v}</span>
    )},
    { key: 'op', title: '详情', width: 60, render: () => <button className="op-btn">详情</button> },
  ];

  const lineOption = {
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'category' as const, data: hours, axisLabel: { fontSize: 11, interval: 3 } },
    yAxis: { type: 'value' as const, axisLabel: { fontSize: 11 } },
    series: [{ type: 'line', data: hourlyData, smooth: true, itemStyle: { color: '#1890ff' }, areaStyle: { color: 'rgba(24,144,255,0.15)' } }],
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
  };

  const pieOption = {
    tooltip: { trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      data: [
        { value: 25, name: 'DDoS', itemStyle: { color: '#ff4d4f' } },
        { value: 30, name: '端口扫描', itemStyle: { color: '#faad14' } },
        { value: 15, name: 'SQL注入', itemStyle: { color: '#1890ff' } },
        { value: 12, name: 'XSS', itemStyle: { color: '#52c41a' } },
        { value: 10, name: '暴力破解', itemStyle: { color: '#722ed1' } },
        { value: 8, name: '其他', itemStyle: { color: '#13c2c2' } },
      ],
      label: { formatter: '{b}: {d}%', fontSize: 11 },
    }],
  };

  return (
    <div className="protection-realtime-page">
      <div className="realtime-stats-row">
        <div className="realtime-stat-card">
          <span className="stat-label">今日告警</span>
          <span className="stat-value">486</span>
        </div>
        <div className="realtime-stat-card danger">
          <span className="stat-label">高危</span>
          <span className="stat-value">23</span>
        </div>
        <div className="realtime-stat-card">
          <span className="stat-label">攻击峰值</span>
          <span className="stat-value">1,256次/分</span>
        </div>
        <div className="realtime-stat-card success">
          <span className="stat-label">已拦截</span>
          <span className="stat-value">98.6%</span>
        </div>
      </div>

      <div className="realtime-charts">
        <div className="realtime-chart-card">
          <div className="chart-card-header"><h4>实时告警趋势</h4></div>
          <div className="chart-card-body"><ReactECharts option={lineOption} style={{ height: 260 }} /></div>
        </div>
        <div className="realtime-chart-card">
          <div className="chart-card-header"><h4>告警类型分布</h4></div>
          <div className="chart-card-body"><ReactECharts option={pieOption} style={{ height: 260 }} /></div>
        </div>
      </div>

      <DataTable columns={columns} data={mockAlerts} />
    </div>
  );
};

export default ProtectionRealtime;
