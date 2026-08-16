const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const resend = new Resend(process.env.RESEND_API_KEY);
const posterPath = path.join(__dirname, '../assets/magnif-poster.png');

function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${process.env.BACKEND_URL || 'http://localhost:5000'}${url}`;
}

async function sendReceiptEmail(order) {
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const posterBuffer = fs.readFileSync(posterPath);

  const attachments = [
    {
      filename: 'magnif-poster.png',
      content: posterBuffer,
      content_id: 'posterImage',
      content_type: 'image/png',
    },
  ];

  const itemRows = order.items
    .map((item, index) => {
      const product = item.productVariant.product;
      const imageUrl = resolveImageUrl(product.imageUrl);
      const cid = `productImage${index}`;

      if (imageUrl) {
        attachments.push({
          filename: `product-${index}.jpg`,
          path: imageUrl,
          content_id: cid,
        });
      }

      return `
        <tr>
          <td style="padding:8px; vertical-align:middle;">
            ${imageUrl ? `<img src="cid:${cid}" width="50" height="50" style="border-radius:6px; object-fit:cover;" />` : ''}
          </td>
          <td style="padding:8px; vertical-align:middle;">
            ${product.name} (${item.productVariant.measurement}) x${item.quantity}
          </td>
          <td style="padding:8px; vertical-align:middle; text-align:right;">
            $${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join('');

  await resend.emails.send({
    from: 'Magnif <onboarding@resend.dev>',
    to: order.user.email,
    subject: `Your Magnif order #${order.id} is confirmed`,
    html: `
      <p>Hi ${order.user.name}!</p>
      <p>Thank you for your order. Here is your receipt:</p>
      <table style="width:100%; border-collapse:collapse;">
        ${itemRows}
      </table>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p>Delivery address: ${order.deliveryAddress}</p>
      <p><img src="cid:posterImage" alt="Magnif Poster"/></p>
      <p>-Magnif Pvt Limited</p>
    `,
    attachments,
  });
}

module.exports = { sendReceiptEmail };