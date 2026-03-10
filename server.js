require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 存储提交数据（临时内存存储，生产环境应该用数据库）
const submissions = [];

// 提交 API
app.post('/api/submit', async (req, res) => {
    try {
        const data = req.body;
        
        // 验证必填字段（匹配前端 index.html 的 required 字段）
        const requiredFields = ['姓名', '部门单位', '邮箱', '使用经验', '项目经验', '参与动机', '时间投入'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return res.status(400).json({
                    success: false,
                    message: `缺少必填字段：${field}`
                });
            }
        }
        
        // 验证多选框至少选一个
        if (!data['使用场景'] || (Array.isArray(data['使用场景']) && data['使用场景'].length === 0)) {
            return res.status(400).json({
                success: false,
                message: '请至少选择一个使用场景选项'
            });
        }
        
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data['邮箱'])) {
            return res.status(400).json({
                success: false,
                message: '邮箱格式不正确'
            });
        }
        
        // 验证参与动机字数
        if (data['参与动机'].length < 20) {
            return res.status(400).json({
                success: false,
                message: '参与动机请至少填写 20 字'
            });
        }
        
        // 添加提交记录
        const submission = {
            id: submissions.length + 1,
            ...data,
            submittedAt: new Date().toISOString()
        };
        submissions.push(submission);
        
        console.log('✅ 新提交:', submission);
        
        // TODO: 这里可以添加飞书多维表格集成
        // await submitToFeishuBitable(data);
        
        res.json({
            success: true,
            message: '提交成功',
            id: submission.id
        });
        
    } catch (error) {
        console.error('❌ 提交错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误，请稍后重试'
        });
    }
});

// 获取提交列表 API（带简单认证）
app.get('/api/submissions', (req, res) => {
    const auth = req.headers.authorization;
    
    // 简单认证（生产环境应该用更好的方式）
    if (auth !== `Bearer ${process.env.API_SECRET || 'secret123'}`) {
        return res.status(401).json({
            success: false,
            message: '未授权'
        });
    }
    
    res.json({
        success: true,
        data: submissions
    });
});

// 首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        submissions: submissions.length
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║   🎯 大模型深度交流群筛选问卷系统                        ║
║   服务器已启动                                          ║
║   本地访问：http://localhost:${PORT}                     ║
║   提交 API: POST http://localhost:${PORT}/api/submit     ║
╚════════════════════════════════════════════════════════╝
    `);
});
