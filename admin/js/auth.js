// 嘉孚堂后台管理系统 - 认证模块

// 默认管理员账号 (仅用于首次设置，后续应从环境变量获取)
const DEFAULT_ADMIN = {
    username: 'admin',
    // 密码应该通过 Workers env 设置，不要硬编码
    getPassword: function() {
        // 从 localStorage 或环境变量获取
        return localStorage.getItem('jiafu_admin_pwd') || 'admin123';
    }
};

// API 签名密钥 (登录后设置)
const API_SECRET = 'jiafutang-secret-key-2024';

// 检查登录状态
function checkAuth() {
    const isLoggedIn = localStorage.getItem('jiafu_admin_logged_in');
    if (!isLoggedIn && window.location.pathname !== '/admin/index.html') {
        window.location.href = 'index.html';
    }
    
    // 检查 API 密钥是否设置
    if (isLoggedIn && !localStorage.getItem('jiafu_api_secret')) {
        localStorage.setItem('jiafu_api_secret', API_SECRET);
    }
}

// 登录处理
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const correctPassword = DEFAULT_ADMIN.getPassword();
    
    if (username === DEFAULT_ADMIN.username && password === correctPassword) {
        // 登录成功
        localStorage.setItem('jiafu_admin_logged_in', 'true');
        localStorage.setItem('jiafu_admin_user', username);
        // 设置 API 签名密钥
        localStorage.setItem('jiafu_api_secret', API_SECRET);
        // 设置会话过期时间 (24小时)
        localStorage.setItem('jiafu_session_expires', Date.now() + 24 * 60 * 60 * 1000);
        window.location.href = 'dashboard.html';
    } else {
        alert('用户名或密码错误');
    }
});

// 检查会话是否过期
function checkSession() {
    const expires = localStorage.getItem('jiafu_session_expires');
    if (expires && Date.now() > parseInt(expires)) {
        logout();
        return false;
    }
    return true;
}

// 登出
function logout() {
    localStorage.removeItem('jiafu_admin_logged_in');
    localStorage.removeItem('jiafu_admin_user');
    localStorage.removeItem('jiafu_api_secret');
    localStorage.removeItem('jiafu_session_expires');
    window.location.href = 'index.html';
}

// 获取当前用户
function getCurrentUser() {
    return localStorage.getItem('jiafu_admin_user') || 'admin';
}

// 初始化时检查会话
checkAuth();
