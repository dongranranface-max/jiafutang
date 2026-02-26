// 嘉孚堂 API 客户端 - 签名版
// 自动处理 API 签名验证

const API_CONFIG = {
  // API 基础URL
  baseUrl: 'https://jiafutang.dongranranface.workers.dev',
  // API 密钥 - 从环境变量或通过安全方式获取
  // 生产环境应通过 Workers env 获取，避免硬编码
  getApiSecret: function() {
    // 优先从 window.ENV 获取（后端注入）
    if (window.ENV && window.ENV.API_SECRET) {
      return window.ENV.API_SECRET;
    }
    // 备选：从 localStorage 获取（登录时设置）
    return localStorage.getItem('jiafu_api_secret') || '';
  },
  // 请求有效期（毫秒）
  requestExpiry: 5 * 60 * 1000,
};

// 生成签名
async function createSignature(secret, message) {
  if (!secret) {
    console.error('API 密钥未设置，请重新登录');
    throw new Error('API 密钥未设置');
  }
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// 生成请求ID
function generateRequestId() {
  return crypto.randomUUID();
}

// 带签名的 API 请求
async function signedFetch(url, options = {}) {
  const method = options.method || 'GET';
  const timestamp = Date.now().toString();
  const requestId = generateRequestId();
  
  // 获取请求体（如果有）
  let body = '';
  if (options.body && typeof options.body === 'string') {
    body = options.body;
  } else if (options.body) {
    body = JSON.stringify(options.body);
  }
  
  // 构建签名消息
  const path = new URL(url, API_CONFIG.baseUrl).pathname;
  const message = `${method}:${path}:${timestamp}:${body}`;
  
  // 获取签名密钥
  const apiSecret = API_CONFIG.getApiSecret();
  if (!apiSecret) {
    throw new Error('请先登录管理员账号');
  }
  
  // 生成签名
  const signature = await createSignature(apiSecret, message);
  
  // 设置请求头
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'X-Signature': signature,
    'X-Timestamp': timestamp,
    'X-Request-ID': requestId,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  return response;
}

// 公开 API 请求（不需要签名）
async function publicFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });
}

// ===== API 方法 =====

// 获取藏品列表
async function getCollections() {
  const res = await publicFetch(`${API_CONFIG.baseUrl}/api/collections`);
  return res.json();
}

// 获取单个藏品
async function getCollection(id) {
  const res = await publicFetch(`${API_CONFIG.baseUrl}/api/collections/${id}`);
  return res.json();
}

// 创建藏品
async function createCollection(data) {
  const res = await signedFetch(`${API_CONFIG.baseUrl}/api/collections`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

// 更新藏品
async function updateCollection(id, data) {
  const res = await signedFetch(`${API_CONFIG.baseUrl}/api/collections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

// 删除藏品
async function deleteCollection(id) {
  const res = await signedFetch(`${API_CONFIG.baseUrl}/api/collections/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// 获取新闻列表
async function getNews() {
  const res = await publicFetch(`${API_CONFIG.baseUrl}/api/news`);
  return res.json();
}

// 获取单个新闻
async function getNewsItem(id) {
  const res = await publicFetch(`${API_CONFIG.baseUrl}/api/news/${id}`);
  return res.json();
}

// 创建新闻
async function createNews(data) {
  const res = await signedFetch(`${API_CONFIG.baseUrl}/api/news`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

// 更新新闻
async function updateNews(id, data) {
  const res = await signedFetch(`${API_CONFIG.baseUrl}/api/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

// 删除新闻
async function deleteNews(id) {
  const res = await signedFetch(`${API_CONFIG.baseUrl}/api/news/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// 获取提交列表
async function getSubmissions() {
  const res = await publicFetch(`${API_CONFIG.baseUrl}/api/submissions`);
  return res.json();
}

// 删除提交
async function deleteSubmission(id) {
  const res = await signedFetch(`${API_CONFIG.baseUrl}/api/submissions/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// 创建备份
async function createBackup() {
  const res = await signedFetch(`${API_CONFIG.baseUrl}/api/backup`, {
    method: 'POST',
  });
  return res.json();
}

// 获取操作日志
async function getLogs(limit = 100, offset = 0) {
  const res = await publicFetch(`${API_CONFIG.baseUrl}/api/logs?limit=${limit}&offset=${offset}`);
  return res.json();
}

// Cloudinary 上传
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'jiafutang');
  
  const res = await fetch('https://api.cloudinary.com/v1_1/dongranranface/image/upload', {
    method: 'POST',
    body: formData,
  });
  return res.json();
}
