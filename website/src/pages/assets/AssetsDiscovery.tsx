import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './AssetsDiscovery.css';

const stats = [
  { label: '已发现资产', value: 1523, color: 'var(--primary)' },
  { label: '已纳管', value: 1408, color: 'var(--success)' },
  { label: '待确认', value: 85, color: 'var(--warning)' },
  { label: '新发现(今日)', value: 12, color: 'var(--danger)' },
];

const filters = [
  { type: 'date' as const, label: '发现时间' },
  { type: 'select' as const, label: '状态', options: [{ label: '全部', value: '' }, { label: '已纳管', value: '已纳管' }, { label: '待确认', value: '待确认' }, { label: '已忽略', value: '已忽略' }] },
  { type: 'select' as const, label: '设备类型', options: [{ label: '全部', value: '' }, { label: '服务器', value: '服务器' }, { label: '终端', value: '终端' }, { label: '物联网', value: '物联网' }, { label: '网络设备', value: '网络设备' }] },
  { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
];

const tableData = [
  { ip: '10.0.5.21', mac: 'AA:BB:CC:11:22:33', type: '服务器', ports: '22,80,443', subnet: '10.0.5.0/24', time: '2026-03-22 09:15', status: '待确认' },
  { ip: '10.0.5.22', mac: 'AA:BB:CC:11:22:34', type: '终端', ports: '135,445', subnet: '10.0.5.0/24', time: '2026-03-22 09:15', status: '已纳管' },
  { ip: '192.168.3.10', mac: 'DD:EE:FF:44:55:66', type: '物联网', ports: '80,8080', subnet: '192.168.3.0/24', time: '2026-03-22 08:30', status: '待确认' },
  { ip: '192.168.3.15', mac: 'DD:EE:FF:44:55:67', type: '网络设备', ports: '22,161', subnet: '192.168.3.0/24', time: '2026-03-22 08:30', status: '已纳管' },
  { ip: '172.16.2.100', mac: '11:22:33:AA:BB:CC', type: '终端', ports: '3389', subnet: '172.16.2.0/24', time: '2026-03-21 16:00', status: '已纳管' },
  { ip: '172.16.2.105', mac: '11:22:33:AA:BB:CD', type: '服务器', ports: '22,3306,8080', subnet: '172.16.2.0/24', time: '2026-03-21 16:00', status: '已纳管' },
  { ip: '10.0.6.8', mac: '55:66:77:DD:EE:FF', type: '物联网', ports: '80,554', subnet: '10.0.6.0/24', time: '2026-03-21 14:20', status: '已忽略' },
  { ip: '10.0.6.12', mac: '55:66:77:DD:EE:F0', type: '终端', ports: '22,80', subnet: '10.0.6.0/24', time: '2026-03-21 14:20', status: '待确认' },
  { ip: '192.168.4.50', mac: '88:99:AA:11:22:33', type: '服务器', ports: '22,443,8443', subnet: '192.168.4.0/24', time: '2026-03-21 10:45', status: '已纳管' },
  { ip: '192.168.4.55', mac: '88:99:AA:11:22:34', type: '网络设备', ports: '22,23,161', subnet: '192.168.4.0/24', time: '2026-03-21 10:45', status: '已纳管' },
];

const AssetsDiscovery: React.FC = () => {
  const columns: Column[] = [
    { key: 'ip', title: '发现IP', width: 120 },
    { key: 'mac', title: 'MAC地址', width: 150 },
    { key: 'type', title: '设备类型(推测)', width: 110 },
    { key: 'ports', title: '开放端口', width: 120 },
    { key: 'subnet', title: '所属网段', width: 130 },
    { key: 'time', title: '发现时间', width: 140 },
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`discovery-status-tag ${v === '已纳管' ? 'managed' : v === '待确认' ? 'pending' : 'ignored'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 110, render: (_: any, row: any) => (
      <div style={{ display: 'flex', gap: 4 }}>
        {row.status === '待确认' && <button className="op-btn">纳管</button>}
        {row.status === '待确认' && <button className="op-btn">忽略</button>}
      </div>
    )},
  ];

  return (
    <div className="assets-discovery-page">
      <div className="discovery-stats">
        {stats.map(s => (
          <div className="discovery-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value.toLocaleString()}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>资产发现列表</h3></div>
        <div className="monitor-section-body">
          <FilterBar filters={filters} />
          <DataTable columns={columns} data={tableData} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default AssetsDiscovery;
