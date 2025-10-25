import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

export async function rateLimit(req, res, next) {
  try {
    await limiter.consume(req.ip);
    return next();
  } catch {
    res.status(429).json({ success: false, message: "Too Many Requests" });
  }
}

