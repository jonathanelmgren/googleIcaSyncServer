import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = Schema(
	{
		username: {
			type: String,
			lowercase: true,
			minLength: 5,
			maxLength: 20,
			required: true
		},
		password: {
			type: String,
			minLength: 5,
			required: true
		},
		ica_user: Object,
		ica_pass: Object,
		ica_token: Object,
		ica_shopping_list: String,
		subscription_end_date: Date,
		account_type: {
			type: String,
			enum: ['manual', 'automatic'],
		},
		latest_sync: String
	},
	{ timestamps: true, strict: true }
)

const UserModel = mongoose.model('user', userSchema)
export default UserModel
