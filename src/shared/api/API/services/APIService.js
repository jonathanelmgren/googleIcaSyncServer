import http from '../API.js'

const getUsers = () => {
	return http.get(`/users/`)
}

const addUser = (data) => {
	return http.get(`/user/register`, data)
}
const editUser = (data, user) => {
	return http.put(`/user/${user}`, data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getUsers, addUser,editUser }
