# 📦 嘉孚堂 (jiafutang) 项目完整文档

## 项目概述

**嘉孚堂** 是一个艺术品拍卖网站，提供藏品展示、新闻资讯、委托拍卖等功能。

---

## 🏗️ 技术架构

| 技术 | 说明 |
|------|------|
| 前端 | 静态 HTML + CSS + JavaScript |
| 后端 | Cloudflare Workers API |
| 数据库 | Cloudflare D1 (SQLite) |
| 图片 | Cloudinary CDN |
| 部署 | Cloudflare Pages |

---

## 📁 项目结构

```
jiafutang/
├── index.html          # 首页
├── news.html          # 新闻列表
├── news-detail.html   # 新闻详情
├── collections.html  # 藏品列表
├── collection-detail.html # 藏品详情
├── about.html         # 关于我们
├── submission.html    # 提交藏品
├── consignment.html  # 委托拍卖
├── privacy.html      # 隐私政策
├── disclaimer.html   # 免责声明
│
├── admin/            # 后台管理
│   ├── index.html   # 管理登录
│   ├── dashboard.html
│   ├── collections.html
│   ├── news.html
│   └── js/
│       ├── api.js
│       └── auth.js
│
├── js/
│   ├── data.js      # 数据加载 + 卡片创建
│   └── main.js      # UI交互 + 功能初始化
│
├── css/
│   └── style.css    # 样式文件
│
├── images/           # 图片资源
│
├── _worker.js       # 后端 API
├── wrangler.toml    # Cloudflare 配置
└── _redirects       # 路由重定向
```

---

## 🔗 链接

| 服务 | 地址 |
|------|------|
| **网站** | https://jiafutang.pages.dev |
| **后台** | https://jiafutang.pages.dev/admin/ |
| **API** | https://jiafutang.dongranranface.workers.dev |
| **管理员** | admin / admin123 |

---

## 📡 API 接口

### 公开接口 (GET)

| 接口 | 说明 |
|------|------|
| `/api/collections` | 获取藏品列表 |
| `/api/collections/{id}` | 获取单个藏品 |
| `/api/news` | 获取新闻列表 |
| `/api/news/{id}` | 获取单条新闻 |
| `/api/submissions` | 获取提交列表 |

### 管理接口 (POST/PUT/DELETE)

| 接口 | 说明 |
|------|------|
| `/api/collections` | 创建藏品 |
| `/api/collections/{id}` | 更新/删除藏品 |
| `/api/news` | 创建新闻 |
| `/api/news/{id}` | 更新/删除新闻 |

---

## 🗄️ 数据库表

### collections (藏品)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| title | TEXT | 标题 |
| category | TEXT | 分类 |
| status | TEXT | 状态 |
| cover_image | TEXT | 封面图 |
| summary | TEXT | 摘要 |
| content | TEXT | 内容 |
| is_featured | INTEGER | 是否精选 |
| sort | INTEGER | 排序 |

### news (新闻)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| title | TEXT | 标题 |
| category | TEXT | 分类 |
| cover_image | TEXT | 封面图 |
| summary | TEXT | 摘要 |
| content | TEXT | 内容 |
| is_top | INTEGER | 是否置顶 |
| is_featured | INTEGER | 是否精选 |
| sort | INTEGER | 排序 |

### submissions (提交)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| item_name | TEXT | 物品名称 |
| category | TEXT | 分类 |
| estimated_value | TEXT | 估价 |
| description | TEXT | 描述 |
| contact_name | TEXT | 联系人 |
| contact_mobile | TEXT | 手机号 |
| status | TEXT | 状态 |

### operation_logs (操作日志)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| timestamp | INTEGER | 时间戳 |
| method | TEXT | 请求方法 |
| path | TEXT | 请求路径 |
| action | TEXT | 操作类型 |
| user_ip | TEXT | 用户IP |

---

## 🔧 部署

```bash
# 部署到 Cloudflare Pages
wrangler pages deploy .

# 或使用 GitHub Actions 自动部署
```

---

## 📝 开发指南

### 数据加载流程

1. `data.js` 加载 API 数据
2. `data.js` 创建卡片 HTML
3. `main.js` 处理 UI 交互

### 卡片组件

- **createCollectionCard()** - 创建藏品卡片
- **createNewsCard()** - 创建新闻卡片

---

*最后更新: 2026-03-02*
