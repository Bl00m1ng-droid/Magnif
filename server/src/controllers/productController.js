const prisma = require('../prismaClient');
//Database queries take time (network round trip to the DB), so they're asynchronous
//async function marks a function that can pause and wait
async function getAllProducts(req,res){
    const products = await prisma.product.findMany(); //await is where it actually pauses,until the Prisma query resolves with real data
    res.json(products);
};

async function getProductById(req,res){
    const {id} = req.params;
    //const product = products.find((product)=> (product.id === parseInt(id)));
    const product = await prisma.product.findUnique({
        where: {id: parseInt(id)},
    });

    if(product){
       res.json(product);
    }else{
         res.status(404).json({message:"Product not found"});
        }

}

 module.exports = {getAllProducts,getProductById};