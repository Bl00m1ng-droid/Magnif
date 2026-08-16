const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const resend = new Resend(process.env.RESEND_API_KEY);

const posterPath = path.join(__dirname, '../assets/magnif-poster.png');

async function sendReceiptEmail(order) {
  const itemsList = order.items
    .map(
      (item) =>
        `${item.productVariant.product.name} (${item.productVariant.measurement}) x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`
    )
    .join('<br/>');

  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const posterBuffer = fs.readFileSync(posterPath);

  await resend.emails.send({
    from: 'Magnif <onboarding@resend.dev>',
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
        content: posterBuffer,
        content_id: 'posterImage',
        contentType: 'image/png',
      },
    ],
  });
}

module.exports = { sendReceiptEmail };