import React from 'react';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../../components/common/DataTable';
import './AnalysisBehavior.css';

const mockBehaviors = [
  { entity: '10.0.12.55', entityType: 'IP', score: 95, behavior: '大量端口扫描', deviation: '严重偏离', firstAnomaly: '2026-03-20 14:20:00', lastAnomaly: '2026-03-22 10:15:00' },
  { entity: '张三(学生)', entityType: '用户', score: 88, behavior: '异常时段登录', deviation: '严重偏离', firstAnomaly: '2026-03-19 02:30:00', lastAnomaly: '2026-03-22 03:10:00' },
  { entity: '172.16.8.201', entityType: 'IP', score: 82, behavior: '异常外联频率', deviation: '严重偏离', firstAnomaly: '2026-03-18 22:00:00', lastAnomaly: '2026-03-22 08:45:00' },
  { entity: '赵六(管理员)', entityType: '用户', score: 75, behavior: '越权访问尝试', deviation: '中度偏离', firstAnomaly: '2026-03-21 09:00:00', lastAnomaly: '2026-03-22 07:30:00' },
  { entity: '192.168.100.33', entityType: 'IP', score: 70, behavior: '流量突增', deviation: '中度偏离', firstAnomaly: '2026-03-20 16:45:00', lastAnomaly: '2026-03-22 06:20:00' },
  { entity: '孙七(学生)', entityType: '用户', score: 65, behavior: '异常数据下载', deviation: '中度偏离', firstAnomaly: '2026-03-21 13:00:00', lastAnomaly: '2026-03-21 18:20:00' },
  { entity: '10.0.20.177', entityType: 'IP', score: 58, behavior: '多次认证失败', deviation: '轻度偏离', firstAnomaly: '2026-03-21 20:10:00', lastAnomaly: '2026-03-22 01:30:00' },
  { entity: '李四(教职工)', entityType: '用户', score: 52, behavior: '非常用设备登录', deviation: '轻度偏离', firstAnomaly: '2026-03-22 08:00:00', lastAnomaly: '2026-03-22 09:15:00' },
  { entity: '10.0.5.88', entityType: 'IP', score: 45, behavior: '定时外联行为', deviation: '轻度偏离', firstAnomaly: '2026-03-15 00:00:00', lastAnomaly: '2026-03-22 00:00:00' },
  { entity: '周八(教职工)', entityType: '用户', score: 40, behavior: '访问敏感资源', deviation: '轻度偏离', firstAnomaly: '2026-03-21 10:30:00', lastAnomaly: '2026-03-21 16:10:00' },
];

const AnalysisBehavior: React.FC = () => {
  const stats = [
    { label: '监控实体', value: '3,480', color: 'var(--primary)' },
    { label: '异常实体', value: '156', color: 'var(--danger)' },
    { label: '高危行为', value: '23', color: '#722ed1' },
    { label: '基线偏离', value: '89', color: 'var(--warning)' },
  ];

  const lineOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['异常数', '基线值'], bottom: 0, textStyle: { fontSize: 12 } },
    grid: { left: 50, right: 30, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: ['03-16', '03-17', '03-18', '03-19', '03-20', '03-21', '03-22'],
      axisLabel: { fontSize: 11 },
    },
    yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
    series: [
      {
        name: '异常数',
        type: 'line',
        smooth: true,
        data: [18, 25, 32, 28, 45, 38, 42],
        itemStyle: { color: '#ff4d4f' },
        areaStyle: { color: 'rgba(255,77,79,0.08)' },
      },
      {
        name: '基线值',
        type: 'line',
        smooth: true,
        data: [20, 20, 22, 21, 22, 21, 22],
        itemStyle: { color: '#1890ff' },
        lineStyle: { type: 'dashed' },
      },
    ],
  };

  const columns: Column[] = [
    { key: 'entity', title: '实体(IP/用户)' },
    { key: 'entityType', title: '实体类型', width: 80 },
    { key: 'score', title: '异常评分', width: 80 },
    { key: 'behavior', title: '异常行为' },
    { key: 'deviation', title: '偏离程度', width: 90, render: (v: string) => (
      <span className={v === '严重偏离' ? 'deviation-high' : v === '中度偏离' ? 'deviation-medium' : 'deviation-low'}>{v}</span>
    )},
    { key: 'firstAnomaly', title: '首次异常', width: 150 },
    { key: 'lastAnomaly', title: '最近异常', width: 150 },
    { key: 'op', title: '操作', width: 70, render: () => <button className="op-btn">详情</button> },
  ];

  return (
    <div className="analysis-behavior-page">
      <div className="analysis-behavior-stats">
        {stats.map(s => (
          <div className="analysis-behavior-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="analysis-behavior-chart">
        <h3>异常行为趋势</h3>
        <ReactECharts option={lineOption} style={{ height: 280 }} />
      </div>
      <DataTable columns={columns} data={mockBehaviors} />
    </div>
  );
};

export default AnalysisBehavior;
