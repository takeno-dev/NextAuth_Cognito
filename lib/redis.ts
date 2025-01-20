import { Redis } from 'ioredis';

// RedisClientの初期化を一箇所で管理
const getRedisClient = () => {
  const client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  return client;
};

// シングルトンインスタンスとして提供
export const redis = getRedisClient(); 
