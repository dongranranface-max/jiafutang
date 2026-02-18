const API_URL = 'https://jiafutang-api.dongranranface.workers.dev';

const updates = [
{ id: 4, cover_image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800' }, // 山水画
{ id: 5, cover_image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800' }, // 静物油画
{ id: 6, cover_image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800' }, // 书法
{ id: 7, cover_image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800' }, // 雕塑
{ id: 8, cover_image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800' }, // 青花瓷
{ id: 9, cover_image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800' }, // 铜香炉
{ id: 10, cover_image: 'https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?w=800' }, // 玉手镯
{ id: 11, cover_image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800' }, // 紫砂壶
{ id: 12, cover_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800' }, // 红宝石戒指
{ id: 13, cover_image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800' }, // 翡翠
{ id: 14, cover_image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800' }, // 名表
{ id: 15, cover_image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800' }, // 香奈儿
{ id: 16, cover_image: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=800' }, // 人民币
{ id: 17, cover_image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800' }, // 银元
{ id: 18, cover_image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800' }, // 邮票
{ id: 19, cover_image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800' }, // 熊猫币
{ id: 20, cover_image: 'https://images.unsplash.com/photo-1600102302258-831721792962?w=800' }, // 黄花梨
{ id: 21, cover_image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800' }, // 沉香
{ id: 22, cover_image: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=800' }, // 紫檀
{ id: 23, cover_image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800' }  // 琥珀
];

async function updateCollection(item) {
  try {
    const res = await fetch(API_URL + '/api/collections/' + item.id, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(item)
    });
    console.log('Updated:', item.id, '- Status:', res.status);
    return res.ok;
  } catch(e) {
    console.error('Error:', item.id, '-', e.message);
    return false;
  }
}

async function main() {
  console.log('Starting update...');
  for (const item of updates) {
    await updateCollection(item);
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('Done!');
}

main();
