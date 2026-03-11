# Railway 部署快速指南

## 方式 1：网页部署（最简单）

1. 访问 https://railway.app
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 授权 Railway 访问 GitHub
6. 选择仓库：`ruoan724996/deep-survey-backend`
7. 点击 "Deploy"

### 配置环境变量

部署后，在 Railway 项目页面：
1. 点击项目卡片
2. 切换到 "Variables" 标签
3. 添加以下变量：

```
FEISHU_APP_ID=cli_a90981de3c78dcc8
FEISHU_APP_SECRET=RQ0RCFDrxfIelhQvgzHLJbp7C3agHnaq
FEISHU_APP_TOKEN=MMwsb70JkaDngbs8P5ecXGllnse
FEISHU_TABLE_ID=tblWbQxbHNiKk5gB
PORT=3000
NODE_ENV=production
```

### 获取域名

部署成功后：
1. 点击 "Settings" 标签
2. 找到 "Domains" 部分
3. 复制生成的域名（如：`xxx-production.up.railway.app`）

### 更新前端配置

修改 `deep 交流筛选问卷.html` 中的 API 地址：

```javascript
const API_BASE_URL = 'https://你的域名.railway.app/api';
```

然后推送到 GitHub。

---

## 方式 2：CLI 部署

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
cd ~/.openclaw/workspace/projects/deep-survey-backend
railway init

# 选择 "Create new project"

# 设置环境变量
railway variables set FEISHU_APP_ID=cli_a90981de3c78dcc8
railway variables set FEISHU_APP_SECRET=RQ0RCFDrxfIelhQvgzHLJbp7C3agHnaq
railway variables set FEISHU_APP_TOKEN=MMwsb70JkaDngbs8P5ecXGllnse
railway variables set FEISHU_TABLE_ID=tblWbQxbHNiKk5gB
railway variables set PORT=3000

# 部署
railway up

# 绑定域名
railway domain
```

---

## 验证部署

部署完成后，测试 API：

```bash
# 健康检查
curl https://你的域名.railway.app/health

# 测试提交
curl -X POST https://你的域名.railway.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "姓名":"测试",
    "部门单位":"测试部门",
    "邮箱":"test@example.com",
    "使用经验":"经常使用",
    "使用场景":["代码开发"],
    "项目经验":"完成过项目",
    "参与动机":"希望能与同行交流大模型技术，提升应用能力",
    "时间投入":"每周 3 次以上",
    "能分享":["技术方案"],
    "期望":"技术交流"
  }'
```

---

## 常见问题

### 404 错误
- 检查 Railway 项目是否正在运行
- 检查域名是否正确
- 查看 Railway 日志

### 500 错误
- 检查环境变量是否配置正确
- 查看 Railway 日志中的错误信息
- 确认飞书配置是否正确

### 飞书提交失败
- 检查飞书 App 权限
- 确认表格字段名称匹配
- 查看后端日志

---

## 联系

有问题随时联系！
