import puppeteer from 'puppeteer'

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()

  for (let i = 0; i < 20; i++) {
    await page.goto('http://localhost:3000/signup', {
      waitUntil: 'networkidle0',
    })

    await page.type('input[name="email"]', `test${i}@example.com`)
    await page.click('button[type="submit"]')

    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await page.waitForSelector('#verify-email-form', {
      visible: true,
      timeout: 0,
    })

    console.log(i)
  }

  await page.close()
  await browser.close()
}

/*
import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch({ headless: false })

  const page = await browser.newPage()
  for (let i = 0; i < 20; i++) {
    await page.goto('http://localhost:3000/signup')
    await page.waitForLoadState('domcontentloaded')

    await page.fill('input[name="email"]', `test${i}@example.com`)
    await page.click('button[type="submit"]')

    await page.waitForURL('http://localhost:3000/verify-email')
    // await page.waitForSelector('#verify-email-form', {
    //   state: 'visible',
    //   timeout: 0,
    // })

    console.log(i)
  }

  await page.close()
  await browser.close()
}
*/

main()

/*
async function main() {
	const formData = new FormData()
  formData.append('email', 'a@a.com')
	
  const res = await fetch('/signup', {
		method: 'POST',
    body: formData,
    headers: {
			'Next-Action': '948fdf27b221db98253b47aa8f8d1c589c93e063',
    },
  })

  const data = await res.text()

  console.log({ res, data })
}
*/
