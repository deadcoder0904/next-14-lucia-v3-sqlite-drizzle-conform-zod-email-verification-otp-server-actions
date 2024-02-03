import { LOCALHOST_URL, getActionNo } from 'rate-limit/utils'

async function main() {
  const actionNumber = await getActionNo()

  const formData = new FormData()
  formData.append('email', 'a@a.com')

  const res = await fetch(`${LOCALHOST_URL}/signup`, {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
    headers: {
      'Next-Action': actionNumber,
    },
  })

  const body = res.body
  const headers = res.headers
  const redirected = res.redirected
  const contentType = res.headers.get('content-type') || ''

  // const data = await res.text()

  console.log({ res, body, headers, redirected, contentType })
}

main()
