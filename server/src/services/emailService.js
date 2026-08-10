const nodemailer = require('nodemailer');
const path = require('path');

// resolve the image path relative to this file
const posterPath = path.join(__dirname, '../../../client/src/assets/magnif-poster.png');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendReceiptEmail(order){
    const itemsList = order.items.map((item) => 
        `${item.productVariant.product.name} (${item.productVariant.measurement})
    x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('<br/>');

    const total = order.items.reduce((sum,item) => sum + item.price * item.quantity,0);

    await transporter.sendMail({
        from: `"Magnif" <${process.env.EMAIL_USER}>`,
        to: order.user.email,
        subject: `Your Magnif order #${order.id} is confirmed`,
        html: `
            <p>Hi ${order.user.name}!</p>
            <p>Thank you for your order</p>
            <p>Here is your receipt:</p>
            <p>${itemsList}</p>
            <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            <p>Delivery address: ${order.deliveryAddress}</p>
            <p><img src="cid:posterImage" alt="Magnif Poster"/></p>
            <p>-Magnif Pvt Limited</p>
        `,
        attachments: [
            {
                filename: 'magnif-poster.png',
                path: posterPath,       // imported path to your image
                cid: 'posterImage'  // must match the cid in <img src="cid:posterImage"/>
            }
        ]
    });
}


module.exports = {sendReceiptEmail};