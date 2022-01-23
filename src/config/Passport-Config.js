import passport from 'passport'
import passportJwt from 'passport-jwt'
import dotenv from 'dotenv'

import UserModel from '../models/User.Model.js'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

dotenv.config()
const opts = {}
;(opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()), (opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET)

const loginInit = () => {
	passport.use(
		'jwt',
		new JwtStrategy(opts, (jwt_payload, done) => {
			UserModel.findById({ _id: jwt_payload.id }, (err, user) => {
				if (err) return done(err, false)
				if (user) return done(null, user)
				return done(null, false)
			})
		})
	)
}

export default {
	loginInit,
}
