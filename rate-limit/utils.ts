import { parse } from 'node-html-parser'

export const LOCALHOST_URL = 'http://localhost:3000'

export async function getActionParams(): Promise<{
  actionNo: string
  actionKey: string
}> {
  const res = await fetch(`${LOCALHOST_URL}/signup`)
  const html = await res.text()
  const root = parse(html)

  const actionNo = root
    .querySelector('input[name="$ACTION_1:0"]')
    ?.getAttribute('value')
    ?.toString() as string
  const actionKey = root
    .querySelector('input[name="$ACTION_KEY"]')
    ?.getAttribute('value')
    ?.toString() as string

  const no = JSON.parse(actionNo)

  return {
    actionNo: no.id,
    actionKey,
  }
}
