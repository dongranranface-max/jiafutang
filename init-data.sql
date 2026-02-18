// 初始化嘉孚堂数据
// 运行: wrangler d1 execute jiafutang-db --local --file=init-data.sql

// 藏品数据 - 每个分类2款
INSERT INTO collections (title, category, status, cover_image, summary, is_featured, sort) VALUES
-- 古董文物 (antique) - 2款
('清代紫檀木雕福禄寿屏风', 'antique', 'sold', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', '清代晚期紫檀木雕精品，雕刻精细', true, 1),
('民国粉彩人物故事瓶', 'antique', 'coming', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400', '民国粉彩名品，色彩艳丽', true, 2),
-- 艺术品 (art) - 2款
('齐白石《虾趣图》', 'art', 'sold', 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400', '齐白石水墨虾图精品', true, 3),
('张大千《山水四条屏》', 'art', 'unsold', 'https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?w=400', '张大千山水力作', true, 4),
-- 珠宝奢侈品 (jewelry) - 2款
('卡地亚钻石胸针', 'jewelry', 'unsold', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', '卡地亚经典钻石胸针', true, 5),
('翡翠手镯 玻璃种', 'jewelry', 'coming', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', '玻璃种翡翠手镯', true, 6),
-- 文献邮币 (coin) - 2款
('第一版人民币全套', 'coin', 'sold', 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=400', '第一版人民币大全套', true, 7),
('文革时期珍邮票', 'coin', 'unsold', 'https://images.unsplash.com/photo-1580196929935-77f7a7a8e389?w=400', '文革时期珍贵邮票', false, 8),
-- 数字藏品 (nft) - 2款
('NFT《创世之境》', 'nft', 'coming', 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400', '数字艺术品NFT', true, 9),
('NFT《星际幻想》', 'nft', 'unsold', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400', '限量版NFT艺术品', false, 10),
-- 杂项 (misc) - 2款
('劳力士手表', 'misc', 'sold', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400', '劳力士经典款', true, 11),
('紫砂壶 名家款', 'misc', 'unsold', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400', '宜兴紫砂壶名家作品', false, 12);

-- 新闻数据 - 每个分类4条
INSERT INTO news (title, category, cover_image, summary, is_top, sort) VALUES
-- 嘉孚堂动态 (brand) - 4条
('2026年春季艺术品拍卖会圆满落幕', 'brand', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400', '成交总额突破5亿元', true, 1),
('嘉孚堂开通线上藏品征集服务', 'brand', 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=400', '足不出户完成藏品征集', false, 2),
('嘉孚堂入驻海口国际艺术品保税港', 'brand', 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400', '打造海南艺术品交易新地标', false, 3),
('嘉孚堂2026年度征集启动', 'brand', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400', '面向全球征集古董瓷器', false, 4),
-- 行业动态 (industry) - 4条
('收藏市场持续升温 艺术品成交创新高', 'industry', 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400', '市场持续升温', false, 5),
('古董瓷器成投资新宠', 'industry', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400', '宋代瓷器拍卖创新高', false, 6),
('NFT市场逐步回归理性', 'industry', 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400', '数字藏品价值重估', false, 7),
('翡翠珠宝收藏价值分析', 'industry', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', '玻璃种翡翠持续升值', false, 8);
