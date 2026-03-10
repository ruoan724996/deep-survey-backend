# 🎯 大模型深度交流群筛选问卷系统

**开发时间：** 2026-03-08  
**开发者：** 涛涛（AI 助手）  
**技术栈：** HTML + Express.js + Railway 部署

---

## 📁 项目结构

```
~/.openclaw/workspace/
├── deep 交流筛选问卷.html          # 前端问卷页面
└── deep-survey-backend/           # 后端服务
    ├── package.json               # 依赖配置
    ├── server.js                  # Express 服务器
    ├── railway.json               # Railway 部署配置
    └── .env.example               # 环境变量示例
```

---

## 🚀 快速部署

### 方式 1：Railway 部署（推荐）

#### 1. 安装 Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. 登录 Railway
```bash
railway login
```

#### 3. 初始化项目
```bash
cd ~/.openclaw/workspace/deep-survey-backend
railway init
```

#### 4. 设置环境变量
```bash
railway variables set PORT=3000
railway variables set API_SECRET=your-secret-key
```

#### 5. 部署
```bash
railway up
```

#### 6. 绑定域名（可选）
```bash
railway domain
```

**部署成功后会获得一个公网 URL，例如：**
```
https://deep-survey-production.up.railway.app
```

---

### 方式 2：本地测试

#### 1. 安装依赖
```bash
cd ~/.openclaw/workspace/deep-survey-backend
npm install
```

#### 2. 创建环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，设置 API_SECRET
```

#### 3. 启动服务
```bash
npm start
```

#### 4. 访问
打开浏览器访问：http://localhost:3000

---

## 📋 功能特点

### 前端特性
- ✅ 响应式设计（手机/PC 适配）
- ✅ 实时进度条
- ✅ 字数统计（参与动机）
- ✅ 表单验证（必填项、邮箱格式、字数限制）
- ✅ 友好的错误提示
- ✅ 提交成功页面 + 后续流程说明

### 后端特性
- ✅ Express.js 轻量服务器
- ✅ CORS 跨域支持
- ✅ 表单验证（必填字段、邮箱格式、字数限制）
- ✅ 数据临时存储（内存）
- ✅ 提交列表 API（带认证）
- ✅ 健康检查接口

### 筛选逻辑
**自动验证：**
- ✅ 邮箱必填且格式正确
- ✅ 参与动机至少 20 字
- ✅ 所有必填项完整

**人工审核维度：**
- ⭐ 大模型使用经验（深度用户优先）
- ⭐ 项目经验（完成过项目优先）
- ⭐ 时间投入（每周至少 1-2 次）
- ⭐ 参与动机（认真程度）
- ⭐ 能分享的内容（技术/案例/资源）

---

## 🔧 API 接口

### 提交问卷
```
POST /api/submit
Content-Type: application/json

请求体：
{
  "姓名": "张三",
  "部门单位": "技术部",
  "邮箱": "zhangsan@example.com",
  "微信手机号": "13800138000",
  "使用经验": "经常使用（每天）",
  "使用场景": ["代码开发", "文档写作"],
  "项目经验": "完成过多个项目",
  "参与动机": "希望能与同行深度交流...",
  "时间投入": "每周能参与 3 次以上",
  "能分享": ["技术方案分享", "实战案例分享"],
  "期望": "技术交流和项目合作",
  "其他建议": ""
}

响应：
{
  "success": true,
  "message": "提交成功",
  "id": 1
}
```

### 获取提交列表
```
GET /api/submissions
Authorization: Bearer your-secret-key

响应：
{
  "success": true,
  "data": [
    {
      "id": 1,
      "姓名": "张三",
      "邮箱": "zhangsan@example.com",
      ...
      "submittedAt": "2026-03-08T14:30:00.000Z"
    }
  ]
}
```

### 健康检查
```
GET /health

响应：
{
  "status": "ok",
  "timestamp": "2026-03-08T14:30:00.000Z",
  "submissions": 42
}
```

---

## 📊 数据管理

### 方式 1：通过 API 获取
```bash
curl -H "Authorization: Bearer your-secret-key" \
     https://your-app.railway.app/api/submissions
```

### 方式 2：集成飞书多维表格（推荐）

在 `server.js` 中添加飞书集成：

```javascript
// 提交时同步到飞书表格
async function submitToFeishuBitable(data) {
    const appToken = process.env.FEISHU_APP_TOKEN;
    const tableId = process.env.FEISHU_TABLE_ID;
    
    // 调用飞书 API 创建记录
    // ...
}
```

### 方式 3：导出 CSV
添加一个导出接口：
```javascript
app.get('/api/export', (req, res) => {
    const csv = submissions.map(s => 
        `${s.姓名},${s.邮箱},${s.使用经验},...`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
    res.send(csv);
});
```

---

## 🎯 使用流程

### 1. 部署上线
```bash
cd deep-survey-backend
railway up
```

### 2. 获取问卷链接
部署成功后获得 URL，例如：
```
https://deep-survey-production.up.railway.app
```

### 3. 发布到 200 人大群
在群里发送：
```
📋 【大模型深度交流群 - 成员筛选调研】

为了促进大模型技术的深度交流，我们计划组建一个深度交流群。
本群面向有实际经验和强烈学习意愿的同行，定期组织技术分享、案例研讨和项目合作。

👉 填写问卷：https://your-app.railway.app

⏰ 截止时间：3 天后
📧 入群方式：审核通过后通过邮箱发送邀请
🎯 预计筛选：30-50 人
```

### 4. 审核流程
1. 每天查看提交数据
2. 根据筛选规则审核
3. 通过的发送入群邀请邮件
4. 拉群

### 5. 后续运营
- 每周话题讨论
- 每月技术分享
- 项目合作对接
- 不定期线下聚会

---

## 🔒 安全建议

### 生产环境配置
1. **修改 API_SECRET**
   ```bash
   railway variables set API_SECRET=strong-random-secret
   ```

2. **启用 HTTPS**（Railway 默认启用）

3. **添加速率限制**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 分钟
       max: 5 // 每个 IP 最多 5 次提交
   });
   
   app.use('/api/submit', limiter);
   ```

4. **数据持久化**
   - 使用数据库（MongoDB/PostgreSQL）
   - 或集成飞书多维表格

---

## 📈 预期效果

- **问卷发放：** 200 人
- **目标回收：** 80-100 份
- **目标通过：** 30-50 人
- **审核时间：** 1-3 天

---

## 🛠️ 技术优化建议

### 短期（本周）
- [ ] 集成飞书多维表格（自动存储提交数据）
- [ ] 添加导出 CSV 功能
- [ ] 添加邮件通知（审核通过/不通过）

### 中期（本月）
- [ ] 添加管理后台（审核界面）
- [ ] 添加数据统计（图表展示）
- [ ] 添加批量邮件发送

### 长期
- [ ] 用户登录系统
- [ ] 审核流程自动化
- [ ] 群活动管理功能

---

## 📞 联系方式

**开发者：** 涛涛（AI 助手）  
**维护者：** 田福成  
**最后更新：** 2026-03-08

---

## 🎉 总结

这是一个完整的问卷系统，包括：
- ✅ 精美的前端界面
- ✅ 完整的后端 API
- ✅ Railway 部署配置
- ✅ 数据验证和筛选逻辑
- ✅ 易于扩展的架构

**下一步：**
1. 部署到 Railway
2. 测试提交功能
3. 发布到 200 人大群
4. 开始审核和拉群

祝顺利！🚀
