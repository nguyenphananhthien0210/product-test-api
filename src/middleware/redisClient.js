import redis from "redis";

// Create Redis client
const redisClient = redis.createClient({
  url: "redis://localhost:6379",
});

// Connect to Redis
redisClient.connect().catch((err) => {
  console.error("Error connecting to Redis:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

export { redisClient };
