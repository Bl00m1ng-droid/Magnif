const prisma = require('../prismaClient');

async function createReview(req,res){
    const userId = req.user.id; // set by requireAuth middleware
    const {productId,rating,comment} = req.body;
    
    if(!rating || rating <1 || rating >5){
        return res.status(400).json({error: "Rating must be between 1 and 5"});
    }

    const review = await prisma.review.create({
        data:{
            productId: parseInt(productId),
            userId,
            rating: parseInt(rating),
            comment,
        },
        include:{user:true},
    });

    res.status(201).json(review);
}

module.exports = {createReview};