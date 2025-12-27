import { redis } from "bun";

const CACHE_PREFIX = "cache:";

export async function cacheSet<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  const serialized = JSON.stringify(value);
  await redis.set(cacheKey, serialized);
  await redis.expire(cacheKey, ttl);
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  const cached = await redis.get(cacheKey);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
}

export async function cacheDel(key: string): Promise<void> {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  await redis.del(cacheKey);
}

export async function cachePut<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
  await cacheSet(key, value, ttl);
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  const cachePattern = `${CACHE_PREFIX}${pattern}`;
  const keys = await redis.send("KEYS", [cachePattern]);
  if (keys && Array.isArray(keys) && keys.length > 0) {
    await redis.send("DEL", keys);
  }
}
