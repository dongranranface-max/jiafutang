// ===================================
// 嘉孚堂官网 - 完整脚本
// ===================================

const API_URL = 'https://jiafutang-api.dongranranface.workers.dev';

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

// ============ 数据加载 ============
async function loadData() {
    try {
        const [cRes, nRes] = await Promise.all([
            fetch(API_URL + '/api/collections'),
            fetch(API_URL + '/api/news')
        ]);
        collections = await cRes.json();
        news = await nRes.json();
        renderPage();
        initFilters();
        initHeader();
        initHeroSlider();
    } catch(e) {
        console.error('加载失败:', e);
    }
}

// ============ 页面渲染 ============
function renderPage() {
    // 首页精选（不显示状态）- 如果没有 is_featured 则显示所有
    const fg = document.getElementById('featuredGrid');
    if (fg) {
        const featured = collections.filter(c => c.is_featured == 1);
        const displayCols = featured.length > 0 ? featured : collections;
        fg.innerHTML = displayCols.slice(0,4).map(item => createCollectionCard(item, false)).join('');
    }
    
    // 首页新闻 - 如果没有 is_featured/is_top 则显示所有
    const hg = document.getElementById('homeNewsGrid');
    if (hg) {
        const featuredNews = news.filter(n => n.is_featured == 1 || n.is_top == 1);
        const displayNews = featuredNews.length > 0 ? featuredNews : news;
        hg.innerHTML = [...displayNews].sort((a,b) => b.sort - a.sort).slice(0,4).map(createNewsCard).join('');
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
    cg.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:30px;';
    cg.innerHTML = filtered.map(item => createCollectionCard(item, true)).join('');
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
    ng.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:30px;';
    ng.innerHTML = filtered.map(createNewsCard).join('');
}

// ============ 组件创建 ============
function createCollectionCard(item, showStatus = true) {
    const statusHtml = showStatus ? '<span class="card-status ' + item.status + '">' + COLLECTION_STATUS[item.status] + '</span>' : '';
    return '<div class="collection-card" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);transition:transform 0.3s;">' +
        '<div style="position:relative;aspect-ratio:4/3;overflow:hidden;">' +
        '<img src="' + item.cover_image + '" alt="' + item.title + '" style="width:100%;height:100%;object-fit:cover;">' +
        statusHtml +
        '</div>' +
        '<div style="padding:20px;">' +
        '<h3 style="font-size:18px;margin-bottom:8px;color:#333;">' + item.title + '</h3>' +
        '<p style="font-size:14px;color:#666;">' + COLLECTION_CATEGORIES[item.category] + ' · ' + (item.summary||'').substring(0,15) + '</p>' +
        '</div></div>';
}

function createNewsCard(item) {
    return '<div class="news-card" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);transition:transform 0.3s;cursor:pointer;" onclick="window.location.href=\'news-detail.html?id=' + item.id + '\'">' +
        '<div style="aspect-ratio:16/9;overflow:hidden;">' +
        '<img src="' + item.cover_image + '" alt="' + item.title + '" style="width:100%;height:100%;object-fit:cover;">' +
        '</div>' +
        '<div style="padding:20px;">' +
        '<span style="display:inline-block;padding:4px 12px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#666;margin-bottom:12px;">' + NEWS_CATEGORIES[item.category] + '</span>' +
        '<h3 style="font-size:18px;margin-bottom:8px;color:#333;line-height:1.4;">' + item.title + '</h3>' +
        '<p style="font-size:14px;color:#888;line-height:1.6;">' + (item.summary||'') + '</p>' +
        '</div></div>';
}

// ============ 初始化功能 ============
function initFilters() {
    // 移动端菜单
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
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
