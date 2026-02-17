// 嘉孚堂后台管理系统 - 认证模块

// 默认管理员账号
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'admin123'
};

// 检查登录状态
function checkAuth() {
    const isLoggedIn = localStorage.getItem('jiafu_admin_logged_in');
    if (!isLoggedIn && window.location.pathname !== '/admin/index.html') {
        window.location.href = 'index.html';
    }
}

// 登录处理
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
        localStorage.setItem('jiafu_admin_logged_in', 'true');
        localStorage.setItem('jiafu_admin_user', username);
        window.location.href = 'dashboard.html';
    } else {
        alert('用户名或密码错误');
    }
});

// 登出
function logout() {
    localStorage.removeItem('jiafu_admin_logged_in');
    localStorage.removeItem('jiafu_admin_user');
    window.location.href = 'index.html';
}

// 获取当前用户
function getCurrentUser() {
    return localStorage.getItem('jiafu_admin_user') || 'admin';
}
