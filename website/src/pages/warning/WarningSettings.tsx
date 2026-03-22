import React from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import './WarningSettings.css';

const ruleData = [
  { name: 'DDoS流量阈值检测', type: '流量异常', condition: '入站流量 > 500Mbps 持续5分钟', level: '高危', status: '启用' },
  { name: '端口扫描频率检测', type: '扫描探测', condition: '同一IP扫描端口 > 100个/分钟', level: '中危', status: '启用' },
  { name: '异常登录检测', type: '身份认证', condition: '同一账号失败登录 > 5次/10分钟', level: '中危', status: '启用' },
  { name: 'SQL注入攻击检测', type: 'Web攻击', condition: '请求中包含SQL注入特征 > 3次/分钟', level: '高危', status: '启用' },
  { name: '恶意文件下载检测', type: '恶意软件', condition: '检测到已知恶意文件Hash', level: '高危', status: '停用' },
  { name: 'DNS隧道检测', type: '隐蔽通道', condition: 'DNS请求频率 > 200次/分钟且域名熵值异常', level: '低危', status: '启用' },
];

const WarningSettings: React.FC = () => {
  const ruleColumns: Column[] = [
    { key: 'name', title: '规则名称' },
    { key: 'type', title: '检测类型', width: 100 },
    { key: 'condition', title: '触发条件' },
    { key: 'level', title: '预警级别', width: 80, render: (v: string) => {
      const cls = v === '高危' ? 'severity-high' : v === '中危' ? 'severity-medium' : 'severity-low';
      return <span className={`alert-severity-tag ${cls}`}>{v}</span>;
    }},
    { key: 'status', title: '状态', width: 80, render: (v: string) => (
      <span className={`settings-status-tag ${v === '启用' ? 'enabled' : 'disabled'}`}>{v}</span>
    )},
    { key: 'op', title: '操作', width: 60, render: () => <button className="op-btn">编辑</button> },
  ];

  return (
    <div className="warning-settings-page">
      <div className="settings-section">
        <div className="settings-section-header"><h4>预警接收配置</h4></div>
        <div className="settings-section-body">
          <div className="settings-form-group">
            <label>接收方式</label>
            <div className="checkbox-group">
              <label><input type="checkbox" defaultChecked /> 邮件通知</label>
              <label><input type="checkbox" defaultChecked /> 短信通知</label>
              <label><input type="checkbox" /> 企业微信</label>
              <label><input type="checkbox" defaultChecked /> 系统消息</label>
            </div>
          </div>
          <div className="settings-form-group">
            <label>接收级别</label>
            <div className="checkbox-group">
              <label><input type="checkbox" defaultChecked /> 高危</label>
              <label><input type="checkbox" defaultChecked /> 中危</label>
              <label><input type="checkbox" /> 低危</label>
            </div>
          </div>
          <div className="settings-form-group">
            <label>接收时间</label>
            <select defaultValue="all">
              <option value="all">全天</option>
              <option value="work">工作时间 8:00-18:00</option>
              <option value="custom">自定义</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header"><h4>预警规则配置</h4></div>
        <div className="settings-section-body">
          <DataTable columns={ruleColumns} data={ruleData} />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header"><h4>通知模板</h4></div>
        <div className="settings-section-body">
          <div className="template-cards">
            <div className="template-card">
              <span className="template-name">邮件模板</span>
              <span className="template-desc">用于发送预警邮件通知，支持HTML格式，包含预警详情和处置建议。</span>
              <button className="op-btn">编辑</button>
            </div>
            <div className="template-card">
              <span className="template-name">短信模板</span>
              <span className="template-desc">用于发送预警短信通知，限制70字以内，包含预警级别和简要描述。</span>
              <button className="op-btn">编辑</button>
            </div>
            <div className="template-card">
              <span className="template-name">企业微信模板</span>
              <span className="template-desc">用于推送企业微信消息卡片，支持Markdown格式，包含快捷处置链接。</span>
              <button className="op-btn">编辑</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningSettings;
