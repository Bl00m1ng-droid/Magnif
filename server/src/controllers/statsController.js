const prisma = require('../prismaClient');

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

module.exports = {getStats};