import Redis from "ioredis";

// Use REDIS_URL if provided (e.g. Upstash), otherwise fallback to local
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      // Upstash requires TLS (rediss:// already enables it)
      tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
    })
  : new Redis(); // default: 127.0.0.1:6379

// Run a ping to verify connection
redis.ping()
  .then((result) => {
    if (result === "PONG") {
      console.log("✅ Redis: Ping successful");
    } else {
      console.warn("⚠️ Redis: Unexpected ping response:", result);
    }
  })
  .catch((err) => {
    console.error("❌ Redis: Ping failed", err);
  });

export default redis;
