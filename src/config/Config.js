import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const PORT = process.env.PORT || 3001
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/test'

const connectToPort = async (application) => {
	try {
		await application.listen(PORT, () => {
			console.log(`✔️ Server igång på port ${PORT}`)
		})
	} catch (error) {
		console.error('❌ ERROR OCCURED WHILE TRYING TO CONNECT TO THE PORT..')
	}
}

const connectToDatabase = async () => {
	try {
		mongoose.connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
		console.log(`✔️ SUCCESSFULLY CONNECTED TO DATABASE..`)
	} catch (error) {
		console.log(error)
		console.error('❌ ERROR OCCURD WHEN TRYING TO CONNECT TO DATABASE')
		process.exit()
	}
}

export default { connectToPort, connectToDatabase }
