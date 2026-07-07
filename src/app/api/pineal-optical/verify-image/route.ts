import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const SUPPORTED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/octet-stream",
]);

function jsonResponse(payload: unknown, status: number) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function getFileExtension(filename: string) {
  const index = filename.lastIndexOf(".");
  if (index < 0) return "";
  return filename.slice(index).toLowerCase();
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "size" in value
  );
}

function getExpectedIdentifier(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value.trim().toUpperCase();
}

export async function POST(request: NextRequest) {
  const opticalApiUrl = process.env.PINEAL_OPTICAL_API_URL;

  if (!opticalApiUrl) {
    return jsonResponse(
      {
        valid: false,
        reason: "optical_api_not_configured",
        detail: "PINEAL_OPTICAL_API_URL is not configured on the Verify server.",
      },
      500,
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonResponse(
      {
        valid: false,
        reason: "invalid_multipart_form",
        detail: "Request must be multipart/form-data.",
      },
      400,
    );
  }

  const file = formData.get("file");

  if (!isUploadFile(file)) {
    return jsonResponse(
      {
        valid: false,
        reason: "missing_file",
        detail: "Missing file field.",
      },
      400,
    );
  }

  const filename = file.name || "uploaded_image.png";
  const extension = getFileExtension(filename);
  const mimeType = file.type || "application/octet-stream";

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    return jsonResponse(
      {
        valid: false,
        reason: "unsupported_file_type",
        supported: Array.from(SUPPORTED_EXTENSIONS),
      },
      400,
    );
  }

  if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
    return jsonResponse(
      {
        valid: false,
        reason: "unsupported_mime_type",
        supported: Array.from(SUPPORTED_MIME_TYPES),
      },
      400,
    );
  }

  if (file.size <= 0) {
    return jsonResponse(
      {
        valid: false,
        reason: "empty_file",
      },
      400,
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return jsonResponse(
      {
        valid: false,
        reason: "file_too_large",
        max_bytes: MAX_IMAGE_BYTES,
      },
      413,
    );
  }

  const expectedIdentifier = getExpectedIdentifier(
    formData.get("expected_identifier"),
  );

  const upstreamForm = new FormData();
  upstreamForm.append("file", file, filename);

  if (expectedIdentifier) {
    upstreamForm.append("expected_identifier", expectedIdentifier);
  }

  const headers: Record<string, string> = {};
  const apiKey = process.env.PINEAL_OPTICAL_API_KEY?.trim();

  if (apiKey) {
    headers["X-Pineal-Api-Key"] = apiKey;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const upstreamResponse = await fetch(
      `${normalizeBaseUrl(opticalApiUrl)}/api/optical/verify-image`,
      {
        method: "POST",
        headers,
        body: upstreamForm,
        cache: "no-store",
        signal: controller.signal,
      },
    );

    const payload = await upstreamResponse.json().catch(() => ({
      valid: false,
      reason: "invalid_optical_api_response",
      detail: "The optical verification service returned a non-JSON response.",
    }));

    return jsonResponse(payload, upstreamResponse.status);
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "AbortError" || error.message.includes("aborted"));

    return jsonResponse(
      {
        valid: false,
        reason: isTimeout
          ? "optical_api_timeout"
          : "optical_api_unavailable",
        detail: isTimeout
          ? "The optical verification service timed out."
          : "The optical verification service is temporarily unavailable.",
      },
      isTimeout ? 504 : 503,
    );
  } finally {
    clearTimeout(timeout);
  }
}