const prisma = require('../prismaClient');
//Database queries take time (network round trip to the DB), so they're asynchronous
//async function marks a function that can pause and wait

async function updateVariant(req,res){
    const {id} = req.params;
    const {measurement,price,stockQty} = req.body;

    const variant = await prisma.productVariant.update({
        where:{id: parseInt(id)},
        data:{
            measurement,
            price: price !== undefined ? parseFloat(price) : undefined,
            stockQty: stockQty !== undefined ? parseInt(stockQty) : undefined,
        },
    });
    res.json(variant);
}

async function deleteVariant(req,res){
    const {id} = req.params;

    try{
        await prisma.productVariant.delete({
            where:{id: parseInt(id)},
        });
        res.status(204).send(); //204 No Content
    } catch (err) {
        if(err.code === 'P2003' || (err.message && err.message.includes('foreign key constraint'))){
            return res.status(400).json({
                message: "Cannot delete this variant - it has order history linked to it",
            });
        }
        console.error(err);
        res.status(500).json({message:"Something went wrong while deleting the variant"});
    }
}

module.exports = {updateVariant, deleteVariant};