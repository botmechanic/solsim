const SENSITIVE_KEY =
  /^(qr|qrPayload|secret|key|signature|authorization)$/i;
const LPA_PATTERN = /LPA:1\$/;

function redactValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return LPA_PATTERN.test(value) ? '[REDACTED]' : value;
  }
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEY.test(k) ? '[REDACTED]' : redactValue(v);
    }
    return out;
  }
  return value;
}

/** Safe JSON stringify for logs — drops QR payloads and secret-ish keys. */
export function redactForLog(value: unknown): string {
  try {
    return JSON.stringify(redactValue(value));
  } catch {
    return '[UNSERIALIZABLE]';
  }
}

export function createRedactedLogger() {
  return {
    info(message: string, meta?: unknown) {
      if (meta === undefined) {
        console.log(message);
        return;
      }
      console.log(message, redactForLog(meta));
    },
    error(message: string, meta?: unknown) {
      if (meta === undefined) {
        console.error(message);
        return;
      }
      console.error(message, redactForLog(meta));
    },
  };
}
