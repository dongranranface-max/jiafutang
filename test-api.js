// 测试脚本
const API_BASE = 'https://jiafutang-api.dongranranface.workers.dev/api';

async function test() {
    console.log('Testing API...');
    try {
        const res = await fetch(API_BASE + '/submissions', {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Data:', JSON.stringify(data, null, 2));
        
        // 测试更新
        console.log('Testing PUT...');
        const putRes = await fetch(API_BASE + '/submissions/3', {
            method: 'PUT',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'processed' })
        });
        console.log('PUT Status:', putRes.status);
        const putData = await putRes.json();
        console.log('PUT Result:', putData);
        
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
