import ICAAPIServices from '../../shared/api/API/services/ICAAPIServices.js'

export const AddProductToICA = async (data, offlineid, auth) => {
	const res = await ICAAPIServices.addProduct(data, offlineid, auth)
	return res.status
}
