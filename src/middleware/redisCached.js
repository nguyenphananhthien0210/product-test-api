import { redisClient } from "./redisClient.js";

const cacheMiddleware =
  (ttl = 60) =>
  async (req, res, next) => {
    const key = req.originalUrl; // Use URL as the key for caching

    try {
      // Check if the data is cached in Redis
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        console.log("Cache hit for:", key); // Log when cache is found
        return res.json(JSON.parse(cachedData)); // Send cached data if available
      }

      console.log("Cache miss for:", key); // Log when cache is missed

      // Proceed to controller if not cached
      const originalJson = res.json;
      res.json = async (data) => {
        try {
          console.log(`Setting cache for: ${key} with TTL: ${ttl} seconds`);
          await redisClient.setEx(key, ttl, JSON.stringify(data)); // Cache with custom TTL
          originalJson.call(res, data); // Send actual response
        } catch (error) {
          console.error("Error saving data to Redis:", error);
          originalJson.call(res, data); // Continue without cache if error occurs
        }
      };

      next(); // Proceed to controller
    } catch (err) {
      console.error("Redis error in middleware:", err);
      next(); // Proceed even if Redis fails
    }
  };

export { cacheMiddleware };
