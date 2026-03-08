// ===================================
// 嘉孚堂官网 - 完整脚本
// ===================================

// API 地址 - 使用 Workers API
const API_URL = 'https://jiafutang.dongranranface.workers.dev';

var collections = [];
var news = [];

const COLLECTION_CATEGORIES = {
    all: '全部', art: '艺术品', antique: '古董文物', 
    jewelry: '珠宝奢侈品', coin: '文献邮币', nft: '数字藏品', misc: '杂项'
};

const COLLECTION_STATUS = {
    sold: '已拍卖', unsold: '未拍卖', coming: '即将拍卖'
};

const NEWS_CATEGORIES = {
    all: '全部', brand: '嘉孚堂动态', industry: '行业动态'
};

// 示例数据 - 用于测试
const SAMPLE_COLLECTIONS = [
    { id: 1, title: '抽象数字艺术', category: 'nft', status: 'sold', cover_image: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=400', summary: '抽象数字艺术', is_featured: 1, sort: 1 },
    { id: 2, title: '3D渲染艺术', category: 'nft', status: 'sold', cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', summary: '3D渲染艺术', is_featured: 1, sort: 2 },
    { id: 3, title: '加密艺术', category: 'nft', status: 'coming', cover_image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400', summary: '加密区块链风格', is_featured: 1, sort: 3 }
];

const SAMPLE_NEWS = [
    { id: 1, title: '嘉孚堂首拍圆满成功', category: 'brand', summary: '热烈庆祝嘉孚堂首场拍卖会圆满成功', cover_image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400', is_featured: 1, sort: 1 },
    { id: 2, title: '艺术品市场发展趋势', category: 'industry', summary: '分析2026年艺术品市场发展趋势', cover_image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400', is_featured: 1, sort: 2 }
];

// ============ 数据加载 ============
async function loadData() {
    // 显示加载状态
    const featuredGrid = document.getElementById('featuredGrid');
    const homeNewsGrid = document.getElementById('homeNewsGrid');
    const collectionGrid = document.getElementById('collectionGrid');
    const newsListGrid = document.getElementById('newsListGrid');
    
    if (featuredGrid) featuredGrid.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">加载中...</p>';
    if (homeNewsGrid) homeNewsGrid.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">加载中...</p>';
    if (collectionGrid) collectionGrid.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">加载中...</p>';
    if (newsListGrid) newsListGrid.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">加载中...</p>';
    
    // 先初始化基础功能（汉堡菜单等）
    if (typeof initFilters === 'function') initFilters();
    if (typeof initHeader === 'function') initHeader();
    if (typeof initHeroSlider === 'function') initHeroSlider();
    
    try {
        // 添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const [cRes, nRes] = await Promise.all([
            fetch(API_URL + '/api/collections', { signal: controller.signal }),
            fetch(API_URL + '/api/news', { signal: controller.signal })
        ]).catch(e => {
            clearTimeout(timeoutId);
            throw e;
        });
        clearTimeout(timeoutId);
        
        if (cRes.ok) {
            collections = await cRes.json();
        } else {
            // API失败时使用示例数据
            console.warn('API失败，使用示例数据');
            collections = SAMPLE_COLLECTIONS;
        }
        
        if (nRes.ok) {
            news = await nRes.json();
        } else {
            // API失败时使用示例数据
            news = SAMPLE_NEWS;
        }
        
        renderPage();
        
        // 首页加载完成后，初始化新闻卡片点击事件
        if (document.getElementById('homeNewsGrid')) {
            initHomeNewsClickEvents();
        }
    } catch(e) {
        console.error('加载失败:', e);
        // 使用示例数据
        collections = SAMPLE_COLLECTIONS;
        news = SAMPLE_NEWS;
        renderPage();
    }
}

// 首页新闻点击事件初始化
function initHomeNewsClickEvents() {
    const grid = document.getElementById('homeNewsGrid');
    if (!grid) return;
    
    // 延迟等待 DOM 渲染完成
    setTimeout(() => {
        grid.querySelectorAll('.news-card').forEach((card, index) => {
            // 避免重复绑定
            if (card.dataset.clickBound) return;
            card.dataset.clickBound = 'true';
            
            card.addEventListener('click', function() {
                const id = news[index]?.id;
                if (id) {
                    window.location.href = `news-detail.html?id=${id}`;
                }
            });
        });
    }, 100);
}

// ============ 页面渲染 ============
function renderPage() {
    // 首页精选（不显示状态）- 如果没有 is_featured 则显示所有
    const fg = document.getElementById('featuredGrid');
    if (fg) {
        const featured = collections.filter(c => c.is_featured == 1);
        const displayCols = featured.length > 0 ? featured : collections;
        fg.innerHTML = displayCols.slice(0,4).map((item, idx) => {
            const card = createCollectionCard(item, false);
            // 直接添加 onclick
            return card.replace('class="collection-card"', 'class="collection-card" onclick="window.location.href=\'collection-detail.html?id=' + item.id + '\'"');
        }).join('');
    }
    
    // 首页新闻 - 如果没有 is_featured/is_top 则显示所有
    const hg = document.getElementById('homeNewsGrid');
    if (hg) {
        const featuredNews = news.filter(n => n.is_featured == 1 || n.is_top == 1);
        const displayNews = featuredNews.length > 0 ? featuredNews : news;
        hg.innerHTML = [...displayNews].sort((a,b) => b.sort - a.sort).slice(0,4).map((item, idx) => {
            const card = createNewsCard(item);
            // 直接添加 onclick
            return card.replace('class="news-card"', 'class="news-card" onclick="window.location.href=\'news-detail.html?id=' + item.id + '\'"');
        }).join('');
    }
    
    // 统计数字动画
    initStatsAnimation();
    
    // 藏品列表
    const cg = document.getElementById('collectionGrid');
    if (cg) renderCollections();
    
    // 新闻列表
    const ng = document.getElementById('newsListGrid');
    if (ng) renderNews();
}

// 渲染藏品列表
function renderCollections() {
    const cg = document.getElementById('collectionGrid');
    if (!cg) return;
    
    const category = document.querySelector('.filter-tabs .filter-btn.active')?.dataset.category || 'all';
    const status = document.querySelector('.filter-status .filter-btn.active')?.dataset.status || 'all';
    const keyword = document.getElementById('collectionSearchInput')?.value.trim() || '';
    
    let filtered = [...collections];
    if (category !== 'all') filtered = filtered.filter(c => c.category === category);
    if (status !== 'all') filtered = filtered.filter(c => c.status === status);
    if (keyword) filtered = filtered.filter(c => c.title.includes(keyword) || (c.summary && c.summary.includes(keyword)));
    
    filtered.sort((a,b) => b.sort - a.sort);
    // 不使用内联样式，让 CSS 控制布局
    cg.innerHTML = filtered.map((item, idx) => {
        const card = createCollectionCard(item, true);
        return card.replace('class="collection-card"', 'class="collection-card" onclick="window.location.href=\'collection-detail.html?id=' + item.id + '\'"');
    }).join('');
}

// 渲染新闻列表
function renderNews() {
    const ng = document.getElementById('newsListGrid');
    if (!ng) return;
    
    const category = document.querySelector('.filter-tabs .filter-btn.active')?.dataset.category || 'all';
    const keyword = document.getElementById('newsSearchInput')?.value.trim() || '';
    
    let filtered = [...news];
    if (category !== 'all') filtered = filtered.filter(n => n.category === category);
    if (keyword) filtered = filtered.filter(n => n.title.includes(keyword) || (n.summary && n.summary.includes(keyword)));
    
    filtered.sort((a,b) => b.sort - a.sort);
    // 不使用内联样式，让 CSS 控制布局
    ng.innerHTML = filtered.map((item, idx) => {
        const card = createNewsCard(item);
        return card.replace('class="news-card"', 'class="news-card" onclick="window.location.href=\'news-detail.html?id=' + item.id + '\'"');
    }).join('');
}

// ============ 组件创建 ============
function createCollectionCard(item, showStatus = true) {
    const statusHtml = showStatus ? '<span class="card-status ' + item.status + '">' + COLLECTION_STATUS[item.status] + '</span>' : '';
    return '<div class="collection-card" id="collection-card-' + item.id + '" data-id="' + item.id + '" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);transition:transform 0.3s;cursor:pointer;">' +
        '<div style="position:relative;aspect-ratio:4/3;overflow:hidden;">' +
        '<img src="' + item.cover_image + '" alt="' + item.title + '" style="width:100%;height:100%;object-fit:cover;">' +
        statusHtml +
        '</div>' +
        '<div style="padding:20px;">' +
        '<h3 style="font-size:18px;margin-bottom:8px;color:#333;">' + item.title + '</h3>' +
        '<p style="font-size:14px;color:#666;">' + COLLECTION_CATEGORIES[item.category] + ' · ' + (item.summary||'').substring(0,15) + '</p>' +
        '</div>';
}

function createNewsCard(item) {
    var newsId = item.id;
    var url = 'news-detail.html?id=' + newsId;
    return '<a href="' + url + '" class="news-card" id="news-card-' + newsId + '" data-id="' + newsId + '" style="display:block;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);transition:transform 0.3s;text-decoration:none;color:inherit;">' +
        '<div style="aspect-ratio:16/9;overflow:hidden;">' +
        '<img src="' + (item.cover_image || '') + '" alt="' + (item.title || '') + '" style="width:100%;height:100%;object-fit:cover;">' +
        '</div>' +
        '<div style="padding:20px;">' +
        '<span style="display:inline-block;padding:4px 12px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#666;margin-bottom:12px;">' + (NEWS_CATEGORIES[item.category] || '') + '</span>' +
        '<h3 style="font-size:18px;margin-bottom:8px;color:#333;line-height:1.4;">' + (item.title || '') + '</h3>' +
        '<p style="font-size:14px;color:#888;line-height:1.6;">' + (item.summary || '') + '</p>' +
        '</a>';
}

// 为新闻卡片添加点击事件（使用事件委托）
document.addEventListener('DOMContentLoaded', function() {
    // 藏品卡片点击 - 跳转详情页
    document.getElementById('collectionGrid')?.addEventListener('click', function(e) {
        var card = e.target.closest('.collection-card');
        if (card) {
            var id = card.dataset.id;
            if (id) {
                window.location.href = 'collection-detail.html?id=' + id;
            }
        }
    });
    
    // 首页精选藏品点击
    document.getElementById('featuredGrid')?.addEventListener('click', function(e) {
        var card = e.target.closest('.collection-card');
        if (card) {
            var id = card.dataset.id;
            if (id) {
                window.location.href = 'collection-detail.html?id=' + id;
            }
        }
    });
    
    // 新闻卡片点击
    document.getElementById('newsListGrid')?.addEventListener('click', function(e) {
        var card = e.target.closest('.news-card');
        if (card) {
            var newsId = card.dataset.id;
            if (newsId) {
                window.location.href = 'news-detail.html?id=' + newsId;
            }
        }
    });
    
});

// ============ 初始化功能 ============
function initFilters() {
    console.log('[jiafutang] 初始化功能...');
    
    // 移动端菜单
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const overlay = document.getElementById('navOverlay');
    
    console.log('[jiafutang] 汉堡菜单元素:', hamburger, nav);
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[jiafutang] 汉堡菜单点击');
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
        
        // 点击遮罩层关闭菜单
        if (overlay) {
            overlay.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        // 点击导航链接关闭菜单
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            });
        });
        
        console.log('[jiafutang] 汉堡菜单事件已绑定');
    } else {
        console.log('[jiafutang] 未找到汉堡菜单元素');
    }
    
    // 藏品分类筛选
    document.querySelectorAll('.filter-tabs .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCollections();
        });
    });
    
    // 藏品状态筛选
    document.querySelectorAll('.filter-status .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCollections();
        });
    });
    
    // 藏品搜索
    document.getElementById('collectionSearchBtn')?.addEventListener('click', renderCollections);
    document.getElementById('collectionSearchInput')?.addEventListener('keypress', e => { if(e.key === 'Enter') renderCollections(); });
    
    // 新闻筛选
    document.querySelectorAll('.news-tabs .filter-btn, .filter-tabs .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderNews();
        });
    });
    
    document.getElementById('newsSearchBtn')?.addEventListener('click', renderNews);
    document.getElementById('newsSearchInput')?.addEventListener('keypress', e => { if(e.key === 'Enter') renderNews(); });
    
    // 首页精品典藏Tab切换
    document.querySelectorAll('.featured-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            renderFeaturedGrid(category);
        });
    });
    
    // 首页资讯动态Tab切换
    document.querySelectorAll('.news-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            renderHomeNewsGrid(category);
        });
    });
}

// 首页精品典藏渲染
function renderFeaturedGrid(category) {
    const fg = document.getElementById('featuredGrid');
    if (!fg) return;
    
    let filtered = collections.filter(c => c.is_featured == 1);
    if (category !== 'all') filtered = filtered.filter(c => c.category === category);
    
    fg.innerHTML = filtered.slice(0, 8).map(item => createCollectionCard(item, false)).join('');
}

// 首页资讯动态渲染
function renderHomeNewsGrid(category) {
    const hg = document.getElementById('homeNewsGrid');
    if (!hg) return;
    
    let filtered = [...news];
    if (category !== 'all') filtered = filtered.filter(n => n.category === category);
    
    hg.innerHTML = filtered.sort((a,b) => b.sort - a.sort).slice(0, 4).map(createNewsCard).join('');
}

// Header 滚动效果
function initHeader() {
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.pageYOffset > 100);
        });
    }
}

// Hero 轮播
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    const dots = document.querySelectorAll('.hero-dots .dot');
    if (!slider || dots.length === 0) return;
    
    let current = 0;
    const slides = slider.querySelectorAll('.hero-slide');
    const total = slides.length;
    
    function goTo(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        current = index;
    }
    
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); }));
    
    setInterval(() => goTo((current + 1) % total), 4000);
}

// 统计数字动画
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNum(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
}

function animateNum(el, target) {
    const dur = 1500, start = performance.now();
    function update(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(p * target) + '+';
        if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// 表单提交
function initSubmissionForm() {
    const form = document.getElementById('submissionForm');
    if (!form) return;
    
    const submitBtn = form.querySelector('.form-submit .btn');
    const fileInput = form.querySelector('#itemImages');
    const previewContainer = form.querySelector('.image-preview');
    let uploadedImages = [];
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (uploadedImages.length >= 6) { alert('最多上传6张图片'); return; }
                if (!file.type.startsWith('image/')) { alert('请上传图片文件'); return; }
                if (file.size > 5 * 1024 * 1024) { alert('图片大小不能超过5MB'); return; }
                const reader = new FileReader();
                reader.onload = function(event) { uploadedImages.push(event.target.result); renderImagePreview(); };
                reader.readAsDataURL(file);
            });
            this.value = '';
        });
    }
    
    function renderImagePreview() {
        if (!previewContainer) return;
        previewContainer.innerHTML = uploadedImages.map((src, index) => 
            '<div class="image-preview-item"><img src="' + src + '" alt="预览图片' + (index+1) + '"><button type="button" class="remove-btn" data-index="' + index + '">×</button></div>'
        ).join('');
        previewContainer.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() { uploadedImages.splice(parseInt(this.dataset.index), 1); renderImagePreview(); });
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.querySelector('#privacyAgree')?.checked) { alert('请阅读并同意隐私条款'); return; }
        
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
        
        const submission = {
            id: Date.now(),
            item_name: form.querySelector('#itemName')?.value || '',
            category: form.querySelector('#itemCategory')?.value || '',
            estimated_value: form.querySelector('#estimatedValue')?.value || '',
            description: form.querySelector('#itemDescription')?.value || '',
            contact_name: form.querySelector('#contactName')?.value || '',
            contact_mobile: form.querySelector('#contactMobile')?.value || '',
            contact_city: form.querySelector('#contactCity')?.value || '',
            images: uploadedImages,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        
        const submissions = JSON.parse(localStorage.getItem('jiafu_submissions') || '[]');
        submissions.unshift(submission);
        localStorage.setItem('jiafu_submissions', JSON.stringify(submissions));
        
        setTimeout(function() {
            form.innerHTML = '<div style="text-align:center;padding:60px;"><h2 style="margin-bottom:20px;">✅ 提交成功</h2><p>我们已经收到您的藏品信息，将尽快与您联系</p><a href="consignment.html" class="btn btn-primary" style="display:inline-block;margin-top:30px;">查看征集流程</a></div>';
        }, 800);
    });
}

// ============ 启动 ============
console.log('data.js 初始化');
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadData();
        initSubmissionForm();
    });
} else {
    loadData();
    initSubmissionForm();
}
