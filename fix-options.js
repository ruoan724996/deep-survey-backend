// 飞书多维表格选项补充脚本
// 使用方法：node fix-options.js

const https = require('https');

const CONFIG = {
    appToken: 'MMwsb70JkaDngbs8P5ecXGllnse',
    tableId: 'tblWbQxbHNiKk5gB',
    appId: process.env.FEISHU_APP_ID,
    appSecret: process.env.FEISHU_APP_SECRET
};

// 需要补充选项的字段
const fieldsToUpdate = [
    {
        fieldId: 'fldaqldihx',
        fieldName: '帮助程度',
        options: [
            { id: 'opt1', name: '1', color: 4 },
            { id: 'opt4631977', name: '2', color: 1 },
            { id: 'opt4631978', name: '3', color: 2 },
            { id: 'opt4631979', name: '4', color: 3 },
            { id: 'opt4631980', name: '5', color: 0 }
        ]
    },
    {
        fieldId: 'fldqXSMXk5',
        fieldName: '整体满意度',
        options: [
            { id: 'opt1', name: '1', color: 4 },
            { id: 'opt2', name: '2', color: 1 },
            { id: 'opt3', name: '3', color: 2 },
            { id: 'opt4', name: '4', color: 3 },
            { id: 'opt5', name: '5', color: 0 }
        ]
    },
    {
        fieldId: 'fldocU20pm',
        fieldName: '是否推荐',
        options: [
            { id: 'opt4658086', name: '是', color: 0 },
            { id: 'opt2', name: '否', color: 1 }
        ]
    }
];

async function getToken() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            app_id: CONFIG.appId,
            app_secret: CONFIG.appSecret
        });

        const req = https.request({
            hostname: 'open.feishu.cn',
            port: 443,
            path: '/open-apis/auth/v3/tenant_access_token/internal',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                const result = JSON.parse(responseData);
                if (result.code === 0) {
                    resolve(result.tenant_access_token);
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

async function updateFieldOptions(fieldId, options) {
    const token = await getToken();
    
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            options: options
        });

        const req = https.request({
            hostname: 'open.feishu.cn',
            port: 443,
            path: `/open-apis/bitable/v1/apps/${CONFIG.appToken}/tables/${CONFIG.tableId}/fields/${fieldId}/options`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                console.log(`状态码：${res.statusCode}`);
                console.log(`响应：${responseData}`);
                const result = JSON.parse(responseData);
                if (result.code === 0) {
                    resolve(result);
                } else {
                    reject(new Error(result.msg || '更新失败'));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('🚀 开始更新飞书表格选项...\n');
    
    for (const field of fieldsToUpdate) {
        console.log(`📝 更新字段：${field.fieldName} (${field.fieldId})`);
        try {
            await updateFieldOptions(field.fieldId, field.options);
            console.log(`✅ ${field.fieldName} 更新成功\n`);
        } catch (error) {
            console.error(`❌ ${field.fieldName} 更新失败：${error.message}\n`);
        }
    }
    
    console.log('✨ 完成！');
}

main().catch(console.error);
