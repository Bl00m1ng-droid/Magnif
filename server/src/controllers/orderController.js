const prisma = require('../prismaClient');

async function createOrder(req,res){
    const userID = req.user.id; // set by requireAuth middleware
    //never take the userId from the request body, always use the one from the token to prevent malicious users from creating orders for other users
    const {items,deliveryAddress} = req.body;
    // items: [{ productVariantId, quantity, price }, ...]

    if(!items || items.length === 0){
        return res.status(400).json({error: "Cart is empty"});
    }

    const order = await prisma.order.create({
        data: {
            userId: userID,
            deliveryAddress: deliveryAddress,
            items:{
                create: items.map(item => ({
                    productVariantId: item.productVariantId,
                    quantity: item.quantity,
                    price: item.price
                })),
            },
        },
        include:{items:true},
    });

    res.status(201).json(order);
}

async function getMyOrders(req,res){
    const userId= req.user.id;

    const orders = await prisma.order.findMany({
        where: {userId},
        include:{items: {include:{productVariant:{include:{product:true}}}}},
        orderBy:{createdAt:'desc'},
        //orderBy: { createdAt: 'desc' }, - sorts newest orders first
    });
    res.json(orders);
}

async function getAllOrders(req,res){
    const orders = await prisma.order.findMany({
        include:{
            user: true,
            items:{include:{productVariant:{include:{product:true}}}},
        },
        orderBy:{createdAt:'desc'},
        });
        res.json(orders);
}

async function updateDeliveryStatus(req,res){
    const {id} = req.params;
    const {deliveryStatus} = req.body;

    const validStatuses = ["processing", "shipped","out for delivery","delivered"];
    if(!validStatuses.includes(deliveryStatus)){
        return res.status(400).json({message: "Invalid delivery status"});
    }

    const order = await prisma.order.update({
        where:{id:parseInt(id)},
        data: {deliveryStatus},
    });
    res.json(order);

}

module.exports = {createOrder,getMyOrders,getAllOrders,updateDeliveryStatus};
