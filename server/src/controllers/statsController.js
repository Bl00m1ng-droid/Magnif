const prisma = require('../prismaClient');
const PDFDocument = require('pdfkit');
const path = require('path');

const COLORS = {
  navy: '#0B1B42',
  green: '#4E9B02',
  orange: '#F2601C',
  text: '#14171C',
  muted: '#5B6472',
  border: '#E3E5E0',
};

async function getStats(req,res){
    const variants = await prisma.productVariant.findMany({
        include: {product:true},
    });

    const totalStockValue = variants.reduce((sum,v) =>
         sum + v.price * v.stockQty, 0);

    const lowStockVariants = variants.filter((v) => v.stockQty < 10);

    const orderItems = await prisma.orderItem.findMany({
        include: {productVariant: true, order: true},
        where:{order:{paymentStatus: 'paid'}},
    });

    const revenue = orderItems.reduce((sum,item) => 
        sum + item.price * item.quantity, 0);

    const costOfGoodsSold =orderItems.reduce((sum,item) => 
        sum + item.productVariant.cost * item.quantity,0);

    const profit = revenue - costOfGoodsSold;

    res.json({
        totalStockValue,
        lowStockVariants: lowStockVariants.map((v) => ({
            id: v.id,
            name: v.product.name,
            measurement: v.measurement,
            stockQty: v.stockQty,
        })),
        revenue,
        costOfGoodsSold,
        profit,
        totalOrders : await prisma.order.count(),
    });
}

async function getMonthlyStatement(req, res) {
  const { month, year } = req.query; // e.g. ?month=8&year=2026

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1); // first day of the *next* month

  const orderItems = await prisma.orderItem.findMany({
    include: { productVariant: { include: { product: true } }, order: true },
    where: {
      order: {
        paymentStatus: 'paid',
        createdAt: { gte: startDate, lt: endDate },
      },
    },
  });

  const revenue = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cost = orderItems.reduce((sum, item) => sum + item.productVariant.cost * item.quantity, 0);
  const profit = revenue - cost;

  const orderCount = new Set(orderItems.map((item) => item.order.id)).size;

  res.json({
    month: parseInt(month),
    year: parseInt(year),
    revenue,
    cost,
    profit,
    orderCount,
    items: orderItems,
  });
}


async function downloadMonthlyStatement(req, res) {
  const { month, year } = req.query;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const orderItems = await prisma.orderItem.findMany({
    include: { productVariant: { include: { product: true } }, order: true },
    where: { order: { paymentStatus: 'paid', createdAt: { gte: startDate, lt: endDate } } },
  });

  const revenue = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cost = orderItems.reduce((sum, item) => sum + item.productVariant.cost * item.quantity, 0);
  const profit = revenue - cost;
  const monthName = startDate.toLocaleString('default', { month: 'long' });
  const orderCount = new Set(orderItems.map((item) => item.order.id)).size;

  const doc = new PDFDocument({ margin: 0 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="magnif-statement-${monthName}-${year}.pdf"`);
  doc.pipe(res);
  // ---- Header band ----
  doc.rect(0, 0, doc.page.width, 110).fill(COLORS.navy);

  const logoPath = path.join(__dirname, '../assets/magnif-logo.jpg');
  doc.image(logoPath, 50, 25, { width: 130 });

  doc
    .fillColor('#FFFFFF')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('Monthly Statement', 0, 35, { align: 'right', width: doc.page.width - 50 });
  doc
    .fontSize(12)
    .font('Helvetica')
    .fillColor('#FFFFFF')
    .opacity(0.8)
    .text(`${monthName} ${year}`, 0, 60, { align: 'right', width: doc.page.width - 50 })
    .opacity(1);
  
  doc
  .fontSize(9)
  .fillColor('#FFFFFF')
  .opacity(0.6)
  .text(`Generated on ${new Date().toLocaleDateString()}`, 0, 78, { align: 'right', width: doc.page.width - 50 })
  .opacity(1);

  doc.moveDown();
  doc.y = 140;
  doc.x = 50;
  // ---- Summary cards ----
  const cardY = doc.y;
  const cardWidth = 150;
  const cardGap = 15;
  const summaryData = [
    { label: 'Orders', value: orderCount, color: COLORS.navy },
    { label: 'Revenue', value: `$${revenue.toFixed(2)}`, color: COLORS.orange },
    { label: 'Profit', value: `$${profit.toFixed(2)}`, color: COLORS.green },
  ];

  summaryData.forEach((item, i) => {
    const x = 50 + i * (cardWidth + cardGap);
    doc.roundedRect(x, cardY, cardWidth, 70, 6).fillAndStroke('#FFFFFF', COLORS.border);
    doc.fillColor(COLORS.muted).fontSize(9).font('Helvetica').text(item.label.toUpperCase(), x + 12, cardY + 14);
    doc.fillColor(item.color).fontSize(18).font('Helvetica-Bold').text(String(item.value), x + 12, cardY + 32);
  });

  doc.y = cardY + 100;
  doc.x = 50;
  // ---- Line items table ----
  doc.fillColor(COLORS.navy).fontSize(13).font('Helvetica-Bold').text('Order Line Items', 50, doc.y);
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const colX = { order: 50, product: 110, qty: 380, total: 440 };

  doc.fontSize(9).fillColor(COLORS.muted).font('Helvetica-Bold');
  doc.text('ORDER', colX.order, tableTop);
  doc.text('PRODUCT', colX.product, tableTop);
  doc.text('QTY', colX.qty, tableTop);
  doc.text('TOTAL', colX.total, tableTop);
  doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).strokeColor(COLORS.border).stroke();

  let rowY = tableTop + 24;
  doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.text);

  orderItems.forEach((item) => {
    if (rowY > 760) {
      doc.addPage();
      rowY = 50;
    }
    doc.text(`#${item.order.id}`, colX.order, rowY);
    doc.text(`${item.productVariant.product.name} (${item.productVariant.measurement})`, colX.product, rowY, { width: 260 });
    doc.text(String(item.quantity), colX.qty, rowY);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, colX.total, rowY);
    rowY += 20;
    });

  doc.moveTo(50, rowY + 5).lineTo(545, rowY + 5).strokeColor(COLORS.border).stroke();

  // ---- Footer ----
  doc.fontSize(8).fillColor(COLORS.muted).text(
    `Generated by Magnif on ${new Date().toLocaleDateString()}`,
    50,
    780,
    { align: 'center', width: 495 }
  );

  doc.end();
}

module.exports = { getStats, getMonthlyStatement, downloadMonthlyStatement };
