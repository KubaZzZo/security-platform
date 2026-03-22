import React, { useState } from 'react';
import './ReportsSettings.css';

const templates = [
  { icon: '📋', name: '日报模板', desc: '每日安全态势汇总，包含告警、事件、资产概览' },
  { icon: '📊', name: '周报模板', desc: '每周安全趋势分析，含威胁统计与处置情况' },
  { icon: '📈', name: '月报模板', desc: '月度安全运营总结，含合规检测与风险评估' },
  { icon: '📝', name: '自定义模板', desc: '自定义报告内容与格式，灵活配置模块' },
];

const ReportsSettings: React.FC = () => {
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  return (
    <div className="reports-settings-page">
      <div className="monitor-section">
        <div className="monitor-section-header"><h3>报告模板</h3></div>
        <div className="monitor-section-body">
          <div className="template-cards">
            {templates.map(t => (
              <div className="template-card" key={t.name}>
                <div className="template-card-icon">{t.icon}</div>
                <div className="template-card-name">{t.name}</div>
                <div className="template-card-desc">{t.desc}</div>
                <button className="template-edit-btn">编辑</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="monitor-section">
        <div className="monitor-section-header"><h3>发送配置</h3></div>
        <div className="monitor-section-body">
          <div className="settings-form">
            <div className="settings-form-item">
              <label>SMTP服务器</label>
              <input type="text" defaultValue="smtp.campus.edu.cn" />
            </div>
            <div className="settings-form-item">
              <label>发件人邮箱</label>
              <input type="email" defaultValue="security@campus.edu.cn" />
            </div>
            <div className="settings-form-item">
              <label />
              <button className="settings-test-btn">发送测试邮件</button>
            </div>
          </div>
        </div>
      </div>

      <div className="monitor-section">
        <div className="monitor-section-header"><h3>报告水印</h3></div>
        <div className="monitor-section-body">
          <div className="settings-form">
            <div className="settings-form-item">
              <label>启用水印</label>
              <span className="settings-toggle" onClick={() => setWatermarkEnabled(p => !p)}>
                <span className={`settings-toggle-track ${watermarkEnabled ? 'active' : ''}`} />
                <span>{watermarkEnabled ? '已启用' : '已停用'}</span>
              </span>
            </div>
            <div className="settings-form-item">
              <label>水印文字</label>
              <input type="text" defaultValue="智慧校园安全平台-内部文件" disabled={!watermarkEnabled} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSettings;
