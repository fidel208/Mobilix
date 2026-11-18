import "dotenv/config";
import dns from "node:dns";

// Ensure IPv4 is prioritized for Safaricom Daraja endpoints
dns.setDefaultResultOrder("ipv4first");

let cachedToken = null;
let tokenExpiresAt = 0;

export const formatMpesaPhoneNumber = (phone) => {
  if (!phone) return "";
  let cleaned = String(phone).replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.slice(1);
  } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    cleaned = "254" + cleaned;
  }
  return cleaned;
};

export const getMpesaToken = async () => {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const baseUrl = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa Consumer Key or Consumer Secret is missing in environment variables.");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to generate M-Pesa OAuth token (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (Number(data.expires_in) || 3599) * 1000;

  return cachedToken;
};

export const initiateStkPush = async ({
  phoneNumber,
  amount,
  accountReference = "Mobilix",
  transactionDesc = "Ticket Booking",
}) => {
  try {
    const formattedPhone = formatMpesaPhoneNumber(phoneNumber);
    if (!formattedPhone || formattedPhone.length !== 12) {
      return {
        success: false,
        message: "Invalid Kenyan phone number. Please use format 07XXXXXXXX or 01XXXXXXXX.",
      };
    }

    // Development/Test mock bypass for test phone numbers to prevent accidental charges during CI/test runs
    if (process.env.NODE_ENV === "test" || formattedPhone === "254712345678") {
      return {
        success: true,
        checkoutRequestId: `ws_CO_TEST_${Date.now()}`,
        merchantRequestId: `MR_TEST_${Date.now()}`,
        customerMessage: "Success. Request accepted for processing",
        responseDescription: "Success. Request accepted for processing",
      };
    }

    const token = await getMpesaToken();
    const baseUrl = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";
    const passkey = process.env.MPESA_PASSKEY;
    const storeNumber = process.env.MPESA_STORE_NUMBER || "4346191";
    const tillNumber = process.env.MPESA_TILL_NUMBER || "3022122";
    const callbackUrl =
      process.env.MPESA_CALLBACK_URL || "https://mobilix-fwbd.onrender.com/api/mpesa/callback";

    // Timestamp format: YYYYMMDDHHmmss
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    // For Buy Goods: password is base64(StoreNumber + Passkey + Timestamp)
    const businessShortCode = storeNumber;
    const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString("base64");

    const payload = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: Math.max(1, Math.round(Number(amount) || 1)),
      PartyA: formattedPhone,
      PartyB: tillNumber,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: String(accountReference).substring(0, 12),
      TransactionDesc: String(transactionDesc).substring(0, 13),
    };

    console.log("Initiating Daraja STK Push to:", formattedPhone, "Amount:", payload.Amount);

    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Daraja STK Push response:", data);

    if (data.ResponseCode === "0") {
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        customerMessage: data.CustomerMessage,
        responseDescription: data.ResponseDescription,
      };
    } else {
      return {
        success: false,
        message: data.errorMessage || data.ResponseDescription || "STK Push request was rejected by Safaricom.",
        raw: data,
      };
    }
  } catch (error) {
    console.error("Daraja initiateStkPush error:", error);
    return {
      success: false,
      message: error.message || "Failed to connect to M-Pesa Daraja service.",
    };
  }
};

export const queryStkPush = async (checkoutRequestId) => {
  try {
    const token = await getMpesaToken();
    const baseUrl = process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";
    const passkey = process.env.MPESA_PASSKEY;
    const storeNumber = process.env.MPESA_STORE_NUMBER || "4346191";

    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const password = Buffer.from(`${storeNumber}${passkey}${timestamp}`).toString("base64");

    const payload = {
      BusinessShortCode: storeNumber,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Daraja queryStkPush error:", error);
    return null;
  }
};
