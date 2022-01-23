import http from '../ICAAPI.js'

const authenticate = (user, pass) => {
	return http.get(`/login/`, { auth: { username: user, password: pass } })
}

const getAllShoppingLists = (auth) => {
	return http.get(`/user/offlineshoppinglists`, { headers: { AuthenticationTicket: auth } })
}

const createNewShoppingList = (id, auth) => {
	return http.post(`/user/offlineshoppinglists`, { Title: id }, { headers: { AuthenticationTicket: auth } })
}

const addProduct = (data, offlineid, auth) => {
	return http.post(`/user/offlineshoppinglists/${offlineid}/row`, data, { headers: { AuthenticationTicket: auth } })
}
const deleteProduct = (offlineid, auth) => {
	return http.delete(`/user/offlineshoppinglists/row/${offlineid}`, { headers: { AuthenticationTicket: auth } })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { authenticate, addProduct, getAllShoppingLists, deleteProduct, createNewShoppingList }
