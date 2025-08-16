const crypto = require("crypto");
require("dotenv").config();

exports.createPayPhiOrder = (req, res) => {
  console.log("🔥 /create-order hit");
  console.log("👉 req.body:", req.body);
  console.log("👉 Content-Type:", req.headers["content-type"]);

  try {
    const { amount, userId } = req.body;

    if (!amount || !userId) {
      console.error("🚨 Missing amount or userId");
      return res.status(400).send("Missing amount or userId in request.");
    }

    const merchantId = process.env.PAYPHI_MERCHANT_ID || "JP2000000000031";
    const secretKey = process.env.PAYPHI_SECRET_KEY || "abc";

    const orderId = "ORD" + Date.now();

    const payload = {
      merchantId,
      orderId,
      amount,
      currency: "INR",
      returnUrl: "http://localhost:5000/api/payphi/callback",
      mode: "UAT",
    };

    // ✅ Compute hash BEFORE using it
    const hashData = `${payload.merchantId}|${payload.orderId}|${payload.amount}|${payload.currency}`;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(hashData)
      .digest("hex")
      .toLowerCase();

    // ✅ Log after hash is available
    console.log("📦 Final Payload Sent to PayPhi:");
    console.log({
      merchantId: payload.merchantId,
      orderId: payload.orderId,
      amount: payload.amount,
      currency: payload.currency,
      mode: payload.mode,
      hash: hash,
    });

    res.set("Content-Type", "text/html");

    res.send(`
      <html>
        <body onload="document.forms[0].submit()">
          <form method="POST" action="https://uat.jiopay.co.in/tsp/pg/api/v2/initiateSale">
            <input type="hidden" name="merchantId" value="${payload.merchantId}" />
            <input type="hidden" name="orderId" value="${payload.orderId}" />
            <input type="hidden" name="amount" value="${payload.amount}" />
            <input type="hidden" name="currency" value="${payload.currency}" />
            <input type="hidden" name="returnUrl" value="${payload.returnUrl}" />
            <input type="hidden" name="mode" value="${payload.mode}" />
            <input type="hidden" name="hash" value="${hash}" />
          </form>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("🔥 Error occurred:", err.stack);
    res.status(500).send("Internal server error");
  }
};

exports.paymentCallback = (req, res) => {
  const { orderId, txnStatus, txnMessage, amount, txnId } = req.body;

  console.log("📩 PayPhi Callback Received:", req.body);

  if (txnStatus === "SUCCESS") {
    console.log(
      `✅ Payment successful for Order ID: ${orderId}, Amount: ${amount}`
    );
  } else {
    console.log(`❌ Payment failed for Order ID: ${orderId}`);
  }

  res.send("✅ Transaction status received. Thank you.");
};
