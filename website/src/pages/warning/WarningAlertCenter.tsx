import React from 'react';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './WarningAlertCenter.css';

const mockData = [
  { id: 'YJ-2024-0891', title: 'Apache Log4j2远程代码执行漏洞预警', level: '高危', source: '国家互联网应急中心', scope: '全校Web服务器', time: '2024-03-15 09:23:00', status: '待处理' },
  { id: 'YJ-2024-0890', title: '校园网DNS劫持攻击预警', level: '高危', source: '自动检测', scope: 'DNS服务器集群', time: '2024-03-15 08:45:00', status: '处理中' },
  { id: 'YJ-2024-0889', title: 'Windows SMB协议漏洞利用预警', level: '中危', source: '教育行业安全中心', scope: '教学区终端', time: '2024-03-14 16:30:00', status: '已处理' },
  { id: 'YJ-2024-0888', title: '校园VPN暴力破解攻击预警', level: '高危', source: '自动检测', scope: 'VPN网关', time: '2024-03-14 14:12:00', status: '处理中' },
  { id: 'YJ-2024-0887', title: 'Redis未授权访问漏洞预警', level: '中危', source: '国家互联网应急中心', scope: '科研区服务器', time: '2024-03-14 11:05:00', status: '待处理' },
  { id: 'YJ-2024-0886', title: 'SSL证书即将过期预警', level: '低危', source: '自动检测', scope: '门户网站', time: '2024-03-13 17:40:00', status: '已处理' },
  { id: 'YJ-2024-0885', title: '异常流量突增预警', level: '中危', source: '自动检测', scope: '宿舍区出口', time: '2024-03-13 15:22:00', status: '待处理' },
  { id: 'YJ-2024-0884', title: 'MySQL弱口令扫描预警', level: '低危', source: '教育行业安全中心', scope: '数据库集群', time: '2024-03-13 10:18:00', status: '已处理' },
];

const trendData = {
  days: ['03-09', '03-10', '03-11', '03-12', '03-13', '03-14', '03-15'],
  values: [8, 12, 6, 15, 10, 18, 14],
};

const WarningAlertCenter: React.FC = () => {
  const columns: Column[] = [
    { key: 'id', title: '预警编号', width: 130 },
    { key: 'title', title: '预警标题' },
    { key: 'level', title: '预警级别', width: 80, render: (v: string) => {
      const cls = v === '高危' ? 'severity-high' : v === '中危' ? 'severity-medium' : 'severity-low';
      return <span className={`alert-severity-tag ${cls}`}>{v}</span>;
    }},
    { key: 'source', title: '预警来源', width: 160 },
    { key: 'scope', title: '影响范围', width: 120 },
    { key: 'time', title: '发布时间', width: 160 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => {
      const cls = v === '待处理' ? 'status-pending' : v === '处理中' ? 'status-processing' : 'status-done';
      return <span className={`alert-status-tag ${cls}`}>{v}</span>;
    }},
    { key: 'op', title: '操作', width: 100, render: () => (
      <><button className="op-btn">查看</button> <button className="op-btn">处置</button></>
    )},
  ];

  const filters = [
    { type: 'date' as const, label: '时间范围' },
    { type: 'select' as const, label: '预警级别', options: [
      { label: '全部', value: '' }, { label: '高危', value: 'high' }, { label: '中危', value: 'medium' }, { label: '低危', value: 'low' },
    ]},
    { type: 'select' as const, label: '预警来源', options: [
      { label: '全部', value: '' }, { label: '国家互联网应急中心', value: 'cert' }, { label: '教育行业安全中心', value: 'edu' }, { label: '自动检测', value: 'auto' },
    ]},
    { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
  ];

  const lineOption = {
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'category' as const, data: trendData.days, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value' as const, axisLabel: { fontSize: 11 } },
    series: [{
      type: 'line',
      data: trendData.values,
      smooth: true,
      itemStyle: { color: '#1890ff' },
      areaStyle: { color: 'rgba(24,144,255,0.15)' },
    }],
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
  };

  return (
    <div className="warning-alert-center-page">
      <div className="alert-stats-row">
        <div className="alert-stat-card">
          <span className="stat-label">活跃预警</span>
          <span className="stat-value">23</span>
        </div>
        <div className="alert-stat-card high">
          <span className="stat-label">高危预警</span>
          <span className="stat-value">5</span>
        </div>
        <div className="alert-stat-card medium">
          <span className="stat-label">中危预警</span>
          <span className="stat-value">12</span>
        </div>
        <div className="alert-stat-card low">
          <span className="stat-label">低危预警</span>
          <span className="stat-value">6</span>
        </div>
      </div>

      <div className="alert-chart-card">
        <div className="chart-card-header"><h4>预警趋势</h4></div>
        <div className="chart-card-body">
          <ReactECharts option={lineOption} style={{ height: 240 }} />
        </div>
      </div>

      <FilterBar filters={filters} />
      <DataTable columns={columns} data={mockData} />
    </div>
  );
};

export default WarningAlertCenter;
