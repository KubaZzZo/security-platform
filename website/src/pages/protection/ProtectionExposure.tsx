import React from 'react';
import ReactECharts from 'echarts-for-react';
import DataTable, { Column } from '../../components/common/DataTable';
import './ProtectionExposure.css';

const mockData = [
  { ip: '10.1.2.100', port: '80, 443, 8080', service: 'Nginx Web Server', protocol: 'HTTP/HTTPS', risk: '高危', area: '教学区', time: '2024-03-15 08:00:00', suggestion: '关闭8080端口，启用WAF防护' },
  { ip: '10.1.3.50', port: '22, 3306', service: 'MySQL + SSH', protocol: 'TCP', risk: '高危', area: '科研区', time: '2024-03-15 08:00:00', suggestion: '限制SSH访问源IP，MySQL禁止外网访问' },
  { ip: '10.1.1.200', port: '21, 80', service: 'FTP + Apache', protocol: 'FTP/HTTP', risk: '高危', area: '行政区', time: '2024-03-14 20:00:00', suggestion: '关闭FTP服务，迁移至SFTP' },
  { ip: '10.2.1.10', port: '445, 139', service: 'SMB共享服务', protocol: 'SMB', risk: '高危', area: '宿舍区', time: '2024-03-14 20:00:00', suggestion: '关闭SMB服务，存在永恒之蓝漏洞风险' },
  { ip: '10.1.4.30', port: '8443, 9090', service: 'Tomcat管理后台', protocol: 'HTTPS', risk: '中危', area: '教学区', time: '2024-03-14 08:00:00', suggestion: '限制管理后台访问IP范围' },
  { ip: '10.3.1.50', port: '6379', service: 'Redis', protocol: 'TCP', risk: '中危', area: '科研区', time: '2024-03-14 08:00:00', suggestion: '设置访问密码，绑定内网IP' },
  { ip: '10.2.2.100', port: '23', service: 'Telnet', protocol: 'TCP', risk: '中危', area: '宿舍区', time: '2024-03-13 20:00:00', suggestion: '禁用Telnet，改用SSH' },
  { ip: '10.5.1.20', port: '80, 443', service: '图书馆门户', protocol: 'HTTP/HTTPS', risk: '低危', area: '图书馆', time: '2024-03-13 20:00:00', suggestion: 'SSL证书即将过期，建议续期' },
  { ip: '10.1.5.80', port: '161', service: 'SNMP服务', protocol: 'UDP', risk: '中危', area: '行政区', time: '2024-03-13 08:00:00', suggestion: '升级至SNMPv3，修改默认community' },
  { ip: '10.5.2.10', port: '3389', service: '远程桌面', protocol: 'RDP', risk: '低危', area: '图书馆', time: '2024-03-13 08:00:00', suggestion: '启用NLA认证，限制访问源IP' },
];

const ProtectionExposure: React.FC = () => {
  const columns: Column[] = [
    { key: 'ip', title: '资产IP', width: 110 },
    { key: 'port', title: '暴露端口', width: 110 },
    { key: 'service', title: '服务名称', width: 140 },
    { key: 'protocol', title: '协议', width: 90 },
    { key: 'risk', title: '风险等级', width: 80, render: (v: string) => {
      const cls = v === '高危' ? 'risk-high' : v === '中危' ? 'risk-medium' : 'risk-low';
      return <span className={`exposure-risk-tag ${cls}`}>{v}</span>;
    }},
    { key: 'area', title: '所属区域', width: 80 },
    { key: 'time', title: '发现时间', width: 160 },
    { key: 'suggestion', title: '建议措施' },
    { key: 'op', title: '操作', width: 60, render: () => <button className="op-btn">处置</button> },
  ];

  const barOption = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['高危', '中危', '低危'], textStyle: { fontSize: 11 } },
    xAxis: { type: 'category' as const, data: ['宿舍区', '教学区', '行政区', '科研区', '图书馆'], axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value' as const, axisLabel: { fontSize: 11 } },
    series: [
      { name: '高危', type: 'bar', stack: 'total', data: [8, 6, 4, 3, 2], itemStyle: { color: '#ff4d4f' }, barWidth: 28 },
      { name: '中危', type: 'bar', stack: 'total', data: [18, 15, 12, 14, 8], itemStyle: { color: '#faad14' } },
      { name: '低危', type: 'bar', stack: 'total', data: [15, 12, 14, 10, 15], itemStyle: { color: '#52c41a' } },
    ],
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
  };

  return (
    <div className="protection-exposure-page">
      <div className="exposure-stats-row">
        <div className="exposure-stat-card">
          <span className="stat-label">暴露服务数</span>
          <span className="stat-value">156</span>
        </div>
        <div className="exposure-stat-card high">
          <span className="stat-label">高危暴露</span>
          <span className="stat-value">23</span>
        </div>
        <div className="exposure-stat-card medium">
          <span className="stat-label">中危暴露</span>
          <span className="stat-value">67</span>
        </div>
        <div className="exposure-stat-card low">
          <span className="stat-label">低危暴露</span>
          <span className="stat-value">66</span>
        </div>
      </div>

      <div className="exposure-chart-card">
        <div className="chart-card-header"><h4>各区域暴露面统计</h4></div>
        <div className="chart-card-body"><ReactECharts option={barOption} style={{ height: 280 }} /></div>
      </div>

      <DataTable columns={columns} data={mockData} />
    </div>
  );
};

export default ProtectionExposure;
