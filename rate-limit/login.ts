import axios from 'axios'

import { LOCALHOST_URL, getActionParams } from 'rate-limit/utils'

async function main() {
  const { actionNo, actionKey } = await getActionParams()
  const stateTree = ''
  const formData = new FormData()
  formData.append('email', 'a@a.com')
  /*
  try {
    const response = await axios.post(`${LOCALHOST_URL}/signup`, {
      headers: {
        accept: 'text/x-component',
        'Next-Action': actionNo,
        Host: LOCALHOST_URL,
      },
      body: formData,
    })

    console.log({ response })
  } catch (err) {
    console.log('error:->')
    console.error(err)
  }
	*/
  // const data = JSON.parse(response.data.split('\n')[1].replace('1:', ''))
  // if (data !== null) {
  //   console.log(data)
  // }

  const res = await fetch(`${LOCALHOST_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'text/x-component',
      'Next-Action': actionNo,
      'Next-Router-State-Tree': stateTree,
      // Host: LOCALHOST_URL,
    },
    body: formData,
  })

  const body = res.body
  const headers = res.headers
  const redirected = res.redirected
  const contentType = res.headers.get('content-type') || ''

  const response1 = await res.text()
  // const data1 = JSON.parse(response1?.data.split('\n')[1].replace('1:', ''))

  console.log({ res, body, headers, redirected, contentType })
}

main()
