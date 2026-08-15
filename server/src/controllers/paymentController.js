const {Paynow} = require('paynow');
const prisma = require('../prismaClient');
const {sendReceiptEmail} = require('../services/emailService');

const paynow = new Paynow(
    process.env.PAYNOW_INTEGRATION_ID,
    process.env.PAYNOW_INTEGRATION_KEY
);

paynow.resultUrl = `${process.env.BACKEND_URL || `${import.meta.env.VITE_API_URL}`}/api/payments/result`;
paynow.returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders`;

async function initiatePayment(req,res){
    const {orderId} = req.params;
    const order = await prisma.order.findUnique({
        where:{id: parseInt(orderId)},
        include:{items:{include:{productVariant:{include:{product:true}}}},user:true},
    });

    if(!order){
        return res.status(404).json({message:"Order not found"});
    }
    //TEMPORARY: paynow test mode requires the authemail to match the merchants
    //own registered email, switch back to order.user.email once using a live integration
    const payment = paynow.createPayment(`Order - ${order.id}`, process.env.PAYNOW_MERCHANT_EMAIL);

    order.items.forEach((item) => {
    payment.add(
      `${item.productVariant.product.name} (${item.productVariant.measurement})`,
      item.price * item.quantity
    );
  });

  const response = await paynow.send(payment);

  if (response.success) {
    await prisma.order.update({
      where: { id: order.id},
      data: { paynowPollUrl: response.pollUrl },
    });

    res.json({ redirectUrl: response.redirectUrl });
  } else {
    console.error("Paynow rejected the payment:",response);
    res.status(400).json({ message: "Could not initiate payment",details:response });
  }
}

async function checkPaymentStatus(req, res) {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
     where: { id: parseInt(orderId) },
     include:{items:{include:{productVariant:{include:{product:true}}}},user:true},
  });
  
  if (!order || !order.paynowPollUrl) {
    return res.status(404).json({ message: "No payment found for this order" });
  }

  try {
    const status = await paynow.pollTransaction(order.paynowPollUrl);
    const isPaid = status.status === 'paid';

    if (isPaid && order.paymentStatus !== 'paid') {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'paid' },
      });
      await sendReceiptEmail(order);
    }

    res.json({ paid: isPaid });
  } catch (err) {
    console.error("Error polling Paynow transaction:", err);
    res.status(500).json({ message: "Could not check payment status right now" });
  }
}

module.exports = { initiatePayment, checkPaymentStatus };