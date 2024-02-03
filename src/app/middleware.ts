/*
import { NextRequest, NextResponse } from 'next/server'

const getEmailIPkey = (email: string, ip: string) => `${email}_${ip}`

export const config = {
  matcher: '/verify-email',
}

export default async function middleware(request: NextRequest) {
  if (request.method === 'POST') {
    // You could alternatively limit based on user ID or similar
    const ip = request.ip ?? '127.0.0.1'
    const emailIPkey = getEmailIPkey(request.body.email, ip)

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
      limiterConsecutiveFailsByEmailAndIP.get(emailIPkey),
      limiterSlowBruteByIP.get(ip),
    ])

    let retrySecs = 0

    // Check if IP or Username + IP is already blocked
    if (
      resSlowByIP !== null &&
      resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
    ) {
      retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1
    } else if (
      resUsernameAndIP !== null &&
      resUsernameAndIP.consumedPoints > maxConsecutiveFailsByEmailAndIP
    ) {
      retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1
    }

    if (retrySecs > 0) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429, headers: { 'Retry-After': String(retrySecs) } }
      )
    } else {
      const user = authorise(req.body.email, req.body.password) // should be implemented in your project
      if (!user.isLoggedIn) {
        // Consume 1 point from limiters on wrong attempt and block if limits reached
        try {
          const promises = [limiterSlowBruteByIP.consume(ip)]
          if (user.exists) {
            // Count failed attempts by Username + IP only for registered users
            promises.push(
              limiterConsecutiveFailsByEmailAndIP.consume(emailIPkey)
            )
          }

          await Promise.all(promises)

          return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        } catch (rlRejected) {
          if (rlRejected instanceof Error) {
            throw rlRejected
          } else {
            return NextResponse.json(
              { error: 'Too Many Requests' },
              {
                status: 429,
                headers: {
                  'Retry-After':
                    String(Math.round(rlRejected.msBeforeNext / 1000)) || 1,
                },
              }
            )
          }
        }
      }

      if (user.isLoggedIn) {
        if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
          // Reset on successful authorisation
          await limiterConsecutiveFailsByEmailAndIP.delete(emailIPkey)
        }
      }
    }
    // Authorized
    return NextResponse.next()
  }
}
*/

import { NextRequest, NextResponse } from 'next/server'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const opts = {
  points: 10,
  duration: 1, // Per second
}

const rateLimiter = new RateLimiterMemory(opts)

export default async function middleware(request: NextRequest) {
  console.log(request.method)
  if (request.method === 'POST') {
    console.log(request.method)
    let res: any
    try {
      res = await rateLimiter.consume(2)
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
        }
      )
    }
  }
}

export const config = {
  matcher: ['/signup'],
}
