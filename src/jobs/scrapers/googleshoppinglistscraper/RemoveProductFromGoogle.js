export const RemoveProductFromGoogle = async (page, listid, products) => {
	await page.goto('https://shoppinglist.google.com/')
	await page.waitForTimeout(5000)
	await page.evaluate(
		async (listid, products) => {
			const delay = (ms) => {
				return new Promise((resolve, reject) => setTimeout(resolve, ms))
			}
			const allLists = document.querySelector('body > shopping-list-app > mat-sidenav-container > mat-sidenav > div > xap-deferred-loader-outlet > lists-menu > mat-nav-list.mat-nav-list.mat-list-base.navList.listsMenuItems.ng-star-inserted').children
			for (const list of allLists) {
				const title = list.getElementsByClassName('title')[0].textContent.trim()
				list.querySelector('.mat-list-item').click()
				await delay(1000)
				if (title !== listid) continue
				const items = document.getElementsByClassName('activeItem')
				for (const item of items) {
					const itemTitle = item.querySelector('shopping-list-item > base-list-item > div.contentContainer.gxLayout-column.gxLayoutAlign-center-start.gxFlex > button > span').textContent.trim()
					const delbtn = item.querySelector('shopping-list-item > base-list-item > div.ng-star-inserted > div > div > span > button:nth-child(2)')
					if (products.includes(itemTitle)) {
						delbtn.click()
						await delay(200)
					}
				}
			}
		},
		listid,
		products
	)
}
