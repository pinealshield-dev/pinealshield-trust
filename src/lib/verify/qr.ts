// lib/verify/qr.ts
export interface QRPayload {
  h: string;
  ts: number;
  n: string;
}

function randomNonce(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export function generateQRPayload(identifier: string): QRPayload {
  return {
    h: identifier,
    ts: Math.floor(Date.now() / 1000),
    n: randomNonce(),
  };
}

export function encodeQRPayload(payload: QRPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}
