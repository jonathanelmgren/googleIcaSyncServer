

export const GoogleShoppingListScraper = async (page) => {
	await page.goto('https://shoppinglist.google.com/')
	await page.waitForTimeout(5000)
	const shoppingLists = await page.evaluate(async () => {
		const delay = (ms) => {
			return new Promise((resolve, reject) => setTimeout(resolve, ms))
		}
		const allLists = document.querySelector('body > shopping-list-app > mat-sidenav-container > mat-sidenav > div > xap-deferred-loader-outlet > lists-menu > mat-nav-list.mat-nav-list.mat-list-base.navList.listsMenuItems.ng-star-inserted').children
		let arr = []
		for (const list of allLists) {
			const obj = { id: '', items: [] }
			const title = list.getElementsByClassName('title')[0].textContent.trim()
			obj.id = title

			list.querySelector('.mat-list-item').click()
			await delay(1000)
			const items = document.getElementsByClassName('listItemTitle')
			for (const item of items) {
				obj.items.push(item.textContent.trim())
			}
			arr.push(obj)
		}
		return arr
	})
	return shoppingLists
}
