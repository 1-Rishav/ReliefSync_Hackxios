const Razorpay = require('razorpay');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { pushToRoles } = require('./notification.controller');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});
const pendingPayments = {};
exports.createDonation = async (req, res) => {
  const { amount, needyName, needyUPI } = req.body;

  try {
    const donationId = uuidv4();

    pendingPayments[donationId] = {
      amount,
      needyName,
      needyUPI,
      status: "pending",
      userId: req.user?.id
    };

    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(amount) * 100,
      currency: "INR",
      description: `Donation to ${needyName}`,
      reference_id: donationId,
      notes: {
        donation_id: donationId,
        needy_upi: needyUPI
      }
    });

    return res.status(200).json({
      success: true,
      donationId,
      paymentLink: paymentLink.short_url ?? `https://rzp.io/i/${paymentLink.id}`
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.RazorpayWebHook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (expectedSignature !== req.headers["x-razorpay-signature"]) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = req.body;
  const io = req.app.get("io");

  try {
    if (event.event === "payment_link.paid") {
      const payment = event.payload.payment.entity;
      const paymentLink = event.payload.payment_link.entity;

      const donationId =
        paymentLink.notes?.donation_id || paymentLink.reference_id;

      const paidAmount = payment.amount / 100;


      if (pendingPayments[donationId]) {
        pendingPayments[donationId].status = "success";
        pendingPayments[donationId].paidAmount = paidAmount;
      }

      // Emit to only that user
      io.to(donationId).emit("payment_update", {
        donationId,
        status: "success",
        amount: paidAmount,
        currency: payment.currency,
        paymentId: payment.id
      });
      await pushToRoles({
        roles: ["admin"],
        pushType: "Payment_Success",
        data: {
          paidAmount,
          name: pendingPayments[donationId].needyName,
          upiId: pendingPayments[donationId].needyUPI
        }
      })
      //console.log(`Payment confirmed for ${donationId}: ₹${paidAmount}`);
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Webhook error" });
  }
};