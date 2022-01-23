import APIService from '../../shared/api/API/services/APIService.js'
import ICAAPIServices from '../../shared/api/API/services/ICAAPIServices.js'

export const ShoppingList = async (id, auth, listid) => {
	const shoppingLists = await ICAAPIServices.getAllShoppingLists(auth)
	let shoppingList = shoppingLists.data.ShoppingLists.filter((e) => e.OfflineId === listid)[0]
	if (shoppingList === undefined) {
		shoppingList = shoppingLists.data.ShoppingLists.filter((e) => e.Title === id)[0]
		if (shoppingList === undefined) {
			await ICAAPIServices.createNewShoppingList(id, auth)
			ShoppingList(id, auth)
			return
		} else {

			await APIService.editUser({ ica_shopping_list: shoppingList.OfflineId }, id)
		}
	}
	return shoppingList
}
