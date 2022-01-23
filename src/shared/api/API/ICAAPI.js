import Axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const ICA_API_URL = process.env.ICA_API_URL

export const API = Axios.create({
	baseURL: ICA_API_URL,
})

export default API
