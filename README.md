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

### Basic Rate Limit Example that works

#### src/middleware.ts

```ts
import { NextRequest, NextResponse } from 'next/server'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const opts = {
	points: 10,
	duration: 5, // Per second
}

const rateLimiter = new RateLimiterMemory(opts)

export default async function middleware(request: NextRequest) {
	if (request.method === 'POST') {
		let res: any
		try {
			res = await rateLimiter.consume(2)
			console.log({ res })
		} catch (error) {
			res = error
		}

		if (res._remainingPoints > 0) {
			return NextResponse.next()
		} else {
			return NextResponse.json(
				{
					error: 'Rate limit exceeded. Please try again later.',
				},
				{
					status: 429,
				},
			)
		}
	}
}

export const config = {
	matcher: ['/api/login'],
}
```

#### rate-limit/login.ts

```ts
const LOCALHOST_URL = 'http://localhost:3000'

async function main() {
	for (let i = 0; i < 20; i++) {
		const url = `${LOCALHOST_URL}/api/login`
		const email = `test${i}@example.com`
		const body = JSON.stringify({ email })

		const response = await fetch(url, { method: 'POST', body })
		const data = await response.json()

		console.log({ data })
	}
}

main()
```

Run Next.js dev server using `pnpm dev` in one terminal & brute-force the login api in another using `pnpm ratelimit:login` & it'll show this output in ratelimit terminal:

```json
{ data: { success: false } }
{ data: { success: false } }
{ data: { success: false } }
{ data: { success: false } }
{ data: { success: false } }
{ data: { success: false } }
{ data: { success: false } }
{ data: { success: false } }
{ data: { success: false } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
{ data: { error: 'Rate limit exceeded. Please try again later.' } }
```

And this output in dev server terminal:

```json
{
  res: RateLimiterRes {
  _remainingPoints: 9,
  _msBeforeNext: 5000,
  _consumedPoints: 1,
  _isFirstInDuration: true
}
}
[19:49:26.652] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 8,
  _msBeforeNext: 4940,
  _consumedPoints: 2,
  _isFirstInDuration: false
}
}
[19:49:26.706] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 7,
  _msBeforeNext: 4898,
  _consumedPoints: 3,
  _isFirstInDuration: false
}
}
[19:49:26.750] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 6,
  _msBeforeNext: 4855,
  _consumedPoints: 4,
  _isFirstInDuration: false
}
}
[19:49:26.793] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 5,
  _msBeforeNext: 4810,
  _consumedPoints: 5,
  _isFirstInDuration: false
}
}
[19:49:26.839] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 4,
  _msBeforeNext: 4765,
  _consumedPoints: 6,
  _isFirstInDuration: false
}
}
[19:49:26.882] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 3,
  _msBeforeNext: 4721,
  _consumedPoints: 7,
  _isFirstInDuration: false
}
}
[19:49:26.931] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 2,
  _msBeforeNext: 4672,
  _consumedPoints: 8,
  _isFirstInDuration: false
}
}
[19:49:26.977] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 1,
  _msBeforeNext: 4625,
  _consumedPoints: 9,
  _isFirstInDuration: false
}
}
[19:49:27.022] INFO (9732): ≡ƒÅü POST /api/login/route
{
  res: RateLimiterRes {
  _remainingPoints: 0,
  _msBeforeNext: 4583,
  _consumedPoints: 10,
  _isFirstInDuration: false
}
}
```

It only works with API routes. Idk how to make it work for Server Actions. I tried Puppeteer/Playwright but for some reason, it calls login api twice & halts the process because of not unique email.
