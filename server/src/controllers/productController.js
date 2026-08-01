const prisma = require('../prismaClient');
//Database queries take time (network round trip to the DB), so they're asynchronous
//async function marks a function that can pause and wait
async function getAllProducts(req,res){
    const products = await prisma.product.findMany({
        include: {variants: true}, //include the variants associated with each product
    }); //await is where it actually pauses,until the Prisma query resolves with real data
    res.json(products);
};

async function getProductById(req,res){
    const {id} = req.params;
    //const product = products.find((product)=> (product.id === parseInt(id)));
    const product = await prisma.product.findUnique({
        where: {id: parseInt(id)},
        include: {
            variants: true,
            reviews:{include:{user: true},orderBy:{createdAt:'desc'}},
        }, //include the variants and reviews associated with the product
    });

    if(product){
       res.json(product);
    }else{
         res.status(404).json({message:"Product not found"});
        }
}

async function createProduct(req,res){
    const {name,category,description,variants} = req.body;
    {/**req.body - where Express puts the JSON payload the client sent.
         This only works because you already have app.use(express.json()) in app.js 
         — that middleware parses incoming JSON into req.body automatically.
          Without it, req.body would be undefined */}

    const newProduct = await prisma.product.create({
        data:{
            name,
            category,
            description,
            variants: {
                create: variants.map((v) => ({
                    measurement: v.measurement,
                    price: parseFloat(v.price),
                    stockQty: parseInt(v.stockQty),
                })), //create the associated variants in the same operation
            },
        },
        include: {variants: true}, //include the variants associated with the product
    });
    res.status(201).json(newProduct);
}

async function updateProduct(req,res){
    const {id} =  req.params;
    const {name,category,description} = req.body;

    //prism.update - updates a record in the database,only the fields you specify in data:{...}
    const product = await prisma.product.update({
        where:{id: parseInt(id)},
        data: {name,category,description},
    });
    res.json(product); //res.json(...) - always implies heres some data, and the status code is 200 OK by default
}

async function deleteProduct(req,res){
    const {id} = req.params;

    try{
        await prisma.product.delete({
            where:{id: parseInt(id)},
        });
        res.status(204).send(); //204 No Content - indicates successful deletion with no response body
    } catch (err) {
        //P2003 is a Prisma error code that indicates a foreign key constraint violation. This means that the product you're trying to delete is still referenced by other records in the database, such as variants or order history. In this case, we return a 400 Bad Request status with a message explaining why the deletion failed.
        if(err.code === 'P2003' || (err.message && err.message.includes('foreign key constraint'))){
            return res.status(400).json({
                message:"Cannot delete this product - it still has variants or order history linked to it",
            });
        }
        console.error(err);
        res.status(500).json({message:"Something went wrong while deleting the product"});
    }
}

 module.exports = {getAllProducts,getProductById, createProduct, updateProduct, deleteProduct};