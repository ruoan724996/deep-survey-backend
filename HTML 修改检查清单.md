# 🔍 HTML 文件修改检查清单

**适用范围：** 所有前端 HTML 文件修改

---

## ✅ 修改前

- [ ] 备份原文件（`cp file.html file.html.bak`）
- [ ] 记录当前 div 标签数量
- [ ] 确认修改范围

---

## ✅ 修改后（必须按顺序执行）

### 结构验证

```bash
# 1. 检查 div 标签配对
python3 -c "
content = open('public/index.html').read()
open_divs = content.count('<div')
close_divs = content.count('</div>')
print(f'开标签：<div = {open_divs}')
print(f'闭标签：</div> = {close_divs}')
print(f'差值：{open_divs - close_divs}')
if open_divs != close_divs:
    print('❌ 标签不配对，请修复！')
    exit(1)
else:
    print('✅ 标签配对正确')
"
```

- [ ] div 标签开闭配对（差值 = 0）
- [ ] form 标签正确闭合
- [ ] 所有 section 在容器内

### 视觉验证

- [ ] 浏览器打开页面
- [ ] 截图检查整体布局
- [ ] 确认所有内容在卡片容器内
- [ ] 检查是否有内容溢出

### 功能验证

- [ ] 表单提交测试
- [ ] 必填字段验证
- [ ] 成功消息显示

---

## ✅ 提交前

- [ ] 检查清单全部勾选
- [ ] Git diff 确认修改范围
- [ ] 提交信息清晰说明修改内容

---

## 📋 检查记录

| 日期 | 文件 | 修改人 | 验证结果 |
|------|------|--------|----------|
| 2026-03-15 | public/index.html | AI 助手 | ✅ 通过 |

---

**强制要求：** 每次修改 HTML 文件必须执行此检查清单，否则不予提交。

**最后更新：** 2026-03-15
