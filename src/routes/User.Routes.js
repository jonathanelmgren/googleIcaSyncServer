import UserController from '../controllers/User.Controller.js'
import passport from 'passport'

const routes = (app) => {
	app.post('/user/register', UserController.registerUser)
	app.post('/user/login', UserController.login)
	app.get('/user/', passport.authenticate('jwt', { session: false }), UserController.validateToken)
	app.get('/users', UserController.getAllUsers)
	app.put('/user/:id', UserController.editUser)
	app.post('/user/:id/icatoken', UserController.icaToken)
}

export default { routes }
