import React from 'react';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../../components/common/DataTable';
import './AssetsBaseline.css';

const stats = [
  { label: '检测资产数', value: 1408, color: 'var(--primary)' },
  { label: '合规', value: 1200, color: 'var(--success)' },
  { label: '不合规', value: 150, color: 'var(--danger)' },
  { label: '未检测', value: 58, color: 'var(--warning)' },
  { label: '合规率', value: '85.2%', color: 'var(--primary)' },
];

const areas = ['宿舍区', '教学区', '行政区', '科研区', '图书馆'];
const compliantData = [280, 320, 210, 240, 150];
const nonCompliantData = [30, 40, 25, 35, 20];

const chartOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['合规', '不合规'], top: 0, textStyle: { fontSize: 12 } },
  xAxis: { type: 'category' as const, data: areas, axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value' as const, axisLabel: { fontSize: 11 } },
  series: [
    { name: '合规', type: 'bar' as const, data: compliantData, itemStyle: { color: '#52c41a' }, barWidth: 20 },
    { name: '不合规', type: 'bar' as const, data: nonCompliantData, itemStyle: { color: '#ff4d4f' }, barWidth: 20 },
  ],
  grid: { left: 50, right: 20, top: 40, bottom: 30 },
};

const tableData = [
  { ip: '10.0.1.15', name: '教务系统服务器', item: '密码复杂度策略', standard: '>=8位含大小写+数字', current: '6位纯数字', result: '不合规', time: '2026-03-22 08:00' },
  { ip: '10.0.1.22', name: '图书馆检索终端', item: '防火墙状态', standard: '已启用', current: '已启用', result: '合规', time: '2026-03-22 08:00' },
  { ip: '10.0.2.8', name: '宿舍门禁控制器', item: '默认端口修改', standard: '非默认端口', current: '默认端口22', result: '不合规', time: '2026-03-22 08:00' },
  { ip: '10.0.3.5', name: '科研数据库主机', item: '补丁更新', standard: '最新补丁', current: '已更新', result: '合规', time: '2026-03-22 08:00' },
  { ip: '192.168.1.100', name: '行政办公终端A', item: '杀毒软件安装', standard: '已安装且运行', current: '已安装', result: '合规', time: '2026-03-22 08:00' },
  { ip: '10.0.4.10', name: '校园监控NVR', item: 'SSH空密码登录', standard: '禁止', current: '允许', result: '不合规', time: '2026-03-22 08:00' },
  { ip: '10.0.2.50', name: '多媒体教室主机', item: '服务配置审计', standard: '仅必要服务', current: '存在多余服务', result: '不合规', time: '2026-03-22 08:00' },
  { ip: '10.0.3.12', name: '实验室GPU服务器', item: '日志审计策略', standard: '已启用', current: '已启用', result: '合规', time: '2026-03-22 08:00' },
  { ip: '172.16.1.5', name: '图书馆自助借还机', item: '账户锁定策略', standard: '5次失败锁定', current: '5次失败锁定', result: '合规', time: '2026-03-22 08:00' },
  { ip: '10.0.1.88', name: '学生信息数据库', item: '端口开放检测', standard: '仅开放必要端口', current: '开放23/3389', result: '不合规', time: '2026-03-22 08:00' },
];

const AssetsBaseline: React.FC = () => {
  const columns: Column[] = [
    { key: 'ip', title: '资产IP', width: 120 },
    { key: 'name', title: '资产名称', width: 140 },
    { key: 'item', title: '检测项', width: 120 },
    { key: 'standard', title: '基线标准' },
    { key: 'current', title: '当前值' },
    { key: 'result', title: '检测结果', width: 80, render: (v: string) => (
      <span className={`baseline-result-tag ${v === '合规' ? 'pass' : 'fail'}`}>{v}</span>
    )},
    { key: 'time', title: '检测时间', width: 140 },
    { key: 'op', title: '操作', width: 80, render: () => (
      <button className="op-btn">修复建议</button>
    )},
  ];

  return (
    <div className="assets-baseline-page">
      <div className="baseline-stats">
        {stats.map(s => (
          <div className="baseline-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>各区域合规情况</h3></div>
        <div className="monitor-section-body">
          <ReactECharts option={chartOption} style={{ height: 280 }} />
        </div>
      </div>
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>基线检测明细</h3></div>
        <div className="monitor-section-body">
          <DataTable columns={columns} data={tableData} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default AssetsBaseline;
