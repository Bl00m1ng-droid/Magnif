const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // ---- Admin user ----
  const hashedPassword = await bcrypt.hash('ChangeMe123!', 10);

  //upsert - a combination of insert and update
  await prisma.user.upsert({
    where: { email: 'admin@magnif.co.zw' },
    update: {},
    create: {
      name: 'Magnif Admin',
      email: 'admin@magnif.co.zw',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // ---- Products ----
  const products = [
    {
      name: 'IBR',
      category: 'IBR',
      description: 'Durable, weather-resistant IBR roofing sheets.',
      variants: [
        { measurement: '0.4mm', price: 6.5, cost: 4.0, stockQty: 100 },
        { measurement: '0.3mm', price: 4.5, cost: 2.8, stockQty: 100 },
      ],
    },
    {
      name: 'Q-Tiles',
      category: 'Q-Tiles',
      description: 'Tile-profile roofing sheets combining durability with a classic look.',
      variants: [{ measurement: '0.4mm', price: 7.0, cost: 4.5, stockQty: 80 }],
    },
    {
      name: 'Ridge Caps',
      category: 'Ridge Caps',
      description: 'Ridge capping to finish and seal your roofline.',
      variants: [{ measurement: '0.4mm', price: 10.0, cost: 6.0, stockQty: 60 }],
    },
    {
      name: 'Chromadek',
      category: 'Chromadek',
      description: 'Premium coated roofing sheets, corrosion-resistant finish.',
      variants: [{ measurement: '0.4mm', price: 5.9, cost: 3.5, stockQty: 90 }],
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: product.name,
          category: product.category,
          description: product.description,
          variants: { create: product.variants },
        },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });