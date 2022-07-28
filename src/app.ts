// Import NodeJS Modules
import fs from 'fs'
import url from 'url'
import path from 'path'

// Import 3rd Party Modules
import express from 'express'
import favicon from 'serve-favicon'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import csurf from 'csurf'
import dotenv from "dotenv"
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cors from 'cors'
import compression from 'compression'
dotenv.config()

// Import Configs
import { setupLocalStrategy } from './config/passport_local_strategy'
import { setupGoogleStrategy } from './config/passport_google_strategy'
import { setupFacebookStrategy } from './config/passport_facebook_strategy'
import { setupJwtStrategy } from './config/passport_jwt_strategy'
import { restApiCORSConfig } from "./config/cors.config"

// Import Routes
import restApiRouteV1 from './routes/restapi/v1'

import morgan from "morgan";
import validator from "validator";

export async function createExpressApp(): Promise<express.Express> { 
    const app = express()
    // Setup Views loggers, parsers and others
    app.set('views', path.join(__dirname, '../src', 'views'))
    app.set('view engine', 'ejs')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, '../src', 'public')))
    app.use(favicon(path.join(__dirname, '../src/public', 'static/favicon.ico')))
    app.use(session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI?.toString(),
            ttl: 14 * 24 * 60 * 60, // = 14 days. Default
            crypto: {
                secret: 'secret'
            }
        })
    }))
    app.use(compression())

    // Request Logging
    const accessLogStream = fs.createWriteStream(
        path.join(__dirname, 'access.log'),
        { flags: 'a' }
    )
    app.use(morgan('combined', { stream: accessLogStream }))

    // CORS
    app.use(cors(restApiCORSConfig()))

    const csurfProtection = csurf({cookie: true})

    // Passport Configure Start
    app.use(passport.initialize())
    app.use(passport.session())
    passport.serializeUser((user, done) => {
        console.log('serializeUser')
        console.log(user)
        //done(null, (user as UserDocument)._id.toString())
        done(null, user)
    })
    passport.deserializeUser((user: Express.User, done) => {
        console.log('deserializeUser id = ' + JSON.stringify(user))
        done(null, user)
    })
    setupLocalStrategy()
    setupGoogleStrategy()
    setupFacebookStrategy()
    setupJwtStrategy()
    // Passport Configure End

    // General info for EJS rendering
    app.use((req, res, next) => {
        res.locals.baseUrl = process.env.BASE_URL?.toString() || ''
        next()
    })

    // Extract Client IP Address
    app.use((req, res, next) => {
        console.log('Extract client ip')
        let ipAddress = (req.headers['x-forwarded-for'] as string || '').split(',')[0]
        if (!validator.isIP(ipAddress))
            ipAddress = req.socket.remoteAddress?.toString().split(':').pop() || ''
        if (!validator.isIP(ipAddress))
            return res.status(400).json({errorMessage: 'Bad Request'})

        req.headers['x-forwarded-for'] = ipAddress
        next()
    })

    // Configure CSRF Middleware
    const conditionalCSRF = (req:express.Request, res:express.Response, next:express.NextFunction) => {
        console.log('req.path = ' + req.path)
        if (req.path.startsWith('/api/v1/')) 
            return next()
        if (req.path.startsWith('/graphql'))
            return next()
        csurfProtection(req, res, next)
    }
    app.use(conditionalCSRF)
    app.use((req, res, next) => {
        console.log(req.body)
        console.log(req.path)
        console.log(req.headers)
        
        if (req.path.startsWith('/api/v1/')) 
            return next()

        res.locals.csrfToken = req.csrfToken()
        res.locals.isAuthenticated = req.isAuthenticated()
        console.log('req.isAuthenticated() = ' + req.isAuthenticated())
        next()
    })

    app.use('/api/v1', restApiRouteV1)

    // Catch 404 and forward to error handler
    app.use(function(req, res, next) {
        return res.render('error/error_404', {
            pageTitle: 'Invalid Request',
            errorMessage: 'Invalid Request. You shouldn\'t try this link',
            homeUrl: 'http://localhost:3000',
        })
    })

    return app
}


