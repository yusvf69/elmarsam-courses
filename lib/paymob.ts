import baseUrl from "@/lib/baseUrl";
import crypto from "crypto";

type PaymobAuthResponse = {
  token: string;
};

type PaymobOrderResponse = {
  id: number;
};

type PaymobPaymentKeyResponse = {
  token: string;
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export async function getPaymobAuthToken(): Promise<string> {
  const apiKey = getEnv("PAYMOB_API_KEY");
  const base = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com";

  const res = await fetch(`${base}/api/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
    cache: "no-store" as RequestCache,
  });

  if (!res.ok) throw new Error("Failed to get Paymob auth token");
  const data = (await res.json()) as PaymobAuthResponse;
  return data.token;
}

export async function createPaymobOrder(params: {
  merchantOrderId: string;
  amountCents: number;
}): Promise<number> {
  const base = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com";
  const token = await getPaymobAuthToken();

  const res = await fetch(`${base}/api/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: token,
      delivery_needed: false,
      amount_cents: params.amountCents,
      currency: process.env.PAYMOB_CURRENCY || "EGP",
      merchant_order_id: params.merchantOrderId,
      items: [],
    }),
    cache: "no-store" as RequestCache,
  });

  if (!res.ok) throw new Error("Failed to create Paymob order");
  const data = (await res.json()) as PaymobOrderResponse;
  return data.id;
}

export async function createPaymobPaymentKey(params: {
  orderId: number;
  amountCents: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  integrationId?: number;
}): Promise<string> {
  const base = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com";
  const token = await getPaymobAuthToken();
  const integrationId = params.integrationId ?? Number(getEnv("PAYMOB_INTEGRATION_ID"));

  const billingData = {
    apartment: "NA",
    email: params.email || "unknown@example.com",
    floor: "NA",
    first_name: params.firstName || "User",
    street: "NA",
    building: "NA",
    phone_number: params.phone || "+201000000000",
    shipping_method: "NA",
    postal_code: "00000",
    city: "NA",
    country: "EG",
    last_name: params.lastName || "",
    state: "NA",
  };

  const res = await fetch(`${base}/api/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: token,
      amount_cents: params.amountCents,
      expiration: 3600,
      order_id: params.orderId,
      billing_data: billingData,
      currency: process.env.PAYMOB_CURRENCY || "EGP",
      integration_id: integrationId,
      lock_order_when_paid: true,
    }),
    cache: "no-store" as RequestCache,
  });

  if (!res.ok) throw new Error("Failed to create Paymob payment key");
  const data = (await res.json()) as PaymobPaymentKeyResponse;
  return data.token;
}

export function buildPaymobIframeUrl(
  paymentToken: string,
  options?: { successUrl?: string; errorUrl?: string }
): string {
  const iframeId = getEnv("PAYMOB_IFRAME_ID");
  const base = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com";
  const success = options?.successUrl || `${baseUrl}`;
  const error = options?.errorUrl || `${baseUrl}`;
  return `${base}/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}&success=${encodeURIComponent(
    success
  )}&error=${encodeURIComponent(error)}`;
}

export function verifyPaymobHmac(params: Record<string, string | number | boolean>): boolean {
  // HMAC verification for Paymob callback (transaction notifications)
  const hmac = getEnv("PAYMOB_HMAC");
  const keysOrder = [
    "amount_cents",
    "created_at",
    "currency",
    "error_occured",
    "has_parent_transaction",
    "id",
    "integration_id",
    "is_3d_secure",
    "is_auth",
    "is_capture",
    "is_refunded",
    "is_standalone_payment",
    "is_voided",
    "merchant_order_id",
    "order",
    "owner",
    "pending",
    "source_data_pan",
    "source_data_sub_type",
    "source_data_type",
    "success",
  ];

  const concatenated = keysOrder
    .map((key) => (params[key] !== undefined ? String(params[key]) : ""))
    .join("");

  const digest = crypto.createHmac("sha512", hmac).update(concatenated).digest("hex");
  return digest === params.hmac;
}


