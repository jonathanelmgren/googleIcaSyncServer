import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import passport from 'passport'
import cors from 'cors'

import Config from './src/config/Config.js'
import Middlewares from './src/middlewares/Middlewares.js'
import UserRoutes from './src/routes/User.Routes.js'
import PassportConfig from './src/config/Passport-Config.js'
import dotenv from 'dotenv'

dotenv.config()

PassportConfig.loginInit()

const app = express()
app.use(express.json())
app.use(morgan('common'))
app.use(helmet())
app.use(cors())
app.use(passport.initialize())

UserRoutes.routes(app)

app.use(Middlewares.notFound)

Config.connectToPort(app)
Config.connectToDatabase()
