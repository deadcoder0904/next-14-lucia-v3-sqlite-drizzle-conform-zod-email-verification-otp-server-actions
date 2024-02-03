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

## How to test rate-limit API using Postman/Hoppscotch?

Go to https://hoppscotch.io/ (or https://www.postman.com/)

Select `POST` & enter `http://localhost:3000/signup` in URL.

Go to `Headers` & add `Next-Action` to `948fdf27b221db98253b47aa8f8d1c589c93e063` as well as `Origin` to `localhost:3000` & click on `Send` 10 times to see the error.

## Tried Rate Limits on Next.js 14 Server Actions using 2 methods:

1. Puppeteer/Playwright

The scripts are in `rate-limit` folder. Both for some reason send 2 requests & it always gives `Email is not unique` error since 1st request adds it to the database. Its a nasty bug in either Puppeteer/Playwright or my scripts. But definitely not in my email signup process. It works well manually.

2. Fetch request using Web API

Tried it with `Next-Action` as a header but that doesn't work either.

Most of the issues are with Next.js 14 Server Actions that I stumbled upon only while automating rate limits.

I don't think its ready for prime time yet so I'm gonna use API routes on my main project.

If you want to use this repo, check out 2 commits behind this as that works without any errors.
