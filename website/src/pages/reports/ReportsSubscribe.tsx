import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import './ReportsSubscribe.css';

const tableData = [
  { name: '每日安全摘要', type: '安全日报', freq: '每日', receiver: '张明, 李华', method: '邮件', nextTime: '2026-03-23 08:00', enabled: true },
  { name: '周度威胁报告', type: '安全周报', freq: '每周', receiver: '王强, 赵丽', method: '企业微信', nextTime: '2026-03-29 09:00', enabled: true },
  { name: '月度资产报告', type: '资产报告', freq: '每月', receiver: '刘伟', method: '邮件', nextTime: '2026-04-01 08:00', enabled: true },
  { name: '安全态势月报', type: '安全月报', freq: '每月', receiver: '陈刚, 张明', method: '邮件', nextTime: '2026-04-01 08:00', enabled: false },
  { name: '威胁情报周刊', type: '威胁分析报告', freq: '每周', receiver: '赵丽', method: '企业微信', nextTime: '2026-03-29 10:00', enabled: true },
  { name: '资产变更通知', type: '资产报告', freq: '每日', receiver: '李华, 王强', method: '邮件', nextTime: '2026-03-23 09:00', enabled: false },
];

const ReportsSubscribe: React.FC = () => {
  const columns: Column[] = [
    { key: 'name', title: '订阅名称' },
    { key: 'type', title: '报告类型', width: 110 },
    { key: 'freq', title: '发送频率', width: 80 },
    { key: 'receiver', title: '接收人', width: 130 },
    { key: 'method', title: '发送方式', width: 90 },
    { key: 'nextTime', title: '下次发送时间', width: 140 },
    { key: 'enabled', title: '状态', width: 70, render: (v: boolean) => (
      <span className={`subscribe-status-tag ${v ? 'on' : 'off'}`}>{v ? '启用' : '停用'}</span>
    )},
    { key: 'op', title: '操作', width: 110, render: () => (
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="op-btn">编辑</button>
        <button className="op-btn danger">删除</button>
      </div>
    )},
  ];

  return (
    <div className="reports-subscribe-page">
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>报告订阅</h3></div>
        <div className="monitor-section-body">
          <div className="subscribe-toolbar">
            <button className="subscribe-add-btn">新建订阅</button>
          </div>
          <DataTable columns={columns} data={tableData} showPagination={false} />
        </div>
      </div>
    </div>
  );
};

export default ReportsSubscribe;
