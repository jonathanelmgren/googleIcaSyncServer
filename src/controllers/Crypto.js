import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const algorithm = process.env.ALGORITHM
const secretKey = process.env.HASHED
const iv = crypto.randomBytes(parseInt(process.env.IV))

export const encrypt = (text) => {
	const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

	const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

	return {
		iv: iv.toString('hex'),
		content: encrypted.toString('hex'),
	}
}

export const decrypt = (hash) => {
	const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

	const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

	return decrpyted.toString()
}
