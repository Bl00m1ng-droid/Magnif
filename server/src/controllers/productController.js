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

async function createProduct(req,res){
    const {name,price,stockQty} = req.body;
    {/**req.body - where Express puts the JSON payload the client sent.
         This only works because you already have app.use(express.json()) in app.js 
         — that middleware parses incoming JSON into req.body automatically.
          Without it, req.body would be undefined */}

    const newProduct = await prisma.product.create({
        data:{
            name,
            price: parseFloat(price),
            stockQty: parseInt(stockQty),
        },
    });
    res.status(201).json(newProduct);
}

 module.exports = {getAllProducts,getProductById, createProduct};