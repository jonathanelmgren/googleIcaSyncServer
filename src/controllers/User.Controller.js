import UserModel from '../models/User.Model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Authenticate } from '../jobs/api/Authenticate.js'
import { encrypt } from './Crypto.js'

const registerUser = async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 12)
	req.body.password = hashedPassword
	const user = new UserModel(req.body)
	try {
		const databaseResponse = await user.save()
		res.status(201).send(databaseResponse)
	} catch (error) {
		res.status(500).send({ message: error.message })
	}
}

const getAllUsers = async (req, res) => {
	try {
		const databaseResponse = await UserModel.find()
		return res.status(200).send(databaseResponse)
	} catch (error) {
		res.status(500).send({ message: error.message })
	}
}

const login = async (req, res) => {
	try {
		//Check if user exists
		let user = await UserModel.findOne({ username: req.body.username })
		if (!user) return res.status(404).send({ message: 'No user found' })
		//Check if password is correct
		const isMatch = await bcrypt.compare(req.body.password, user.password)
		if (!isMatch) return res.status(404).send({ message: 'Wrong password' })
		//Create token
		const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 30 * 86400 })
		//add token and authenticated boolean to user
		user._doc.token = token
		//delete password
		delete user._doc.password
		//Return authenticated user
		return res.status(200).send(user)
	} catch (e) {
		res.status(500).send({ message: e.message })
	}
}

const validateToken = async (req, res) => {
	try {
		const user = await UserModel.findById({ _id: req.user._id })
		delete user._doc.password
		res.status(200).send(user)
	} catch (e) {
		res.status(500).send({ message: e.message })
	}
}

const editUser = async (req, res) => {
	if (req.body.ica_user) req.body.ica_user = encrypt(req.body.ica_user)
	if (req.body.ica_pass) req.body.ica_pass = encrypt(req.body.ica_pass)
	if (req.body.ica_token) req.body.ica_token = encrypt(req.body.ica_token)
	try {
		const databaseResponse = await UserModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
		res.status(200).send(databaseResponse)
	} catch (e) {
		res.status(500).send({ message: e.message })
	}
}

//This is for people that doesn't want to give password but only give Token
const icaToken = async (req, res) => {
	try {
		const token = await Authenticate(req.params.id, req.body.ica_user, req.body.ica_pass)
		res.status(200).send(token)
	} catch (e) {
		res.status(500).send({ message: e.message })
	}
}

export default { registerUser, getAllUsers, editUser, login, validateToken, icaToken }
