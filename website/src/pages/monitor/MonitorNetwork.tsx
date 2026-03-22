import React from 'react';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../../components/common/DataTable';
import './MonitorNetwork.css';

const stats = [
  { label: '实时吞吐量', value: '8.6 Gbps', color: '#1890ff' },
  { label: '活跃IP数', value: '12,458', color: '#722ed1' },
  { label: '当前连接数', value: '856,432', color: '#faad14' },
  { label: '今日流量', value: '2.8 TB', color: '#52c41a' },
];

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const mbpsData = [320, 280, 210, 180, 160, 150, 200, 450, 680, 820, 910, 880, 850, 920, 960, 1020, 980, 1100, 1050, 900, 780, 620, 480, 380];
const ppsData = [45, 38, 30, 25, 22, 20, 28, 62, 95, 115, 128, 124, 120, 130, 135, 142, 138, 155, 148, 126, 108, 86, 66, 52];

const throughputOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['吞吐量(Mbps)', '包速率(Kpps)'], top: 0, textStyle: { fontSize: 12 } },
  grid: { left: 60, right: 60, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: hours, axisLabel: { fontSize: 11, interval: 2 } },
  yAxis: [
    { type: 'value', name: 'Mbps', axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { type: 'dashed' } } },
    { type: 'value', name: 'Kpps', axisLabel: { fontSize: 11 }, splitLine: { show: false } },
  ],
  series: [
    { name: '吞吐量(Mbps)', type: 'line', data: mbpsData, smooth: true, itemStyle: { color: '#1890ff' }, areaStyle: { color: 'rgba(24,144,255,0.1)' } },
    { name: '包速率(Kpps)', type: 'line', yAxisIndex: 1, data: ppsData, smooth: true, itemStyle: { color: '#faad14' }, lineStyle: { type: 'dashed' } },
  ],
};

const protocolOption = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { fontSize: 12 } },
  series: [{
    type: 'pie',
    radius: ['40%', '65%'],
    center: ['35%', '50%'],
    label: { show: false },
    data: [
      { value: 35, name: 'HTTP', itemStyle: { color: '#1890ff' } },
      { value: 28, name: 'HTTPS', itemStyle: { color: '#52c41a' } },
      { value: 12, name: 'DNS', itemStyle: { color: '#faad14' } },
      { value: 8, name: 'SSH', itemStyle: { color: '#722ed1' } },
      { value: 5, name: 'SMTP', itemStyle: { color: '#13c2c2' } },
      { value: 3, name: 'IMAP', itemStyle: { color: '#eb2f96' } },
      { value: 2, name: 'FTP', itemStyle: { color: '#fa8c16' } },
      { value: 2, name: 'MySQL', itemStyle: { color: '#a0d911' } },
      { value: 5, name: 'Others', itemStyle: { color: '#bfbfbf' } },
    ],
  }],
};

const topKData = [
  { rank: 1, srcIp: '192.168.1.105', dstIp: '10.0.1.8', protocol: 'HTTPS', flow: 2458, packets: 1842560, duration: '02:15:33' },
  { rank: 2, srcIp: '172.16.3.42', dstIp: '10.0.2.3', protocol: 'HTTP', flow: 1836, packets: 1356800, duration: '01:48:12' },
  { rank: 3, srcIp: '192.168.2.88', dstIp: '10.0.0.1', protocol: 'DNS', flow: 1524, packets: 986420, duration: '03:22:05' },
  { rank: 4, srcIp: '10.0.3.22', dstIp: '172.16.8.15', protocol: 'MySQL', flow: 1280, packets: 845600, duration: '01:30:45' },
  { rank: 5, srcIp: '192.168.5.67', dstIp: '10.0.1.15', protocol: 'SSH', flow: 968, packets: 624300, duration: '04:12:18' },
  { rank: 6, srcIp: '172.16.9.100', dstIp: '10.0.0.50', protocol: 'HTTPS', flow: 856, packets: 568200, duration: '00:55:30' },
  { rank: 7, srcIp: '192.168.4.55', dstIp: '10.0.2.9', protocol: 'HTTP', flow: 742, packets: 485600, duration: '01:12:08' },
  { rank: 8, srcIp: '10.0.1.20', dstIp: '172.16.2.18', protocol: 'FTP', flow: 685, packets: 425800, duration: '00:42:55' },
  { rank: 9, srcIp: '192.168.3.201', dstIp: '10.0.0.5', protocol: 'SMTP', flow: 524, packets: 328400, duration: '02:05:12' },
  { rank: 10, srcIp: '172.16.7.88', dstIp: '10.0.1.8', protocol: 'HTTPS', flow: 468, packets: 286500, duration: '00:38:22' },
];

const MonitorNetwork: React.FC = () => {
  const columns: Column[] = [
    { key: 'rank', title: '排名', width: 60 },
    { key: 'srcIp', title: '源IP', width: 140 },
    { key: 'dstIp', title: '目的IP', width: 130 },
    { key: 'protocol', title: '协议', width: 80 },
    { key: 'flow', title: '流量(MB)', width: 100 },
    { key: 'packets', title: '包数', width: 100, render: (v: number) => v.toLocaleString() },
    { key: 'duration', title: '持续时间', width: 100 },
    { key: 'op', title: '操作', width: 70, render: () => (
      <button className="table-action-btn">详情</button>
    )},
  ];

  return (
    <div className="monitor-network-page">
      <div className="monitor-network-stats">
        {stats.map(s => (
          <div className="monitor-network-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="monitor-network-charts">
        <div className="monitor-section">
          <div className="monitor-section-header"><h3>实时吞吐量趋势</h3></div>
          <div className="monitor-section-body">
            <ReactECharts option={throughputOption} style={{ height: 300 }} />
          </div>
        </div>
        <div className="monitor-section">
          <div className="monitor-section-header"><h3>应用协议分布</h3></div>
          <div className="monitor-section-body">
            <ReactECharts option={protocolOption} style={{ height: 300 }} />
          </div>
        </div>
      </div>
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>Top-K 大流监控</h3></div>
        <div className="monitor-section-body">
          <DataTable columns={columns} data={topKData} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default MonitorNetwork;
