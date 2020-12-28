import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import AppError from '../../../../shared/errors/AppError';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 15,
  duration: 1,
});

export default async function rateLimiterMiddleware( request: Request, response: Response, next: NextFunction): Promise<void> {
  try{
    await rateLimiter.consume(request.ip);
    return next();
  }catch(err){
    throw new AppError('Too many requests', 429 );
  }
} 