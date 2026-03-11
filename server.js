require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// 飞书配置（大模型深度交流群筛选问卷）
// ⚠️ 必须通过 Railway 环境变量配置，不要硬编码！
const FEISHU_CONFIG = {
    appId: process.env.FEISHU_APP_ID,
    appSecret: process.env.FEISHU_APP_SECRET,
    appToken: process.env.FEISHU_APP_TOKEN,
    tableId: process.env.FEISHU_TABLE_ID
};

// 中间件
app.use(cors({
    origin: [
        'https://gracious-kindness.up.railway.app',
        'https://agile-eagerness.up.railway.app',
        'https://diligent-elegance.up.railway.app',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 缓存 Token
let cachedToken = null;
let tokenExpireTime = 0;

// 获取飞书 Access Token
async function getFeishuToken() {
    if (cachedToken && Date.now() < tokenExpireTime) {
        console.log('✅ 使用缓存的 Token');
        return cachedToken;
    }

    console.log('🔄 获取新的 Access Token...');
    
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            app_id: FEISHU_CONFIG.appId,
            app_secret: FEISHU_CONFIG.appSecret
        });

        const options = {
            hostname: 'open.feishu.cn',
            port: 443,
            path: '/open-apis/auth/v3/tenant_access_token/internal',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                const result = JSON.parse(responseData);
                if (result.code === 0) {
                    cachedToken = result.tenant_access_token;
                    tokenExpireTime = Date.now() + (result.expire - 300) * 1000;
                    console.log('✅ Token 获取成功');
                    resolve(cachedToken);
                } else {
                    reject(new Error('获取 Token 失败：' + result.msg));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// 提交数据到飞书
async function submitToFeishu(fields) {
    const token = await getFeishuToken();
    
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ fields });

        const options = {
            hostname: 'open.feishu.cn',
            port: 443,
            path: `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${FEISHU_CONFIG.tableId}/records`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        console.log('📤 提交数据到飞书...');
        console.log('飞书配置:', {
            appToken: FEISHU_CONFIG.appToken,
            tableId: FEISHU_CONFIG.tableId
        });
        console.log('提交字段列表:', Object.keys(fields));

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                console.log('飞书响应状态:', res.statusCode);
                console.log('飞书响应内容:', responseData);
                
                try {
                    const result = JSON.parse(responseData);
                    if (result.code === 0) {
                        console.log('✅ 飞书提交成功，记录 ID:', result.data.record.id);
                        resolve(result);
                    } else {
                        console.error('❌ 飞书 API 错误:', result.msg);
                        console.error('❌ 错误详情:', result);
                        reject(new Error(result.msg || '提交失败'));
                    }
                } catch (e) {
                    console.error('❌ 解析飞书响应失败:', e.message);
                    reject(new Error('解析失败：' + e.message));
                }
            });
        });

        req.on('error', (e) => {
            console.error('❌ 飞书请求失败:', e.message);
            reject(new Error('请求失败：' + e.message));
        });
        req.write(data);
        req.end();
    });
}

// 提交 API
app.post('/api/submit', async (req, res) => {
    console.log('\n📝 收到问卷提交');
    console.log('填写人:', req.body['姓名'] || '匿名');
    console.log('邮箱:', req.body['邮箱'] || '未填写');
    
    try {
        const data = req.body;
        
        // 检测是哪种问卷类型
        const isTrainingFeedback = data['培训日期'] !== undefined; // 培训反馈问卷
        const isDeepSurvey = data['邮箱'] !== undefined; // 深度交流群问卷
        
        let feishuFields;
        
        if (isTrainingFeedback) {
            // ========== 培训反馈问卷字段映射 ==========
            console.log('📋 检测到培训反馈问卷');
            
            // 验证必填字段
            const requiredFields = ['培训日期', '帮助程度', '内容难度', '开发经验', '整体满意度', '是否推荐'];
            for (const field of requiredFields) {
                if (!data[field]) {
                    console.log('❌ 验证失败：缺少字段', field);
                    return res.status(400).json({
                        success: false,
                        message: `缺少必填字段：${field}`
                    });
                }
            }
            
            feishuFields = {
                '姓名': data['姓名'] || '匿名',
                '部门': data['部门'] || '未填写',
                '培训日期': data['培训日期'],
                '帮助程度': data['帮助程度'],
                '内容难度': data['内容难度'],
                '收获知识点': data['收获知识点'] || '未填写',
                '开发经验': data['开发经验'],
                '功能类型': Array.isArray(data['功能类型']) ? data['功能类型'].join(', ') : '未填写',
                '主要帮助': Array.isArray(data['主要帮助']) ? data['主要帮助'].join(', ') : '未填写',
                '困难问题': Array.isArray(data['困难问题']) ? data['困难问题'].join(', ') : '未填写',
                '关注方向': Array.isArray(data['关注方向']) ? data['关注方向'].join(', ') : '未填写',
                '学习形式': data['学习形式'] || '未填写',
                '学习时间': data['学习时间'] || '未填写',
                '整体满意度': data['整体满意度'],
                '是否推荐': data['是否推荐'],
                '其他建议': data['其他建议'] || '未填写',
                '提交时间': new Date().toISOString()
            };
            
        } else if (isDeepSurvey) {
            // ========== 深度交流群问卷字段映射 ==========
            console.log('📋 检测到深度交流群问卷');
            
            // 验证必填字段
            const requiredFields = ['姓名', '部门单位', '邮箱', '使用经验', '项目经验', '参与动机', '时间投入'];
            for (const field of requiredFields) {
                if (!data[field]) {
                    console.log('❌ 验证失败：缺少字段', field);
                    return res.status(400).json({
                        success: false,
                        message: `缺少必填字段：${field}`
                    });
                }
            }
            
            // 验证多选框至少选一个
            if (!data['使用场景'] || (Array.isArray(data['使用场景']) && data['使用场景'].length === 0)) {
                console.log('❌ 验证失败：使用场景未选择');
                return res.status(400).json({
                    success: false,
                    message: '请至少选择一个使用场景选项'
                });
            }
            
            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data['邮箱'])) {
                console.log('❌ 验证失败：邮箱格式错误', data['邮箱']);
                return res.status(400).json({
                    success: false,
                    message: '邮箱格式不正确'
                });
            }
            
            // 验证参与动机字数
            if (data['参与动机'].length < 20) {
                console.log('❌ 验证失败：参与动机字数不足', data['参与动机'].length);
                return res.status(400).json({
                    success: false,
                    message: '参与动机请至少填写 20 字'
                });
            }
            
            feishuFields = {
                '姓名': data['姓名'] || '匿名',
                '部门单位': data['部门单位'] || '未填写',
                '邮箱': data['邮箱'],
                '微信手机号': data['微信手机号'] || '未填写',
                '使用经验': data['使用经验'],
                '使用场景': Array.isArray(data['使用场景']) ? data['使用场景'].join(', ') : data['使用场景'],
                '项目经验': data['项目经验'],
                '参与动机': data['参与动机'],
                '时间投入': data['时间投入'],
                '能分享': Array.isArray(data['能分享']) ? data['能分享'].join(', ') : (data['能分享'] || '未填写'),
                '期望': data['期望'] || '未填写',
                '其他建议': data['其他建议'] || '未填写',
                '提交时间': new Date().toISOString()
            };
            
        } else {
            console.log('❌ 无法识别问卷类型');
            return res.status(400).json({
                success: false,
                message: '无法识别问卷类型，请检查表单字段'
            });
        }
        
        console.log('✅ 前端验证通过');
        
        console.log('📤 准备提交到飞书:', feishuFields);
        
        // 提交到飞书多维表格
        const result = await submitToFeishu(feishuFields);
        
        console.log('✅ 提交成功:', result.data.record.id);
        res.json({ 
            success: true, 
            message: '提交成功',
            recordId: result.data.record.id 
        });
        
    } catch (error) {
        console.error('❌ 提交失败:', error.message);
        console.error('错误堆栈:', error.stack);
        
        // 详细错误诊断
        if (error.message.includes('Token')) {
            console.error('❌ 飞书 Token 获取失败，请检查 FEISHU_APP_ID 和 FEISHU_APP_SECRET');
        }
        if (error.message.includes('bitable') || error.message.includes('apps')) {
            console.error('❌ 飞书表格访问失败，请检查 FEISHU_APP_TOKEN 和 FEISHU_TABLE_ID');
        }
        
        res.status(500).json({ 
            success: false, 
            message: '提交失败：' + error.message,
            debug: {
                feishuConfigured: !!(FEISHU_CONFIG.appToken && FEISHU_CONFIG.tableId),
                errorType: error.constructor.name
            }
        });
    }
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        feishuConfigured: !!(FEISHU_CONFIG.appToken && FEISHU_CONFIG.tableId)
    });
});

// 首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    // 环境变量检查（强制）
    const missingEnv = [];
    if (!FEISHU_CONFIG.appId) missingEnv.push('FEISHU_APP_ID');
    if (!FEISHU_CONFIG.appSecret) missingEnv.push('FEISHU_APP_SECRET');
    if (!FEISHU_CONFIG.appToken) missingEnv.push('FEISHU_APP_TOKEN');
    if (!FEISHU_CONFIG.tableId) missingEnv.push('FEISHU_TABLE_ID');
    
    console.log('\n🔍 环境变量检查:');
    console.log(`  FEISHU_APP_ID: ${FEISHU_CONFIG.appId ? '✅' : '❌'}`);
    console.log(`  FEISHU_APP_SECRET: ${FEISHU_CONFIG.appSecret ? '✅' : '❌'}`);
    console.log(`  FEISHU_APP_TOKEN: ${FEISHU_CONFIG.appToken ? '✅' : '❌'}`);
    console.log(`  FEISHU_TABLE_ID: ${FEISHU_CONFIG.tableId ? '✅' : '❌'}`);
    
    if (missingEnv.length > 0) {
        console.error(`\n❌ 错误：缺少必需的环境变量：${missingEnv.join(', ')}`);
        console.error('请在 Railway 后台配置这些变量！\n');
        console.error('服务将在 5 秒后退出...\n');
        setTimeout(() => process.exit(1), 5000);
        return;
    }
    
    console.log('\n✅ 所有环境变量已配置\n');
    
    console.log(`
╔════════════════════════════════════════════════════════╗
║   🎯 大模型深度交流群筛选问卷系统                        ║
║   服务器已启动                                          ║
║   本地访问：http://localhost:${PORT}                     ║
║   提交 API: POST http://localhost:${PORT}/api/submit     ║
║   飞书集成：✅ 已配置                                    ║
╚════════════════════════════════════════════════════════╝
    `);
});
