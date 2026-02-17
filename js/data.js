// ===================================
// 嘉孚堂官网 - 数据配置
// ===================================

// 藏品分类
const COLLECTION_CATEGORIES = {
    all: '全部',
    art: '艺术品',
    antique: '古董文物',
    jewelry: '珠宝奢侈品',
    coin: '文献邮币',
    nft: '数字藏品',
    misc: '杂项'
};

// 藏品状态
const COLLECTION_STATUS = {
    sold: '已拍卖',
    unsold: '未拍卖',
    coming: '即将拍卖'
};

// 藏品数据
var collections = [];
var news = [];

// 页面加载时获取数据 - 从localStorage读取
(function loadData() {
    // 从 localStorage 读取
    const storedCollections = localStorage.getItem('jiafu_collections');
    const storedNews = localStorage.getItem('jiafu_news');
    
    if (storedCollections) {
        try {
            window.collections = JSON.parse(storedCollections);
        } catch(e) {
            window.collections = getDefaultCollections();
        }
    } else {
        window.collections = getDefaultCollections();
    }
    
    if (storedNews) {
        try {
            window.news = JSON.parse(storedNews);
        } catch(e) {
            window.news = getDefaultNews();
        }
    } else {
        window.news = getDefaultNews();
    }
    
    console.log('Loaded from localStorage:', window.collections.length, 'collections,', window.news.length, 'news');
    
    // 延迟刷新页面
    setTimeout(function() {
        if (typeof refreshCollections === 'function') refreshCollections();
        if (typeof refreshNews === 'function') refreshNews();
    }, 100);
})();

// 全局变量引用（兼容）
var collections = window.collections || [];
var news = window.news || [];

function getDefaultCollections() {
    return [
        {id:1,title:'清代紫檀木雕福禄寿屏风',category:'antique',status:'sold',coverImage:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',summary:'清代晚期紫檀木雕',isFeatured:true,sort:1},
        {id:2,title:'民国粉彩人物故事瓶',category:'antique',status:'coming',coverImage:'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',summary:'民国粉彩名品',isFeatured:true,sort:2},
        {id:3,title:'明式黄花梨官帽椅',category:'antique',status:'sold',coverImage:'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',summary:'明式家具',isFeatured:false,sort:3},
        {id:4,title:'宋代建窑兔毫盏',category:'antique',status:'sold',coverImage:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',summary:'宋代建窑',isFeatured:false,sort:4},
        {id:5,title:'齐白石《虾趣图》',category:'art',status:'sold',coverImage:'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400',summary:'齐白石精品',isFeatured:true,sort:5},
        {id:6,title:'张大千《山水四条屏》',category:'art',status:'unsold',coverImage:'https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?w=400',summary:'张大千山水',isFeatured:true,sort:6},
        {id:7,title:'傅抱石《山水长卷》',category:'art',status:'coming',coverImage:'https://images.unsplash.com/photo-1600636567129-674c947c29b7?w=400',summary:'傅抱石力作',isFeatured:false,sort:7},
        {id:8,title:'徐悲鸿《奔马图》',category:'art',status:'unsold',coverImage:'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400',summary:'徐悲鸿代表作',isFeatured:false,sort:8},
        {id:9,title:'卡地亚钻石胸针',category:'jewelry',status:'unsold',coverImage:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',summary:'卡地亚',isFeatured:true,sort:9},
        {id:10,title:'翡翠手镯 玻璃种',category:'jewelry',status:'coming',coverImage:'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',summary:'玻璃种翡翠',isFeatured:true,sort:10},
        {id:11,title:'梵克雅宝钻石项链',category:'jewelry',status:'sold',coverImage:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',summary:'梵克雅宝',isFeatured:false,sort:11},
        {id:12,title:'红宝石戒指',category:'jewelry',status:'unsold',coverImage:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',summary:'鸽血红宝石',isFeatured:false,sort:12},
        {id:13,title:'第一版人民币全套',category:'coin',status:'sold',coverImage:'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=400',summary:'第一版人民币',isFeatured:true,sort:13},
        {id:14,title:'文革时期珍邮票',category:'coin',status:'unsold',coverImage:'https://images.unsplash.com/photo-1580196929935-77f7a7a8e389?w=400',summary:'文革邮票',isFeatured:false,sort:14},
        {id:15,title:'袁大头银元',category:'coin',status:'coming',coverImage:'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',summary:'袁大头',isFeatured:false,sort:15},
        {id:16,title:'古钱币一组',category:'coin',status:'unsold',coverImage:'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400',summary:'古钱币',isFeatured:false,sort:16},
        {id:17,title:'NFT《创世之境》',category:'nft',status:'coming',coverImage:'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400',summary:'数字艺术品',isFeatured:true,sort:17},
        {id:18,title:'NFT《星际幻想》',category:'nft',status:'unsold',coverImage:'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400',summary:'限量版NFT',isFeatured:false,sort:18},
        {id:19,title:'NFT《赛博朋克》',category:'nft',status:'sold',coverImage:'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=400',summary:'赛博朋克',isFeatured:false,sort:19},
        {id:20,title:'NFT《抽象艺术》',category:'nft',status:'unsold',coverImage:'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400',summary:'抽象NFT',isFeatured:false,sort:20},
        {id:21,title:'19世纪西洋座钟',category:'misc',status:'coming',coverImage:'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400',summary:'西洋座钟',isFeatured:false,sort:21},
        {id:22,title:'劳力士手表',category:'misc',status:'sold',coverImage:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',summary:'劳力士',isFeatured:true,sort:22},
        {id:23,title:'紫砂壶 名家款',category:'misc',status:'unsold',coverImage:'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',summary:'紫砂壶',isFeatured:false,sort:23},
        {id:24,title:'沉香手串',category:'misc',status:'coming',coverImage:'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',summary:'沉香',isFeatured:false,sort:24}
    ];
}

function getDefaultNews() {
    return [
        {id:1,title:'2026年春季艺术品拍卖会圆满落幕',category:'brand',coverImage:'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400',summary:'成交总额突破5亿元',content:'<p>拍卖会圆满落幕</p>',isTop:true,sort:1},
        {id:2,title:'收藏市场持续升温',category:'industry',coverImage:'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400',summary:'市场持续升温',content:'<p>市场升温</p>',isTop:false,sort:2},
        {id:3,title:'嘉孚堂开通线上藏品征集服务',category:'brand',coverImage:'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=400',summary:'开通服务',content:'<p>开通服务</p>',isTop:false,sort:3}
    ];
}

// 站点信息
const siteInfo = {
    name: '嘉孚堂',
    tagline: '让珍宝遇见知己',
    phone: '400-888-8888',
    email: 'service@jiafutang.com',
    address: '海南省海口区',
    icp: '沪ICP备XXXXXXXX号'
};
