import ICAAPIServices from '../../shared/api/API/services/ICAAPIServices.js'
import APIService from '../../shared/api/API/services/APIService.js'

export const Authenticate = async (userid, user, pass) => {
	const { headers } = await ICAAPIServices.authenticate(user, pass)
	await APIService.editUser({ ica_token: headers.authenticationticket }, userid)
	return headers.authenticationticket
}
