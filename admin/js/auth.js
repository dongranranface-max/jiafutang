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

// 检查登录状态 - 添加防重复检查
let authCheckDone = false;

function checkAuth() {
    // 防止重复检查
    if (authCheckDone) return;
    authCheckDone = true;
    
    const isLoggedIn = localStorage.getItem('jiafu_admin_logged_in');
    const currentPath = window.location.pathname;
    
    // 如果未登录且不在登录页，跳转到登录页
    if (!isLoggedIn && !currentPath.endsWith('/admin/index.html') && !currentPath.endsWith('index.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    // 检查会话过期
    const expires = localStorage.getItem('jiafu_session_expires');
    if (isLoggedIn && expires && Date.now() > parseInt(expires)) {
        logout();
        return;
    }
}

// 登录处理
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const correctPassword = DEFAULT_ADMIN.getPassword();
    
    if (username === DEFAULT_ADMIN.username && password === correctPassword) {
        localStorage.setItem('jiafu_admin_logged_in', 'true');
        localStorage.setItem('jiafu_admin_user', username);
        localStorage.setItem('jiafu_session_expires', Date.now() + 24 * 60 * 60 * 1000);
        
        // 使用默认 API 密钥
        localStorage.setItem('jiafu_api_secret', 'jiafutang-secret-key-2024');
        
        window.location.href = 'dashboard.html';
    } else {
        alert('用户名或密码错误');
    }
});

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
