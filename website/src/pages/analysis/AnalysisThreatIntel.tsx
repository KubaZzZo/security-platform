import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import './AnalysisThreatIntel.css';

const mockIntel = [
  { ioc: '203.0.113.45', iocType: 'IP', threatType: 'C2服务器', confidence: 95, source: '国家互联网应急中心', firstSeen: '2026-03-10', lastMatch: '2026-03-22 10:00:00', relatedEvents: 12 },
  { ioc: 'malware.evil-domain.com', iocType: '域名', threatType: '钓鱼域名', confidence: 90, source: '微步在线', firstSeen: '2026-03-15', lastMatch: '2026-03-22 09:30:00', relatedEvents: 8 },
  { ioc: 'e3b0c44298fc1c149afb', iocType: 'Hash', threatType: '勒索软件', confidence: 98, source: 'VirusTotal', firstSeen: '2026-03-08', lastMatch: '2026-03-21 22:15:00', relatedEvents: 3 },
  { ioc: '198.51.100.12', iocType: 'IP', threatType: '扫描节点', confidence: 75, source: 'AlienVault OTX', firstSeen: '2026-03-18', lastMatch: '2026-03-21 18:00:00', relatedEvents: 15 },
  { ioc: 'http://bad-url.com/payload', iocType: 'URL', threatType: '恶意下载', confidence: 88, source: '奇安信威胁情报', firstSeen: '2026-03-20', lastMatch: '2026-03-21 16:45:00', relatedEvents: 5 },
  { ioc: '172.16.254.1', iocType: 'IP', threatType: '僵尸网络', confidence: 82, source: '国家互联网应急中心', firstSeen: '2026-03-12', lastMatch: '2026-03-21 14:30:00', relatedEvents: 20 },
  { ioc: 'd41d8cd98f00b204e980', iocType: 'Hash', threatType: '木马程序', confidence: 92, source: 'VirusTotal', firstSeen: '2026-03-05', lastMatch: '2026-03-21 11:00:00', relatedEvents: 7 },
  { ioc: 'phishing-campus.xyz', iocType: '域名', threatType: '钓鱼域名', confidence: 85, source: '微步在线', firstSeen: '2026-03-19', lastMatch: '2026-03-21 09:20:00', relatedEvents: 4 },
  { ioc: '10.255.0.1', iocType: 'IP', threatType: '挖矿节点', confidence: 70, source: 'AlienVault OTX', firstSeen: '2026-03-16', lastMatch: '2026-03-20 23:00:00', relatedEvents: 9 },
  { ioc: 'http://exploit-kit.net/js', iocType: 'URL', threatType: '漏洞利用', confidence: 78, source: '奇安信威胁情报', firstSeen: '2026-03-14', lastMatch: '2026-03-20 17:30:00', relatedEvents: 6 },
];

const AnalysisThreatIntel: React.FC = () => {
  const stats = [
    { label: '情报源', value: '8', color: 'var(--primary)' },
    { label: 'IOC总数', value: '45,678', color: '#722ed1' },
    { label: '今日匹配', value: '234', color: 'var(--warning)' },
    { label: '活跃威胁', value: '89', color: 'var(--danger)' },
  ];

  const filters = [
    { type: 'select' as const, label: '情报来源', options: [
      { label: '全部', value: '' }, { label: '国家互联网应急中心', value: 'cncert' },
      { label: '微步在线', value: 'threatbook' }, { label: 'VirusTotal', value: 'vt' },
      { label: 'AlienVault OTX', value: 'otx' }, { label: '奇安信威胁情报', value: 'qianxin' },
    ]},
    { type: 'select' as const, label: 'IOC类型', options: [
      { label: '全部', value: '' }, { label: 'IP', value: 'ip' },
      { label: '域名', value: 'domain' }, { label: 'Hash', value: 'hash' }, { label: 'URL', value: 'url' },
    ]},
    { type: 'input' as const, placeholder: '搜索IOC' },
  ];

  const columns: Column[] = [
    { key: 'ioc', title: 'IOC值' },
    { key: 'iocType', title: 'IOC类型', width: 70 },
    { key: 'threatType', title: '威胁类型', width: 90 },
    { key: 'confidence', title: '置信度', width: 100, render: (v: number) => (
      <div className="confidence-bar-wrapper">
        <div className="confidence-bar" style={{ width: `${v}%`, background: v >= 90 ? 'var(--danger)' : v >= 70 ? 'var(--warning)' : 'var(--success)' }} />
        <span className="confidence-text">{v}%</span>
      </div>
    )},
    { key: 'source', title: '情报来源', width: 140 },
    { key: 'firstSeen', title: '首次发现', width: 100 },
    { key: 'lastMatch', title: '最近匹配', width: 150 },
    { key: 'relatedEvents', title: '关联事件数', width: 90 },
    { key: 'op', title: '操作', width: 70, render: () => <button className="op-btn">详情</button> },
  ];

  return (
    <div className="analysis-threat-intel-page">
      <div className="analysis-threat-intel-stats">
        {stats.map(s => (
          <div className="analysis-threat-intel-stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <FilterBar filters={filters} />
      <DataTable columns={columns} data={mockIntel} />
    </div>
  );
};

export default AnalysisThreatIntel;
