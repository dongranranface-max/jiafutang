export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // 藏品 API
    if (path === '/api/collections') {
      if (request.method === 'GET') {
        const { results } = await env.jiafutang_db.prepare('SELECT * FROM collections ORDER BY sort').all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (request.method === 'POST') {
        const data = await request.json();
        await env.jiafutang_db.prepare('INSERT INTO collections (title, category, status, cover_image, summary, content, is_featured, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(data.title, data.category, data.status, data.cover_image, data.summary, data.content, data.is_featured ? 1 : 0, data.sort).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }
    }
    
    // 藏品单个操作 (PUT/DELETE)
    if (path.startsWith('/api/collections/')) {
      const id = path.split('/').pop();
      
      if (request.method === 'PUT') {
        const data = await request.json();
        await env.jiafutang_db.prepare('UPDATE collections SET title=?, category=?, status=?, cover_image=?, summary=?, content=?, is_featured=?, sort=? WHERE id=?').bind(data.title, data.category, data.status, data.cover_image, data.summary, data.content, data.is_featured ? 1 : 0, data.sort, id).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }
      
      if (request.method === 'DELETE') {
        await env.jiafutang_db.prepare('DELETE FROM collections WHERE id=?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }
    }
    
    // 新闻 API
    if (path === '/api/news') {
      if (request.method === 'GET') {
        const { results } = await env.jiafutang_db.prepare('SELECT * FROM news ORDER BY sort').all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (request.method === 'POST') {
        const data = await request.json();
        await env.jiafutang_db.prepare('INSERT INTO news (title, category, cover_image, summary, content, is_top, sort) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(data.title, data.category, data.cover_image, data.summary, data.content, data.is_top ? 1 : 0, data.sort).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }
    }
    
    // 新闻单个操作 (PUT/DELETE)
    if (path.startsWith('/api/news/')) {
      const id = path.split('/').pop();
      
      if (request.method === 'PUT') {
        const data = await request.json();
        await env.jiafutang_db.prepare('UPDATE news SET title=?, category=?, cover_image=?, summary=?, content=?, is_top=?, sort=? WHERE id=?').bind(data.title, data.category, data.cover_image, data.summary, data.content, data.is_top ? 1 : 0, data.sort, id).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }
      
      if (request.method === 'DELETE') {
        await env.jiafutang_db.prepare('DELETE FROM news WHERE id=?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
