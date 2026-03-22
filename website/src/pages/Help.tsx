import React, { useState } from 'react';
import './Help.css';

const faqData = [
  { q: '如何查看实时网络流量？', a: '进入「监控中心 > 网络安全」页面，可查看实时吞吐量趋势、应用协议分布及Top-K大流监控数据。支持Mbps和PPS双维度切换。' },
  { q: '如何从宏观概览下钻到单IP详情？', a: '在监控中心概览页面，点击任意安全感知模块中的IP地址，即可跳转至「主机安全」页面查看该IP的详细安全状态、漏洞信息和通信对端变化趋势。' },
  { q: '如何进行流级检索？', a: '进入「分析中心 > 日志检索」页面，支持按源/目的IP、端口、时间范围等维度进行精确检索，类似Wireshark的Web版检索引擎。' },
  { q: '系统支持检测哪些网络威胁？', a: '系统支持检测至少4种典型网络威胁：DDoS分布式拒绝服务攻击、端口扫描攻击、蠕虫病毒传播、钓鱼攻击。同时支持SQL注入、XSS、暴力破解等Web攻击检测。' },
  { q: '如何查看各区域/楼宇的流量情况？', a: '点击顶部导航栏的「全局视角」，可按区域（宿舍区、教学区、行政区、科研区等）查看流量差异，识别流量热点区域。' },
  { q: '如何配置告警通知？', a: '进入「通报预警 > 设置」页面，可配置预警接收方式（邮件/短信/企业微信）、接收级别和预警规则。' },
  { q: '如何导出安全报告？', a: '进入「报告中心 > 手动导出」页面，选择报告类型、时间范围和导出格式（PDF/Word/Excel），点击导出即可。也可在「报告订阅」中设置自动发送。' },
  { q: '如何处置安全威胁？', a: '在「处置中心」可从风险资产、风险用户、威胁三个视角查看待处置项。支持手动处置和自动响应策略，处置记录可在「处置记录」页面查看。' },
];

const shortcuts = [
  { key: 'Ctrl + F', desc: '全局搜索' },
  { key: 'Ctrl + R', desc: '刷新当前页面数据' },
  { key: 'Ctrl + E', desc: '快速导出' },
  { key: 'Esc', desc: '关闭弹窗/返回上级' },
];

const Help: React.FC = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <div className="help-page">
      <div className="help-header">
        <h3>帮助中心</h3>
        <span className="help-version">安全感知平台 V3.0.92</span>
      </div>

      <div className="help-row">
        <div className="help-section" style={{ flex: 2 }}>
          <div className="help-section-header"><h3>常见问题</h3></div>
          <div className="help-section-body">
            <div className="faq-list">
              {faqData.map((item, idx) => (
                <div key={idx} className={`faq-item ${expandedIdx === idx ? 'expanded' : ''}`}>
                  <div className="faq-question" onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}>
                    <span className="faq-icon">{expandedIdx === idx ? '−' : '+'}</span>
                    <span>{item.q}</span>
                  </div>
                  {expandedIdx === idx && <div className="faq-answer">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          <div className="help-section">
            <div className="help-section-header"><h3>快捷键</h3></div>
            <div className="help-section-body">
              {shortcuts.map(s => (
                <div className="shortcut-item" key={s.key}>
                  <kbd className="shortcut-key">{s.key}</kbd>
                  <span className="shortcut-desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="help-section">
            <div className="help-section-header"><h3>系统信息</h3></div>
            <div className="help-section-body">
              <div className="info-item"><span className="info-label">系统名称</span><span>安全感知平台</span></div>
              <div className="info-item"><span className="info-label">版本号</span><span>V3.0.92</span></div>
              <div className="info-item"><span className="info-label">技术架构</span><span>React + TypeScript + ECharts</span></div>
              <div className="info-item"><span className="info-label">数据采集</span><span>支持 10Gbps+ 秒级采样</span></div>
              <div className="info-item"><span className="info-label">协议识别</span><span>HTTP/HTTPS/SSH/DNS/IMAP 等 12 种</span></div>
              <div className="info-item"><span className="info-label">威胁检测</span><span>DDoS/扫描/蠕虫/钓鱼 等 6 类</span></div>
            </div>
          </div>

          <div className="help-section">
            <div className="help-section-header"><h3>联系支持</h3></div>
            <div className="help-section-body">
              <div className="info-item"><span className="info-label">技术支持</span><span>信息化建设处</span></div>
              <div className="info-item"><span className="info-label">联系电话</span><span>0512-65112345</span></div>
              <div className="info-item"><span className="info-label">邮箱</span><span>security@suda.edu.cn</span></div>
              <div className="info-item"><span className="info-label">工作时间</span><span>周一至周五 8:00-17:30</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
