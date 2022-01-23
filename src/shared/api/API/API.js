import Axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const API_URL = process.env.API_URL

export const API = Axios.create({
	baseURL: API_URL,
})

export default API
