import { redirect } from 'next/navigation'

import { VerifyEmailForm } from '@/app/components/verify-email'
import { validateRequest } from '@/app/auth/lucia'

export default async function VerifyEmailPage() {
  const { user } = await validateRequest()
  const userExists = user && user.emailVerified
  if (userExists) return redirect('/dashboard')

  // if (await downloadLimiter.hasExceededLimit(userKey, fallbackKey)) {
  //   return errorResponse(
  //     429,
  //     `We've noticed an unusual amount of downloading from your account. Contact support@civitai.com or come back later.`
  //   );
  // }

  return (
    <>
      <VerifyEmailForm />
    </>
  )
}
