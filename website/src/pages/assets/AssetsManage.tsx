import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './AssetsManage.css';

const mockData = [
  { ip: '10.0.1.15', name: '教务系统服务器', type: '服务器', os: 'Linux', area: '教学区', owner: '张明', status: '在线', time: '2025-09-01 10:00' },
  { ip: '10.0.1.22', name: '图书馆检索终端', type: '终端', os: 'Windows', area: '图书馆', owner: '李华', status: '在线', time: '2025-09-05 14:30' },
  { ip: '10.0.2.8', name: '宿舍门禁控制器', type: '物联网', os: 'Linux', area: '宿舍区', owner: '王强', status: '在线', time: '2025-10-12 09:15' },
  { ip: '10.0.3.5', name: '科研数据库主机', type: '数据库', os: 'Linux', area: '科研区', owner: '赵丽', status: '在线', time: '2025-08-20 16:00' },
  { ip: '192.168.1.100', name: '行政办公终端A', type: '终端', os: 'Windows', area: '行政区', owner: '刘伟', status: '离线', time: '2025-11-03 11:20' },
  { ip: '192.168.1.101', name: '行政打印服务器', type: '服务器', os: 'Windows', area: '行政区', owner: '刘伟', status: '在线', time: '2025-07-15 08:45' },
  { ip: '10.0.4.10', name: '校园监控NVR', type: '物联网', os: 'Linux', area: '宿舍区', owner: '陈刚', status: '在线', time: '2025-06-28 13:00' },
  { ip: '10.0.2.50', name: '多媒体教室主机', type: '终端', os: 'Windows', area: '教学区', owner: '张明', status: '离线', time: '2025-12-01 10:30' },
  { ip: '10.0.3.12', name: '实验室GPU服务器', type: '服务器', os: 'Linux', area: '科研区', owner: '赵丽', status: '在线', time: '2025-10-18 15:00' },
  { ip: '172.16.1.5', name: '图书馆自助借还机', type: '物联网', os: 'Linux', area: '图书馆', owner: '李华', status: '在线', time: '2025-11-20 09:00' },
  { ip: '10.0.1.88', name: '学生信息数据库', type: '数据库', os: 'Linux', area: '教学区', owner: '张明', status: '在线', time: '2025-05-10 14:00' },
  { ip: '192.168.2.30', name: '宿舍无线AP控制器', type: '物联网', os: 'Linux', area: '宿舍区', owner: '陈刚', status: '在线', time: '2025-09-22 11:45' },
];

const filters = [
  { type: 'select' as const, label: '资产类型', options: [{ label: '全部', value: '' }, { label: '服务器', value: '服务器' }, { label: '终端', value: '终端' }, { label: '物联网', value: '物联网' }, { label: '数据库', value: '数据库' }] },
  { type: 'select' as const, label: '状态', options: [{ label: '全部', value: '' }, { label: '在线', value: '在线' }, { label: '离线', value: '离线' }] },
  { type: 'select' as const, label: '操作系统', options: [{ label: '全部', value: '' }, { label: 'Windows', value: 'Windows' }, { label: 'Linux', value: 'Linux' }, { label: 'macOS', value: 'macOS' }] },
  { type: 'input' as const, placeholder: '请输入IP搜索' },
  { type: 'button' as const, label: '搜索', buttonType: 'primary' as const },
];

const AssetsManage: React.FC = () => {
  const columns: Column[] = [
    { key: 'ip', title: '资产IP', width: 130 },
    { key: 'name', title: '资产名称' },
    { key: 'type', title: '资产类型', width: 80 },
    { key: 'os', title: '操作系统', width: 80 },
    { key: 'area', title: '所属区域', width: 80 },
    { key: 'owner', title: '责任人', width: 70 },
    { key: 'status', title: '在线状态', width: 80, render: (v: string) => (
      <span><span className="online-dot" style={{ background: v === '在线' ? '#52c41a' : '#bfbfbf' }} />{v}</span>
    )},
    { key: 'time', title: '入库时间', width: 140 },
    { key: 'op', title: '操作', width: 110, render: () => (
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="op-btn">编辑</button>
        <button className="op-btn danger">删除</button>
      </div>
    )},
  ];

  return (
    <div className="assets-manage-page">
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>资产管理</h3></div>
        <div className="monitor-section-body">
          <div className="assets-manage-toolbar">
            <button className="toolbar-btn primary">添加资产</button>
            <button className="toolbar-btn">批量导入</button>
            <button className="toolbar-btn">导出</button>
          </div>
          <FilterBar filters={filters} />
          <DataTable columns={columns} data={mockData} pageSize={10} />
        </div>
      </div>
    </div>
  );
};

export default AssetsManage;
