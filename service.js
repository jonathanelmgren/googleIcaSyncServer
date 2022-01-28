import cron from 'node-cron'
import { initializeGoogleScraper } from './src/jobs/scrapers/InitializeGoogle.js'
import { GoogleShoppingListScraper } from './src/jobs/scrapers/googleshoppinglistscraper/GoogleShoppingListScraper.js'
import { Authenticate } from './src/jobs/api/Authenticate.js'
import { AddProductToICA } from './src/jobs/api/AddProductToICA.js'
import { ShoppingList } from './src/jobs/api/GetCorrectShoppingList.js'
import { RemoveProductFromICA } from './src/jobs/api/RemoveProductFromICA.js'
import { RemoveProductFromGoogle } from './src/jobs/scrapers/googleshoppinglistscraper/RemoveProductFromGoogle.js'
import APIService from './src/shared/api/API/services/APIService.js'
import axios from 'axios'
import { decrypt } from './src/controllers/Crypto.js'

console.log('Service is running')

const { browser, page } = await initializeGoogleScraper()

cron.schedule('*/3 * * * *', async () => {
	console.log(new Date())
	//Get all users
	const { data } = await APIService.getUsers()
	const users = data

	///Get shoppinglists from google
	const googleShoppingLists = await GoogleShoppingListScraper(page)

	for (const user of users) {
		if (user.ica_user) user.ica_user = decrypt(user.ica_user)
		if (user.ica_pass) user.ica_pass = decrypt(user.ica_pass)
		if (user.ica_token) user.ica_token = decrypt(user.ica_token)
		//Check if subscription has expired
		try {
			const currentDate = new Date()
			const expireDate = new Date(user.subscription_end_date)
			if (currentDate > expireDate || !user.subscription_end_date) throw new Error('Subscription not active')
			//Get correct shoppinglist from ICA and authenticate if token is expired or non-existent
			let icaShoppingList
			try {
				icaShoppingList = await ShoppingList(user._id, user.ica_token, user.ica_shopping_list)
			} catch (e) {
				const token = await Authenticate(user._id, user.ica_user, user.ica_pass)
				user.ica_token = token
				await axios.put(`${process.env.API_URL}/user/${user._id}`, { ica_token: token })
				icaShoppingList = await ShoppingList(user._id, user.ica_token, user.ica_shopping_list)
			}
			//Get correct id of shoppinglist from ICA
			if (icaShoppingList === undefined) icaShoppingList = await ShoppingList(user._id, user.ica_token, user.ica_shopping_list)
			const icaShoppingListId = icaShoppingList.OfflineId

			//Get correct shoppinglist from Google
			const googleShoppingList = googleShoppingLists.filter((e) => e.id === user._id)[0]
			console.log(googleShoppingList)

			//Get all products from Google list
			if (googleShoppingList.items.length < 1) throw new Error('No items in Googles shopping list')
			const googleProducts = googleShoppingList.items

			//Get all products from ICA list
			const icaProducts = icaShoppingList.Rows.map((x) => x.ProductName)

			//Get products that has been bought in ICA (IsStrikedOver)
			const productsBoughtInICA = icaShoppingList.Rows.map((x) => {
				if (x.IsStrikedOver) return x.ProductName
			}).filter((x) => x !== undefined)

			//Get products not yet synced to ICA
			const productsMissingInICA = googleProducts.filter((x) => !icaProducts.includes(x))

			//If products is missing in ICA the products from Google List should sync to ICA
			if (productsMissingInICA.length > 0) {
				for (const productname of productsMissingInICA) {
					const product = {
						ProductName: productname,
					}
					await AddProductToICA(product, icaShoppingListId, user.ica_token)
				}
			}

			//If products is bought in ICA list, remove from both ICA and Google list
			if (productsBoughtInICA.length > 0) {
				for (const product of productsBoughtInICA) {
					const itemIndex = icaShoppingList.Rows.findIndex((x) => x.ProductName === product)
					const itemID = icaShoppingList.Rows[itemIndex].OfflineId
					await RemoveProductFromICA(itemID, user.ica_token)
				}
				await RemoveProductFromGoogle(page, user._id, productsBoughtInICA)
			}

			console.log('Success: ' + user.username)
			await axios.put(`${process.env.API_URL}/user/${user._id}`, { latest_sync: 'Success' })
		} catch (e) {
			console.log('Fail')
			console.log(e.message)
			if (e.message === 'Request failed with status code 401') e.message = 'Wrong username or password on ICA'
			if (e.message === "Cannot read properties of undefined (reading 'items')") e.message = 'Google shoppinglist not renamed or shared correctly to googleicasync@elmgren.dev'
			await axios.put(`${process.env.API_URL}/user/${user._id}`, { latest_sync: e.message })
			continue
		}
	}
})
