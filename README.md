# next-14-lucia-v3-sqlite-drizzle-conform-zod-email-verification-otp-server-actions

# Store Environment Variables

1. Copy `.env.example` file to `.env` file

```bash
cp .env.example .env # duplicate .env.example & name it .env
```

2. Change `DATABASE_PATH` to the filename of your choice

```bash
DATABASE_PATH=sqlite.db
```

## Install the dependencies

```bash
pnpm install
```

## Start the server

```bash
pnpm start
```

## Push schema changes to database

```bash
pnpm db:push
```

## Generate Migrations

```bash
pnpm db:generate
```

## Install Redis for the rate-limiting on OTP function

https://redis.io/docs/install/install-redis/

> Note: You can disable it by removing Redis Specific Code & `middleware.ts`

## Must-watch videos on Redis & Rate Limiting to understand the basic concepts

1. https://www.youtube.com/watch?v=MR_BN1Ricjw
2. https://www.youtube.com/watch?v=qUydEBZmGvU
3. https://www.youtube.com/watch?v=a4yX7RUgTxI

## When to rate-limit API routes?

1. Sign Up - What if someone brute-forces 100s of requests to fill our database with UGC spam?
2. Login - What if someone tries every possible combination of email to get the right one?
3. OTP - What if someone tries to gain access by trying various different OTP combinations to find the best one?

Since it is a simple example, I will go with IP-based blocking for 1 day using browser finderprinting library.
