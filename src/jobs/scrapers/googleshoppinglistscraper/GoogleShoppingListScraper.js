export const GoogleShoppingListScraper = async (page) => {
	console.log('Refreshing page')
	await page.goto('https://shoppinglist.google.com/')
	await page.waitForTimeout(5000)
	console.log('Evaliating')
	const shoppingLists = await page.evaluate(async () => {
		const delay = (ms) => {
			return new Promise((resolve, reject) => setTimeout(resolve, ms))
		}
		console.log('Get lists')
		const allLists = document.querySelector('#yDmH0d > c-wiz > gm-coplanar-drawer > div > div > nav > div.PlW26e').children
		let arr = []
		console.log('Loop through lists')
		for (const list of allLists) {
			console.log('List: ')
			const obj = { id: '', items: [] }
			const title = list.getElementsByClassName('seMnD')[0].textContent.trim()
			obj.id = title
			console.log('Got list title')
			
			list.querySelector('div > div > div.seMnD').click()
			console.log('Clicked shoppinglist')
			await delay(1000)
			const itemss = document.querySelector('#yDmH0d > c-wiz > div.RVpJR > ul')
			console.log('Got lists')
			if(itemss === null) continue
			const items = itemss.children
			for (const item of items) {
				console.log('Getting item')
				const textElement = item.getElementsByClassName('uZfMed')[0]
				if (textElement === undefined) continue
				const text = textElement.textContent.trim()
				console.log('Pushed item to array')
				obj.items.push(text)
			}
			arr.push(obj)
			console.log('Pushed list to array')
		}
		return arr
	})
	return shoppingLists
}
