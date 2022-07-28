import bcrypt from 'bcrypt'
import * as express from 'express'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import {  body, cookie, header, param, query, validationResult } from 'express-validator'
import passport from 'passport'

// Import Models
import { UserModel, UserDocument } from '../models/mongoose/user.model'
import { UserProfile, UserProfileDocument } from '../models/mongoose/user_profile'

import { sendAccountActivationEmail, sendResetPasswordEmail } from '../aws/ses.aws'


var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "30d2f060adbffb",
      pass: "f7d8050d82ecb6"
    }
});

class AuthController {
    constructor() {

    }

    getLogin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        //console.log('req.session.messages = ' + req.session.messages)
        
        res.render('auth/login', {
            pageTitle: 'Login',
            // isAuthenticated: false,
            errorMessage: '' //|| req.session.messages
        });
    }

    getSignUp = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.render('auth/signup', {
            pageTitle: 'Sign Up',
            // isAuthenticated: true,
            errorMessage: null
        });
    }

    postLogin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AuthController.name}: postLogin()`)

        /*
        let {email, password, remember} = req.body
        remember = remember || false
        console.log(`name = ${email}, password = ${password}, remember = ${remember}`);

        try {
            let user = await User.findOne({email: email})
            if (null == user) res.redirect('/login')
            let profile = await UserProfile.findOne({userId: user?.id})
            if (null == user) res.redirect('/login')

            bcrypt.compare(password, user?.loginPassword || "").then(isMatched => {
                console.log("Password matched")
                req.session.isLoggedIn = true
                req.session.user = user
                req.session.save(err => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    console.log('Redirect to home page')
                    res.redirect('/')
                })
            })
        } catch (err) {
            console.error(err)
            res.redirect('/login')
        }
        */
    }

    postSignup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AuthController.name}: postSignup()`)

        let { email, originalEmail, password, confirmPassword, gender, 
            firstName, middleName, lastName, currentCity, 
            currentCountry} = req.body
        try {
            let isExist = await UserModel.findOne({email: email})
            if (isExist) {
                return res.status(422).render('auth/signup', {
                    path: 'auth/signup',
                    pageTitle: 'Sign Up',
                    errorMessage: 'User already exist with this email'
                })
            }
            bcrypt.hash(password, 12).then(async passwordHash => {
                const user = new UserModel({
                    email: req.body.email,
                    originalEmail: req.body.originalEmail,
                    passwordHash: passwordHash,
                    displayName: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
                    firstName: req.body.firstName,
                    middleName: req.body.middleName,
                    lastName: req.body.lastName,
                    activationHash: crypto.randomBytes(32).toString('hex')
                })
                await user.save()
                console.log(`${AuthController.name}: Signup Successful`)
                console.log('Signup Successful')

                const url = new URL(`${process.env.REST_API_V1_URL?.toString()}/activateAccount`)
                url.search = `email=${req.body.originalEmail}&activationHash=${user.activationHash}&appReturnUrl=http://localhost:4200`
                console.log(`${AuthController.name}: activationLink = ${url.toString()}`)
                sendAccountActivationEmail({
                    email: req.body.originalEmail,
                    userDisplayName: user.displayName,
                    activationLink: url.toString()
                })
                res.redirect('/login')
            })
        } catch (err) {
            console.log('Signup failed')
            console.log(err);
            res.redirect('/signup');
        }
    }

    postLogout = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AuthController.name}: postLogout()`)
        req.logOut({keepSessionInfo: false}, function(err) {
            if (err) return console.log('Error while logging out. ' + err.errorMessage)
            res.redirect('/login')
        })
        // req.session.destroy(err => {
        //     console.log(err);
        //     res.redirect('/');
        // })
    }

    getResetPassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AuthController.name}: getResetPassword()`)
        res.render('auth/reset_password', {
            pageTitle: 'Reset password',
            errorMessage: null
        })
    }

    postResetPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AuthController.name}: postResetPassword()`)
        const user = req.body.foundUser
        const userProfile = await UserProfile.findOne({userId: user._id})
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err)
                return res.status(500).render('auth/reset_password', {
                    path: 'auth/reset_password',
                    pageTitle: 'Reset password',
                    errorMessage: 'Internal Server Error'
                })
            }

            const token = buffer.toString('hex')
            user.recoveryHash = token
            user.recoveryHashExpireDate = new Date(Date.now() + 3600*1000)
            user.save()

            sendResetPasswordEmail(user.originalEmail, userProfile?.getDisplayName(), token)
            res.render('auth/reset_password_instruction_sent.ejs', {
                pageTitle: 'Reset password',
                emailAddress: user.originalEmail
            })
        })
    }

    getResetPasswordConfirm = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AuthController.name}: getResetPasswordConfirm()`)
        res.render('auth/reset_password_confirm.ejs', {
            pageTitle: 'Reset password Confirm',
            errorMessage: ''
        })
    }

    postResetPasswordConfirm = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AuthController.name}: postResetPasswordConfirm()`)

    }
}

export default AuthController
