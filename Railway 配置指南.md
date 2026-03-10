# 🚂 Railway 环境变量配置指南

**问题：** 提交时报 500 错误  
**原因：** Railway 环境变量未配置  
**解决：** 按以下步骤配置

---

## ⚠️ 为什么需要配置环境变量？

飞书 App Secret 等敏感信息**不能**硬编码在代码中，必须通过环境变量配置：

1. **安全性** - 避免密钥泄露
2. **灵活性** - 不同环境使用不同配置
3. **最佳实践** - 12 因素应用原则

---

## 📋 配置步骤

### 步骤 1：登录 Railway

访问：https://railway.app

使用 GitHub 账号登录

---

### 步骤 2：找到项目

在项目列表中点击：**`deep-survey-backend`**

---

### 步骤 3：打开 Variables 标签

在项目页面顶部导航栏，点击 **"Variables"**

---

### 步骤 4：添加环境变量

点击 **"New Variable"** 或 **"Raw Editor"**，添加以下变量：

#### 方式 A：逐个添加（推荐）

点击 "New Variable"，依次添加：

```
FEISHU_APP_ID=your-feishu-app-id-here
```

点击 "New Variable"，继续添加：

```
FEISHU_APP_SECRET=your-feishu-app-secret-here
```

重复以上步骤，添加所有变量。

#### 方式 B：批量添加（快速）

点击 "Raw Editor"，粘贴以下内容：

```env
# 飞书应用配置
FEISHU_APP_ID=your-feishu-app-id-here
FEISHU_APP_SECRET=your-feishu-app-secret-here
FEISHU_APP_TOKEN=your-feishu-app-token-here
FEISHU_TABLE_ID=tblwubqz2IHIOVDb

# 服务配置
PORT=3000
NODE_ENV=production
```

点击 "Save" 保存。

---

### 步骤 5：确认配置

配置完成后，Variables 页面应该显示：

| Variable | Value |
|----------|-------|
| FEISHU_APP_ID | your-feishu-app-id-here |
| FEISHU_APP_SECRET | your-feishu-app-secret-here |
| FEISHU_APP_TOKEN | your-feishu-app-token-here |
| FEISHU_TABLE_ID | tblwubqz2IHIOVDb |
| PORT | 3000 |
| NODE_ENV | production |

---

### 步骤 6：等待重新部署

保存后，Railway 会**自动重新部署**：

1. 页面会显示 "Deploying..."
2. 等待 1-2 分钟
3. 状态变为 "Deployed" ✅

---

## ✅ 验证配置

### 方法 1：查看部署日志

1. 点击项目页面的 **"Deployments"** 标签
2. 点击最新的部署
3. 查看日志，应该看到：

```
🔍 环境变量检查:
  FEISHU_APP_ID: ✅
  FEISHU_APP_SECRET: ✅
  FEISHU_APP_TOKEN: ✅
  FEISHU_TABLE_ID: ✅

飞书集成：✅ 已配置
```

### 方法 2：访问健康检查接口

访问：`https://你的域名.railway.app/health`

正常响应：
```json
{
  "status": "ok",
  "timestamp": "2026-03-11T...",
  "feishuConfigured": true
}
```

如果 `feishuConfigured: false`，说明环境变量没配置成功。

---

## 🧪 测试提交

配置完成后，重新测试问卷提交：

1. 打开问卷页面
2. 填写完整的表单
3. 点击"提交申请"
4. 应该显示"申请提交成功！"

---

## ❌ 常见问题

### 问题 1：配置后还是 500 错误

**可能原因：**
- Railway 还没完成重新部署
- 浏览器缓存了旧页面

**解决：**
1. 等待 1-2 分钟
2. 强制刷新浏览器（Ctrl+Shift+R）
3. 检查部署日志

---

### 问题 2：feishuConfigured: false

**可能原因：**
- 环境变量名称拼写错误
- 值前后有空格

**解决：**
1. 检查变量名称是否完全一致（区分大小写）
2. 删除重新添加
3. 使用 Raw Editor 批量添加

---

### 问题 3：飞书 API 返回错误

**可能原因：**
- App ID 或 Secret 错误
- 表格权限问题

**解决：**
1. 检查飞书应用配置
2. 确认应用已发布
3. 检查表格共享权限

---

## 🔗 相关链接

**Railway 控制台：** https://railway.app  
**GitHub 仓库：** https://github.com/ruoan724996/deep-survey-backend  
**飞书表格：** https://baijiubg.feishu.cn/base/your-feishu-app-token-here

---

## 📞 需要帮助？

如果配置后还有问题，请提供：

1. **Railway 部署日志截图**
2. **健康检查接口响应**
3. **浏览器控制台错误信息**

---

**更新时间：** 2026-03-11 06:35
