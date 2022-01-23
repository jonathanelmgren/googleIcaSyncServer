import ICAAPIServices from '../../shared/api/API/services/ICAAPIServices.js'

export const RemoveProductFromICA = async (offlineid, auth) => {
	const res = await ICAAPIServices.deleteProduct(offlineid, auth)
	return res.status
}