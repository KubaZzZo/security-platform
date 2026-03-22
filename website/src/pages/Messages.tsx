import React, { useState } from 'react';
import './Messages.css';

const messagesData = [
  { id: 1, type: '安全告警', title: '检测到高危SQL注入攻击', content: '来自IP 45.227.253.101的SQL注入攻击已被WAF拦截，目标为教务系统Web服务器(192.168.1.100)，建议检查应用层防护规则。', time: '2024-01-15 14:30', read: false },
  { id: 2, type: '系统通知', title: '安全策略自动更新完成', content: '系统已自动更新IDS规则库至v2024.01.15版本，新增规则23条，更新规则156条。', time: '2024-01-15 14:00', read: false },
  { id: 3, type: '安全告警', title: '宿舍区发现蠕虫传播行为', content: '宿舍区网段10.20.0.0/16检测到疑似蠕虫横向传播行为，已影响3台终端，建议立即排查。', time: '2024-01-15 13:20', read: false },
  { id: 4, type: '运维通知', title: '核心交换机CPU使用率告警', content: '教学区核心交换机(SW-TEACH-CORE-01) CPU使用率达到85%，超过告警阈值80%，请关注。', time: '2024-01-15 12:10', read: true },
  { id: 5, type: '系统通知', title: '安全日报已生成', content: '2024年1月14日安全日报已自动生成，包含安全事件486起，已处置412起，请前往报告中心查看。', time: '2024-01-15 08:00', read: true },
  { id: 6, type: '安全告警', title: '行政区邮件服务器暴力破解', content: '检测到来自多个IP的SSH暴力破解行为，目标为行政区邮件服务器(192.168.2.50)，已自动封锁攻击源IP。', time: '2024-01-14 16:30', read: true },
  { id: 7, type: '运维通知', title: '校园网出口带宽使用率预警', content: '校园网出口带宽使用率达到92%，建议关注是否存在异常大流量或考虑扩容。', time: '2024-01-14 15:00', read: true },
  { id: 8, type: '系统通知', title: '资产扫描任务完成', content: '全网资产扫描任务已完成，共发现资产1523台，其中新发现12台，请前往资产中心确认。', time: '2024-01-14 10:00', read: true },
  { id: 9, type: '安全告警', title: '科研区数据库异常访问', content: '科研区数据库服务器(192.168.3.100)检测到非工作时间的大量数据查询操作，来源IP为内网终端。', time: '2024-01-14 02:30', read: true },
  { id: 10, type: '运维通知', title: '图书馆无线AP固件升级通知', content: '图书馆区域12台无线AP需要进行固件升级，建议在夜间维护窗口执行。', time: '2024-01-13 16:00', read: true },
];

const Messages: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'unread' | 'alert' | 'system' | 'ops'>('all');
  const [readIds, setReadIds] = useState<Set<number>>(new Set(messagesData.filter(m => m.read).map(m => m.id)));

  const filtered = messagesData.filter(m => {
    if (tab === 'unread') return !readIds.has(m.id);
    if (tab === 'alert') return m.type === '安全告警';
    if (tab === 'system') return m.type === '系统通知';
    if (tab === 'ops') return m.type === '运维通知';
    return true;
  });

  const unreadCount = messagesData.filter(m => !readIds.has(m.id)).length;

  const markRead = (id: number) => {
    setReadIds(prev => { const next = new Set(Array.from(prev)); next.add(id); return next; });
  };

  const markAllRead = () => {
    setReadIds(new Set(messagesData.map(m => m.id)));
  };

  const typeColor: Record<string, string> = { '安全告警': '#ff4d4f', '系统通知': '#1890ff', '运维通知': '#fa8c16' };

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h3>消息中心</h3>
        <div className="messages-actions">
          <span className="unread-count">未读消息: {unreadCount}</span>
          <button className="mark-all-btn" onClick={markAllRead}>全部已读</button>
        </div>
      </div>
      <div className="messages-tabs">
        {([['all','全部'],['unread','未读'],['alert','安全告警'],['system','系统通知'],['ops','运维通知']] as const).map(([key, label]) => (
          <div key={key} className={`messages-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key as any)}>{label}</div>
        ))}
      </div>
      <div className="messages-list">
        {filtered.length === 0 ? (
          <div className="messages-empty">暂无消息</div>
        ) : filtered.map(msg => (
          <div key={msg.id} className={`message-item ${!readIds.has(msg.id) ? 'unread' : ''}`} onClick={() => markRead(msg.id)}>
            <div className="message-item-header">
              <div className="message-meta">
                {!readIds.has(msg.id) && <span className="unread-dot" />}
                <span className="message-type-tag" style={{ background: `${typeColor[msg.type]}15`, color: typeColor[msg.type], border: `1px solid ${typeColor[msg.type]}40` }}>{msg.type}</span>
                <span className="message-title">{msg.title}</span>
              </div>
              <span className="message-time">{msg.time}</span>
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
