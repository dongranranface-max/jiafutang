// 嘉孚堂 API - 简化版
// 静态文件由 Cloudflare Pages 自动处理

// API 签名密钥
// 说明：
// - 生产环境：请在 Cloudflare Workers 中配置 env.API_SECRET
// - 本地/开发环境：可使用 DEV_API_SECRET 作为临时密钥（不要在生产中使用）
const DEV_API_SECRET = 'jiafutang-secret-key-2024';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // CORS headers - 限制允许的域名
    const corsOrigins = [
        'https://jiafutang.pages.dev',
        'https://jiafutang.dongranranface.workers.dev',
        'http://localhost:8788',
        'http://localhost:3000'
    ];
    const requestOrigin = request.headers.get('Origin') || '';
    const allowedOrigin = corsOrigins.includes(requestOrigin) ? requestOrigin : corsOrigins[0];
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Signature, X-Timestamp, X-Request-ID',
    };
    
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // 非API请求 - 让 Cloudflare Pages 处理静态文件
    if (!path.startsWith('/api/')) {
      // 根路径返回 index.html
      if (path === '/' || path === '') {
        return env.ASSETS.fetch(new URL('/index.html', request.url));
      }
      // 其他静态文件直接获取
      return env.ASSETS.fetch(request);
    }
    
    // ===== API 请求处理 =====
    
    // 签名验证 (用于管理操作)
    const signature = request.headers.get('X-Signature');
    const timestamp = request.headers.get('X-Timestamp');
    const requestId = request.headers.get('X-Request-ID') || crypto.randomUUID();
    
    // 验证签名
    const verifySignature = async (body = '') => {
        if (!signature || !timestamp) return false;
        
        // 检查时间戳是否过期 (5分钟)
        const now = Date.now();
        if (now - parseInt(timestamp) > 5 * 60 * 1000) return false;
        
        // 计算签名
        const message = `${method}:${path}:${timestamp}:${body}`;
        const encoder = new TextEncoder();
        const secret = (env && env.API_SECRET) || DEV_API_SECRET;
        if (!secret) return false;
        const keyData = encoder.encode(secret);
        const messageData = encoder.encode(message);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
        );
        const expectedSignature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        const expected = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)));
        
        return signature === expected;
    };
    
    // 需要签名的 API 列表（所有非 GET 写操作）
    const signedPaths = ['/api/collections', '/api/news', '/api/submissions', '/api/backup'];
    const needsSignature = method !== 'GET' && signedPaths.some(p => path.startsWith(p));
    
    // 有请求体时需用 body 参与签名验证（克隆请求读取 body，避免消费原 body）
    let signatureBody = '';
    if (needsSignature && (method === 'POST' || method === 'PUT')) {
        try {
            signatureBody = await request.clone().text();
        } catch (_) {}
    }
    if (needsSignature && !await verifySignature(signatureBody)) {
        return new Response(JSON.stringify({ error: '签名验证失败' }), { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
    
    // 记录操作日志
    const userIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || '';
    
    const logOp = async (action, targetId, details = {}) => {
      try {
        await env.jiafutang_db.prepare(
          `INSERT INTO operation_logs (timestamp, method, path, action, target_id, user_ip, user_agent, request_id, signature_verified, details)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(Date.now(), method, path, action, targetId, userIP, userAgent, requestId, signature ? 1 : 0, JSON.stringify(details)).run();
      } catch(e) { console.error('log error:', e); }
    };
    
    // 公开API (GET)
    if (method === 'GET') {
      if (path === '/api/collections') {
        const { results } = await env.jiafutang_db.prepare('SELECT * FROM collections ORDER BY sort').all();
        return new Response(JSON.stringify(results), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      if (path.startsWith('/api/collections/')) {
        const id = path.split('/').pop();
        const { results } = await env.jiafutang_db.prepare('SELECT * FROM collections WHERE id = ?').bind(id).all();
        if (!results || results.length === 0) return new Response('Not Found', { status: 404 });
        return new Response(JSON.stringify(results[0]), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      if (path === '/api/news') {
        const { results } = await env.jiafutang_db.prepare('SELECT * FROM news ORDER BY sort').all();
        return new Response(JSON.stringify(results), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      if (path.startsWith('/api/news/')) {
        const id = path.split('/').pop();
        const { results } = await env.jiafutang_db.prepare('SELECT * FROM news WHERE id = ?').bind(id).all();
        if (!results || results.length === 0) return new Response('Not Found', { status: 404 });
        return new Response(JSON.stringify(results[0]), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      if (path === '/api/submissions') {
        const { results } = await env.jiafutang_db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(results || []), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      if (path === '/api/logs') {
        const limit = parseInt(url.searchParams.get('limit') || '100');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const { results } = await env.jiafutang_db.prepare(`SELECT * FROM operation_logs ORDER BY id DESC LIMIT ? OFFSET ?`).bind(limit, offset).all();
        return new Response(JSON.stringify(results || []), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }
    
    // 管理API (POST/PUT/DELETE)
    
    // 藏品创建
    if (path === '/api/collections' && method === 'POST') {
      const data = await request.json();
      const result = await env.jiafutang_db.prepare(
        'INSERT INTO collections (title, category, status, cover_image, summary, content, is_featured, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(data.title, data.category, data.status, data.cover_image, data.summary, data.content, data.is_featured ? 1 : 0, data.sort).run();
      await logOp('create_collection', result.lastRowId?.toString(), { title: data.title });
      return new Response(JSON.stringify({ success: true, id: result.lastRowId }), { headers: corsHeaders });
    }
    
    // 藏品更新
    if (path.startsWith('/api/collections/') && method === 'PUT') {
      const id = path.split('/').pop();
      const data = await request.json();
      const fields = [], values = [];
      if (data.title !== undefined) { fields.push('title=?'); values.push(data.title); }
      if (data.category !== undefined) { fields.push('category=?'); values.push(data.category); }
      if (data.status !== undefined) { fields.push('status=?'); values.push(data.status); }
      if (data.cover_image !== undefined) { fields.push('cover_image=?'); values.push(data.cover_image); }
      if (data.summary !== undefined) { fields.push('summary=?'); values.push(data.summary); }
      if (data.content !== undefined) { fields.push('content=?'); values.push(data.content); }
      if (data.is_featured !== undefined) { fields.push('is_featured=?'); values.push(data.is_featured ? 1 : 0); }
      if (data.sort !== undefined) { fields.push('sort=?'); values.push(data.sort); }
      if (fields.length > 0) { values.push(id); await env.jiafutang_db.prepare('UPDATE collections SET ' + fields.join(',') + ' WHERE id=?').bind(...values).run(); }
      await logOp('update_collection', id, { fields: Object.keys(data) });
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }
    
    // 藏品删除
    if (path.startsWith('/api/collections/') && method === 'DELETE') {
      const id = path.split('/').pop();
      await env.jiafutang_db.prepare('DELETE FROM collections WHERE id=?').bind(id).run();
      await logOp('delete_collection', id, {});
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }
    
    // 新闻创建
    if (path === '/api/news' && method === 'POST') {
      const data = await request.json();
      const result = await env.jiafutang_db.prepare(
        'INSERT INTO news (title, category, cover_image, summary, content, is_top, sort) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(data.title, data.category, data.cover_image, data.summary, data.content, data.is_top ? 1 : 0, data.sort).run();
      await logOp('create_news', result.lastRowId?.toString(), { title: data.title });
      return new Response(JSON.stringify({ success: true, id: result.lastRowId }), { headers: corsHeaders });
    }
    
    // 新闻更新
    if (path.startsWith('/api/news/') && method === 'PUT') {
      const id = path.split('/').pop();
      const data = await request.json();
      const fields = [], values = [];
      if (data.title !== undefined) { fields.push('title=?'); values.push(data.title); }
      if (data.category !== undefined) { fields.push('category=?'); values.push(data.category); }
      if (data.cover_image !== undefined) { fields.push('cover_image=?'); values.push(data.cover_image); }
      if (data.summary !== undefined) { fields.push('summary=?'); values.push(data.summary); }
      if (data.content !== undefined) { fields.push('content=?'); values.push(data.content); }
      if (data.is_top !== undefined) { fields.push('is_top=?'); values.push(data.is_top ? 1 : 0); }
      if (data.sort !== undefined) { fields.push('sort=?'); values.push(data.sort); }
      if (fields.length > 0) { values.push(id); await env.jiafutang_db.prepare('UPDATE news SET ' + fields.join(',') + ' WHERE id=?').bind(...values).run(); }
      await logOp('update_news', id, { fields: Object.keys(data) });
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }
    
    // 新闻删除
    if (path.startsWith('/api/news/') && method === 'DELETE') {
      const id = path.split('/').pop();
      await env.jiafutang_db.prepare('DELETE FROM news WHERE id=?').bind(id).run();
      await logOp('delete_news', id, {});
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }
    
    // 提交删除
    if (path.startsWith('/api/submissions/') && method === 'DELETE') {
      const id = path.split('/').pop();
      await env.jiafutang_db.prepare('DELETE FROM submissions WHERE id=?').bind(id).run();
      await logOp('delete_submission', id, {});
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }
    
    // 备份创建
    if (path === '/api/backup' && method === 'POST') {
      const backup = async (table) => {
        const { results } = await env.jiafutang_db.prepare(`SELECT * FROM ${table}`).all();
        await env.jiafutang_db.prepare(`INSERT INTO backups (backup_type, table_name, record_count, data_json) VALUES (?, ?, ?, ?)`).bind('manual', table, results.length, JSON.stringify(results));
        return { table, count: results.length };
      };
      const r = { collections: await backup('collections'), news: await backup('news'), submissions: await backup('submissions') };
      await logOp('create_backup', null, r);
      return new Response(JSON.stringify({ success: true, timestamp: Date.now(), backups: r }), { headers: corsHeaders });
    }
    
    // 备份恢复
    if (path.startsWith('/api/backup/restore/')) {
      const table = path.split('/').pop();
      const { results } = await env.jiafutang_db.prepare(`SELECT * FROM backups WHERE table_name = ? ORDER BY id DESC LIMIT 1`).bind(table).all();
      if (!results || results.length === 0) return new Response(JSON.stringify({ error: 'No backup found' }), { status: 404, headers: corsHeaders });
      await logOp('restore_backup', table, { backupId: results[0].id });
      return new Response(JSON.stringify({ success: true, table, data: JSON.parse(results[0].data_json) }), { headers: corsHeaders });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
