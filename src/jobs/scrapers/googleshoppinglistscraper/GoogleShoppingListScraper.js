export const GoogleShoppingListScraper = async (page) => {
	await page.goto('https://shoppinglist.google.com/')
	await page.waitForTimeout(5000)
	console.log('aa')
	const shoppingLists = await page.evaluate(async () => {
		const delay = (ms) => {
			return new Promise((resolve, reject) => setTimeout(resolve, ms))
		}
		console.log('bb')
		const allLists = document.querySelector('#yDmH0d > c-wiz > gm-coplanar-drawer > div > div > nav > div.PlW26e').children
		console.log('cc')
		let arr = []
		for (const list of allLists) {
			const obj = { id: '', items: [] }
			const title = list.getElementsByClassName('seMnD')[0].textContent.trim()
			obj.id = title

			list.querySelector('div > div > div.seMnD').click()
			await delay(1000)
			const itemss = document.querySelector('#yDmH0d > c-wiz > div.RVpJR > ul')
			if(itemss === null) continue
			const items = itemss.children
			for (const item of items) {
				const textElement = item.getElementsByClassName('uZfMed')[0]
				if (textElement === undefined) continue
				const text = textElement.textContent.trim()
				console.log(textElement)
				console.log(text)
				obj.items.push(text)
			}
			arr.push(obj)
		}
		return arr
	})
	return shoppingLists
}
