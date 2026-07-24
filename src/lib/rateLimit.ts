type RateLimitInfo = {
  count: number;
  resetTime: number;
};

// In-memory store for rate limiting
// Note: In serverless environments (like Vercel), this state is lost when the function shuts down
// and is isolated per-instance. For strict global rate limiting, a Redis store like Upstash is recommended.
const rateLimitStore = new Map<string, RateLimitInfo>();

export function rateLimit(ip: string, action: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const key = `${action}:${ip}`;

  // Clean up expired entries periodically to prevent memory leaks
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  let info = rateLimitStore.get(key);

  if (!info || info.resetTime < now) {
    // First request or window expired
    info = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, info);
    return true; // Allowed
  }

  // Window hasn't expired
  if (info.count >= maxRequests) {
    return false; // Rate limited
  }

  // Increment counter
  info.count += 1;
  return true; // Allowed
}
