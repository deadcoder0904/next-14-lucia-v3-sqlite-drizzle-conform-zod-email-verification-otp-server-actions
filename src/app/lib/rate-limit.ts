import Redis from 'ioredis'
import { RateLimiterRedis } from 'rate-limiter-flexible'

const redisClient = new Redis({ enableOfflineQueue: false })

const maxWrongAttemptsByIPperDay = 100
const maxConsecutiveFailsByEmailAndIP = 10

export const REDIS_KEYS = {
  USER: {
    SIGNUP: 'user:signup',
    LOGIN: 'user:login',
    OTP: 'user:otp',
  },
} as const

export const signupLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: REDIS_KEYS.USER.SIGNUP,
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 3, // Block for 3 hours, if 100 wrong attempts per day
})

export function rateLimit() {
  const check = () => {}

  return {
    check,
  }
}

const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 12, // Block for 12 hours, if 100 wrong attempts per day
})

const limiterConsecutiveFailsByEmailAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_email_and_ip',
  points: maxConsecutiveFailsByEmailAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
})
