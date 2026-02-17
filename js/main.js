// ===================================
// 嘉孚堂官网 - 主脚本文件
// ===================================

// 立即初始化移动端菜单（不等待 DOMContentLoaded）
(function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // 点击导航链接关闭菜单
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
        
        console.log('Mobile menu initialized');
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // 立即初始化基础功能
    initHeader();
    initHeroSlider();
    initScrollAnimations();
    initTabs();
    initSearch();
    initStatsAnimation();
    
    // 页面特定功能 - 加载数据
    if (document.getElementById('featuredGrid')) {
        loadFeaturedCollections();
    }
    if (document.getElementById('homeNewsGrid')) {
        loadHomeNews();
    }
    if (document.getElementById('submissionForm')) {
        initSubmissionForm();
    }
    
    // 延迟一下再刷新，确保数据已加载
    setTimeout(function() {
        if (document.getElementById('featuredGrid')) refreshCollections();
        if (document.getElementById('homeNewsGrid')) refreshNews();
    }, 500);
});

// 刷新藏品展示
function refreshCollections() {
    loadFeaturedCollections();
}

// 刷新新闻展示  
function refreshNews() {
    loadHomeNews();
}

// ===================================
// Header 滚动效果
// ===================================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// Hero 轮播
// ===================================
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    const dots = document.querySelectorAll('.hero-dots .dot');
    
    if (!slider || dots.length === 0) return;
    
    let currentSlide = 0;
    const slides = slider.querySelectorAll('.hero-slide');
    const totalSlides = slides.length;
    let autoplayInterval;
    
    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // 点击切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });
    
    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑 -> 下一张
                const next = (currentSlide + 1) % totalSlides;
                goToSlide(next);
            } else {
                // 向右滑 -> 上一张
                const prev = (currentSlide - 1 + totalSlides) % totalSlides;
                goToSlide(prev);
            }
            stopAutoplay();
            startAutoplay();
        }
    }
    
    // 开始自动轮播
    startAutoplay();
}

// ===================================
// 滚动渐入动画
// ===================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => observer.observe(el));
}

// ===================================
// Tab 切换功能
// ===================================
function initTabs() {
    // 首页精品典藏Tab
    const featuredTabs = document.querySelectorAll('.featured-tabs .tab-btn');
    const homeSearchInput = document.getElementById('homeSearchInput');
    const homeSearchBtn = document.getElementById('homeSearchBtn');
    
    if (featuredTabs.length > 0) {
        featuredTabs.forEach(btn => {
            btn.addEventListener('click', function() {
                featuredTabs.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.dataset.category;
                loadFeaturedCollections(category);
            });
        });
    }
    
    // 首页新闻Tab
    const newsTabs = document.querySelectorAll('.news-tabs .tab-btn');
    if (newsTabs.length > 0) {
        newsTabs.forEach(btn => {
            btn.addEventListener('click', function() {
                newsTabs.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.dataset.category;
                loadHomeNews(category);
            });
        });
    }
    
    // 搜索功能
    if (homeSearchBtn) {
        homeSearchBtn.addEventListener('click', function() {
            const category = document.querySelector('.featured-tabs .tab-btn.active')?.dataset.category || 'all';
            const keyword = homeSearchInput.value.trim();
            loadFeaturedCollections(category, keyword);
        });
        
        homeSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const category = document.querySelector('.featured-tabs .tab-btn.active')?.dataset.category || 'all';
                const keyword = this.value.trim();
                loadFeaturedCollections(category, keyword);
            }
        });
    }
}

// ===================================
// 加载首页精选藏品
// ===================================
function loadFeaturedCollections(category = 'all', keyword = '') {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    
    let filtered = collections.filter(item => item.isFeatured);
    
    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }
    
    if (keyword) {
        filtered = filtered.filter(item => 
            item.title.includes(keyword) || 
            item.summary.includes(keyword)
        );
    }
    
    grid.innerHTML = filtered.slice(0, 8).map(item => createCollectionCard(item)).join('');
    
    // 添加点击事件跳转到详情页
    grid.querySelectorAll('.collection-card').forEach((card, index) => {
        card.addEventListener('click', function() {
            window.location.href = `collection-detail.html?id=${filtered[index].id}`;
        });
    });
}

// ===================================
// 加载首页新闻
// ===================================
function loadHomeNews(category = 'all') {
    const grid = document.getElementById('homeNewsGrid');
    if (!grid) return;
    
    let filtered = news;
    
    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }
    
    grid.innerHTML = filtered.slice(0, 6).map(item => createNewsCard(item)).join('');
    
    // 添加点击事件
    grid.querySelectorAll('.news-card').forEach((card, index) => {
        card.addEventListener('click', function() {
            window.location.href = `news-detail.html?id=${filtered[index].id}`;
        });
    });
}

// ===================================
// 创建藏品卡片 HTML
// ===================================
function createCollectionCard(item) {
    const statusText = COLLECTION_STATUS[item.status];
    const categoryText = COLLECTION_CATEGORIES[item.category];
    
    return `
        <div class="collection-card fade-in">
            <div class="card-image">
                <img src="${item.coverImage}" alt="${item.title}" loading="lazy">
                <span class="card-status ${item.status}">${statusText}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-meta">
                    <span class="card-category">${categoryText}</span>
                    <span> · </span>
                    <span>${item.summary.substring(0, 20)}...</span>
                </p>
            </div>
        </div>
    `;
}

// ===================================
// 创建新闻卡片 HTML
// ===================================
function createNewsCard(item) {
    const categoryText = NEWS_CATEGORIES[item.category];
    const date = new Date(item.publishAt).toLocaleDateString('zh-CN');
    
    return `
        <div class="news-card fade-in">
            <div class="news-image">
                <img src="${item.coverImage}" alt="${item.title}" loading="lazy">
            </div>
            <div class="news-content">
                <span class="news-category">${categoryText}</span>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-summary">${item.summary}</p>
                <span class="news-date">${date}</span>
            </div>
        </div>
    `;
}

// ===================================
// 统计数字滚动动画
// ===================================
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumbers(element) {
    const target = parseInt(element.dataset.target);
    const duration = 1500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===================================
// 搜索功能（通用）
// ===================================
function initSearch() {
    // 藏品页搜索
    const collectionSearchInput = document.getElementById('collectionSearchInput');
    const collectionSearchBtn = document.getElementById('collectionSearchBtn');
    
    if (collectionSearchBtn) {
        collectionSearchBtn.addEventListener('click', function() {
            performCollectionSearch();
        });
    }
    
    if (collectionSearchInput) {
        collectionSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performCollectionSearch();
            }
        });
    }
    
    // 新闻页搜索
    const newsSearchInput = document.getElementById('newsSearchInput');
    const newsSearchBtn = document.getElementById('newsSearchBtn');
    
    if (newsSearchBtn) {
        newsSearchBtn.addEventListener('click', function() {
            performNewsSearch();
        });
    }
    
    if (newsSearchInput) {
        newsSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performNewsSearch();
            }
        });
    }
}

function performCollectionSearch() {
    const keyword = document.getElementById('collectionSearchInput')?.value.trim() || '';
    const category = document.querySelector('.filter-tabs .active')?.dataset.category || 'all';
    const status = document.querySelector('.filter-status .active')?.dataset.status || 'all';
    
    loadCollections(category, status, keyword);
}

function performNewsSearch() {
    const keyword = document.getElementById('newsSearchInput')?.value.trim() || '';
    const category = document.querySelector('.filter-tabs .active')?.dataset.category || 'all';
    
    loadNews(category, keyword);
}

// ===================================
// 加载藏品列表
// ===================================
function loadCollections(category = 'all', status = 'all', keyword = '', page = 1, pageSize = 12) {
    const grid = document.getElementById('collectionGrid');
    if (!grid) return;
    
    let filtered = [...collections];
    
    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }
    
    if (status !== 'all') {
        filtered = filtered.filter(item => item.status === status);
    }
    
    if (keyword) {
        filtered = filtered.filter(item => 
            item.title.includes(keyword) || 
            item.summary.includes(keyword)
        );
    }
    
    // 分页
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    
    grid.innerHTML = paged.map(item => createCollectionCard(item)).join('');
    
    // 添加点击事件
    grid.querySelectorAll('.collection-card').forEach((card, index) => {
        card.addEventListener('click', function() {
            window.location.href = `collection-detail.html?id=${paged[index].id}`;
        });
    });
    
    // 渲染分页
    renderPagination(totalPages, page);
}

// ===================================
// 加载新闻列表
// ===================================
function loadNews(category = 'all', keyword = '', page = 1, pageSize = 9) {
    const grid = document.getElementById('newsListGrid');
    if (!grid) return;
    
    let filtered = [...news];
    
    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }
    
    if (keyword) {
        filtered = filtered.filter(item => 
            item.title.includes(keyword) || 
            item.summary.includes(keyword)
        );
    }
    
    // 按发布时间排序
    filtered.sort((a, b) => new Date(b.publishAt) - new Date(a.publishAt));
    
    // 分页
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    
    grid.innerHTML = paged.map(item => createNewsCard(item)).join('');
    
    // 添加点击事件
    grid.querySelectorAll('.news-card').forEach((card, index) => {
        card.addEventListener('click', function() {
            window.location.href = `news-detail.html?id=${paged[index].id}`;
        });
    });
    
    // 渲染分页
    renderPagination(totalPages, page);
}

// ===================================
// 渲染分页
// ===================================
function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // 上一页
    if (currentPage > 1) {
        html += `<button class="page-btn" data-page="${currentPage - 1}">‹</button>`;
    }
    
    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    // 下一页
    if (currentPage < totalPages) {
        html += `<button class="page-btn" data-page="${currentPage + 1}">›</button>`;
    }
    
    pagination.innerHTML = html;
    
    // 添加点击事件
    pagination.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            
            // 触发相应的搜索/加载函数
            if (document.getElementById('collectionGrid')) {
                const category = document.querySelector('.filter-tabs .active')?.dataset.category || 'all';
                const status = document.querySelector('.filter-status .active')?.dataset.status || 'all';
                const keyword = document.getElementById('collectionSearchInput')?.value.trim() || '';
                loadCollections(category, status, keyword, page);
            } else if (document.getElementById('newsListGrid')) {
                const category = document.querySelector('.filter-tabs .active')?.dataset.category || 'all';
                const keyword = document.getElementById('newsSearchInput')?.value.trim() || '';
                loadNews(category, keyword, page);
            }
            
            // 滚动到顶部
            window.scrollTo({ top: 300, behavior: 'smooth' });
        });
    });
}

// ===================================
// 提交表单处理
// ===================================
function initSubmissionForm() {
    const form = document.getElementById('submissionForm');
    if (!form) return;
    
    const submitBtn = form.querySelector('.form-submit .btn');
    const fileInput = form.querySelector('#itemImages');
    const previewContainer = form.querySelector('.image-preview');
    
    let uploadedImages = [];
    
    // 文件上传预览
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                if (uploadedImages.length >= 6) {
                    alert('最多上传6张图片');
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    alert('请上传图片文件');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    alert('图片大小不能超过5MB');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    uploadedImages.push(event.target.result);
                    renderImagePreview();
                };
                reader.readAsDataURL(file);
            });
            
            // 清空input以便重复选择同一文件
            this.value = '';
        });
    }
    
    function renderImagePreview() {
        if (!previewContainer) return;
        
        previewContainer.innerHTML = uploadedImages.map((src, index) => `
            <div class="image-preview-item">
                <img src="${src}" alt="预览图片${index + 1}">
                <button type="button" class="remove-btn" data-index="${index}">×</button>
            </div>
        `).join('');
        
        // 删除图片
        previewContainer.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                uploadedImages.splice(index, 1);
                renderImagePreview();
            });
        });
    }
    
    // 表单提交 - 保存到localStorage
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 验证
        if (!validateForm()) {
            return;
        }
        
        // 禁用按钮
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
        
        // 收集表单数据
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
        
        // 保存到localStorage
        const submissions = JSON.parse(localStorage.getItem('jiafu_submissions') || '[]');
        submissions.unshift(submission);
        localStorage.setItem('jiafu_submissions', JSON.stringify(submissions));
        
        // 显示成功提示
        setTimeout(function() {
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
                <div class="form-success">
                    <div class="form-success-icon">✅</div>
                    <h3>提交成功</h3>
                    <p>我们已经收到您的藏品信息，将尽快与您联系</p>
                    <a href="consignment.html" class="btn btn-primary">查看征集流程</a>
                </div>
            `;
        }, 800);
    });
    
    function validateForm() {
        let isValid = true;
        
        // 必填字段验证
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const group = field.closest('.form-group');
            if (!field.value.trim()) {
                group.classList.add('error');
                isValid = false;
            } else {
                group.classList.remove('error');
            }
        });
        
        // 手机号验证
        const mobileField = form.querySelector('#contactMobile');
        if (mobileField && mobileField.value) {
            const mobileRegex = /^1[3-9]\d{9}$/;
            if (!mobileRegex.test(mobileField.value)) {
                const group = mobileField.closest('.form-group');
                group.classList.add('error');
                isValid = false;
            }
        }
        
        // 隐私条款验证
        const privacyCheckbox = form.querySelector('#privacyAgree');
        if (!privacyCheckbox.checked) {
            alert('请阅读并同意隐私条款');
            isValid = false;
        }
        
        return isValid;
    }
    
    // 移除错误状态
    form.querySelectorAll('.form-input, .form-select').forEach(field => {
        field.addEventListener('input', function() {
            this.closest('.form-group').classList.remove('error');
        });
    });
}

// ===================================
// 工具函数：获取URL参数
// ===================================
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}
