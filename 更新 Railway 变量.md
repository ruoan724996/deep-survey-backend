# Railway 环境变量更新脚本

## 方法 1：使用 Railway CLI（推荐）

### 安装 CLI
```bash
npm install -g @railway/cli
```

### 登录
```bash
railway login
```

### 选择项目
```bash
cd ~/.openclaw/workspace/projects/deep-survey-backend
railway link
```

### 设置环境变量（无引号）
```bash
railway variables set FEISHU_APP_ID=cli_a90981de3c78dcc8
railway variables set FEISHU_APP_SECRET=RQ0RCFDrxfIelhQvgzHLJbp7C3agHnaq
railway variables set FEISHU_APP_TOKEN=MMwsb70JkaDngbs8P5ecXGllnse
railway variables set FEISHU_TABLE_ID=tbl2gzsqHM113dTJ
railway variables set PORT=3000
railway variables set NODE_ENV=production
```

### 验证变量
```bash
railway variables
```

### 重新部署
```bash
railway up
```

---

## 方法 2：网页手动更新

1. 登录 https://railway.app
2. 找到 `deep-survey-backend` 项目
3. 点击 **Variables** 标签
4. **删除所有现有变量**（点击每个变量旁的 🗑️）
5. 点击 **New Variable** 逐个添加：

```
FEISHU_APP_ID=cli_a90981de3c78dcc8
FEISHU_APP_SECRET=RQ0RCFDrxfIelhQvgzHLJbp7C3agHnaq
FEISHU_APP_TOKEN=MMwsb70JkaDngbs8P5ecXGllnse
FEISHU_TABLE_ID=tbl2gzsqHM113dTJ
PORT=3000
NODE_ENV=production
```

6. 添加完成后，Railway 会自动重新部署

---

## 验证部署

### 健康检查
```bash
curl https://deep-survey-backend-production.up.railway.app/health
```

### 测试提交
```bash
curl -X POST https://deep-survey-backend-production.up.railway.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "姓名":"测试",
    "部门单位":"测试",
    "邮箱":"test@example.com",
    "使用经验":"经常使用（每天）",
    "使用场景":["代码开发"],
    "项目经验":"完成过多个项目",
    "参与动机":"希望能与同行深度交流大模型技术应用经验",
    "时间投入":"每周能参与 3 次以上",
    "能分享":["技术方案分享"],
    "期望":"技术交流"
  }'
```

---

## 常见问题

### Q: Raw Editor 显示引号怎么办？
A: 不要用 Raw Editor，用单个变量添加方式。

### Q: 更新后还是报错？
A: 点击 Deployments → 找到最新部署 → 点击 ⋮ → Redeploy 强制重新部署。

### Q: 如何确认变量是否正确？
A: 使用 `railway variables` 命令查看，值应该没有引号。

---

## 联系

有问题随时联系！
