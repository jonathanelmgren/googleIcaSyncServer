import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

export const initializeGoogleScraper = async () => {
	puppeteer.use(StealthPlugin())
	const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
	const page = await browser.newPage()

	page.on('console', (msg) => {
		for (let i = 0; i < msg._args.length; ++i) console.log(`${i}: ${msg._args[i]}`)
	})

	await page.goto('https://shoppinglist.google.com/')

	await page.waitForTimeout(1000)

	await page.type('[name=identifier]', process.env.GOOGLE_USER)

	await page.click('#identifierNext')

	await page.waitForTimeout(1000)

	await page.type('[name=password]', process.env.GOOGLE_PASS)
	await page.click('#passwordNext')

	await page.waitForTimeout(5000)

	const puppet = {
		browser: browser,
		page: page,
	}
	return puppet
}
