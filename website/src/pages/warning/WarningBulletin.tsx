import React, { useState } from 'react';
import './WarningBulletin.css';

const mockBulletins = [
  { id: 1, title: '关于加强校园网VPN使用安全的通知', type: '安全通知', time: '2024-03-15 10:00', content: '近期发现多起针对校园VPN的暴力破解攻击，请全校师生及时修改VPN密码，启用双因素认证，避免使用弱口令。信息中心将于本周五对VPN系统进行安全升级。', author: '信息安全中心', reads: 1256 },
  { id: 2, title: '2024年寒假期间网络安全值班安排', type: '系统公告', time: '2024-03-14 16:30', content: '为保障寒假期间校园网络安全稳定运行，现将值班安排通知如下：每日安排2名安全运维人员24小时值守，确保安全事件及时响应处置。', author: '网络管理中心', reads: 892 },
  { id: 3, title: '校园网出口设备升级维护公告', type: '运维通告', time: '2024-03-14 09:15', content: '计划于3月16日凌晨2:00-6:00对校园网出口核心交换设备进行固件升级，届时可能出现短暂网络中断，请各单位提前做好准备。', author: '网络运维部', reads: 2341 },
  { id: 4, title: '关于近期钓鱼邮件攻击的安全提醒', type: '安全通知', time: '2024-03-13 14:20', content: '近期校内多名师生收到伪装为教务系统的钓鱼邮件，请勿点击不明链接，不要在非官方页面输入账号密码。如已误操作请立即修改密码并联系信息安全中心。', author: '信息安全中心', reads: 3102 },
  { id: 5, title: '校园无线网络SSID统一变更通知', type: '系统公告', time: '2024-03-12 11:00', content: '为提升无线网络管理效率，校园无线网络SSID将统一变更为"Campus-WiFi"和"Campus-WiFi-5G"，原有SSID将于3月20日停用。', author: '网络管理中心', reads: 1567 },
  { id: 6, title: '数据中心机房空调系统维护通告', type: '运维通告', time: '2024-03-11 15:45', content: '数据中心机房精密空调将于本周末进行年度维护保养，维护期间将启用备用制冷系统，预计不影响业务运行。', author: '基础设施部', reads: 456 },
  { id: 7, title: '关于开展网络安全等级保护测评的通知', type: '安全通知', time: '2024-03-10 09:30', content: '根据上级主管部门要求，我校将于4月开展信息系统网络安全等级保护测评工作，请各二级单位配合完成系统备案和自查工作。', author: '信息安全中心', reads: 789 },
  { id: 8, title: '校园网IPv6升级改造进展通报', type: '系统公告', time: '2024-03-09 16:00', content: '校园网IPv6升级改造项目已完成核心网络设备的双栈配置，目前正在进行各楼宇接入层设备的升级工作，预计4月底前全面完成。', author: '网络管理中心', reads: 634 },
];

const tabs = ['全部', '安全通知', '系统公告', '运维通告'];

const typeClassMap: Record<string, string> = {
  '安全通知': 'type-security',
  '系统公告': 'type-system',
  '运维通告': 'type-ops',
};

const WarningBulletin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('全部');

  const filtered = activeTab === '全部' ? mockBulletins : mockBulletins.filter(b => b.type === activeTab);

  return (
    <div className="warning-bulletin-page">
      <div className="bulletin-toolbar">
        <span style={{ fontSize: 15, fontWeight: 600 }}>公告栏</span>
        <button className="toolbar-btn">发布公告</button>
      </div>

      <div className="bulletin-tabs">
        {tabs.map(tab => (
          <button key={tab} className={`bulletin-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      <div className="bulletin-list">
        {filtered.map(item => (
          <div className="bulletin-card" key={item.id}>
            <div className="bulletin-card-header">
              <span className="bulletin-title">{item.title}</span>
              <span className={`bulletin-type-tag ${typeClassMap[item.type] || ''}`}>{item.type}</span>
              <span style={{ fontSize: 12, color: 'var(--text-light)', marginLeft: 'auto' }}>{item.time}</span>
            </div>
            <div className="bulletin-card-body">{item.content}</div>
            <div className="bulletin-card-footer">
              <span>发布人: {item.author}</span>
              <span>阅读: {item.reads}</span>
              <span className="view-link">查看详情</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarningBulletin;
