export const RemoveProductFromGoogle = async (page, listid, products) => {
	await page.goto('https://shoppinglist.google.com/')
	await page.waitForTimeout(5000)
	await page.evaluate(
		async (listid, products) => {
			const delay = (ms) => {
				return new Promise((resolve, reject) => setTimeout(resolve, ms))
			}
			const allLists = document.querySelector('#yDmH0d > c-wiz > gm-coplanar-drawer > div > div > nav > div.PlW26e').children
			for (const list of allLists) {
				const title = list.getElementsByClassName('seMnD')[0].textContent.trim()
				list.querySelector('div > div > div.seMnD').click()
				await delay(1000)
				if (title !== listid) continue
				const itemss = document.querySelector('#yDmH0d > c-wiz > div.RVpJR > ul')
				if (itemss === null) continue
				const items = itemss.children
				for (const item of items) {
					const textElement = item.getElementsByClassName('uZfMed')[0]
					if (textElement === undefined) continue
					const text = textElement.textContent.trim()
					if (products.includes(text)) {
						textElement.click()
						await delay(500)
						item.querySelector('div > button:nth-child(4) > i').click()
						await delay(200)
					}
				}
			}
		},
		listid,
		products
	)
}
