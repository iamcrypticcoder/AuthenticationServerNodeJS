import express from 'express'
import {  body, cookie, header, param, query, validationResult } from 'express-validator'

import { UserModel, UserDocument } from '../../models/mongoose/user.model'
import {ValidationError} from "express-validator/src/base";
import {countries, languagesAll} from 'countries-list'

export class AuthApiValidation {

    constructor() {
    }

    validatePostSignup = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.body.originalEmail = req.body.email
            next()
        },

        body('firstName')
            .trim().notEmpty().withMessage('Invalid first name'),

        body('lastName')
            .trim().notEmpty().withMessage('Invalid last name'),

        body('gender')
            .trim().notEmpty().isIn(['Male', 'Female', 'Others']).withMessage('Invalid gender'),

        body('country')
            .trim().notEmpty().isIn(Object.keys(countries)).withMessage('Invalid country'),

        body('email')
            .notEmpty().withMessage('Invalid Email')
            .normalizeEmail().isEmail().withMessage('Invalid Email'),

        body('password')
            .notEmpty().withMessage('Password should not be empty')
            .isLength({
                min: 8,
                max: 32
            }).withMessage('Password length should be of minimum 8 characters and maximum 32 characters')
            .trim(),

        body('confirmPassword')
            .notEmpty().withMessage('Confirm password should not be empty')
            .isLength({
                min: 8,
                max: 32
            }).withMessage('Password length should be of minimum 8 characters and maximum 32 characters')
            .custom((value, {req}) => {
                if (value !== req.body.password)
                    return Promise.reject('Confirm password should be matched with password')
                return true
            })
            .trim(),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(422).json({
                    errorMessage: errors.array()[0].msg
                })
            }

            req.body.countryCode = req.body.country
            req.body.currencyCode = countries[req.body.country as (keyof typeof countries)].currency
            req.body.languageCode = 'en'
            next()
        }
    ]

    validatePostLogin = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.body.originalEmail = req.body.email
            next()
        },

        body('email')
            .normalizeEmail().isEmail().withMessage('Invalid Email')
            .custom(async (value, {req}) => {
                const user = await UserModel.findOne({email: req.body.email})
                if (!user) return Promise.reject('User doesn\'t exist with this email')
                req.body.foundUser = user
                return true
            }),

        body('password')
            .notEmpty().withMessage('Password should not be empty')
            .isLength({
                min: 8,
                max: 32
            }).withMessage('Password length should be of minimum 8 characters and maximum 32 characters')
            .trim(),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                for (let err of errors.array()) {
                    switch (err.param) {
                        case 'email':
                            return res.status(401).json({errorMessage: err.msg})
                        case 'password':
                            return res.status(422).json({errorMessage: err.msg})
                        default:
                            break;
                    }
                }
            }
            next()
        }
    ]

    validatePostLoginGoogle = [
        body('appReturnUrl')
            .notEmpty().withMessage('Invalid request')
            .trim(),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.render('error/error_404', {
                    pageTitle: '404',
                    errorMessage: 'Invalid Request',
                    homeUrl: 'http://localhost:3000',
                })
            }
            next()
        }
    ]

    validatePostLoginFacebook = this.validatePostLoginGoogle

    validatePostSendResetPasswordEmail = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.body.originalEmail = req.body.email
            next()
        },
        body('email')
            .normalizeEmail().isEmail().withMessage('Invalid Email'),
        body('email')
            .custom(async (value, {req}) => {
                const user = await UserModel.findOne({email: req.body.email})
                if (!user) return Promise.reject('User doesn\'t exist with this email')
                req.body.foundUser = user
                return true
            }),
        body('appPasswordResetUrl')
            .isURL({require_tld: false}).withMessage('Invalid Application password reset url'),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(401).json({errorMessage: errors.array()[0].msg})
            }
            next()
        }
    ]

    validatePostSendAccountActivationEmail = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.body.originalEmail = req.body.email
            next()
        },
        body('email')
            .normalizeEmail().isEmail().withMessage('Invalid Email'),
        body('email')
            .custom(async (value, {req}) => {
                const user = await UserModel.findOne({email: req.body.email})
                if (!user) return Promise.reject('User doesn\'t exist with this email')
                req.body.foundUser = user
                return true
            }),
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(401).json({errorMessage: errors.array()[0].msg})
            }
            next()
        }
    ]

    validatePostResetPassword = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.body.originalEmail = req.body.email
            next()
        },
        body('email')
            .normalizeEmail().isEmail().withMessage('Invalid Email')
            .custom(async (value, {req}) => {
                const user = await UserModel.findOne({email: req.body.email})
                if (!user) return Promise.reject('User doesn\'t exist !')
                req.body.foundUser = user
                return true
            }),
        body('recoveryHash')
            .notEmpty().withMessage('Invalid recovery code')
            .trim(),
        body('newPassword')
            .notEmpty().withMessage('Password should not be empty')
            .isLength({
                min: 8,
                max: 32
            }).withMessage('Password length should be of minimum 8 characters and maximum 32 characters')
            .trim(),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(422).json({errorMessage: errors.array()[0].msg})
            }
            next()
        }
    ]

    validatePostChangePassword = [
        body('newPassword')
            .notEmpty().withMessage('Password should not be empty')
            .isLength({
                min: 8,
                max: 32
            }).withMessage('Password length should be of minimum 8 characters and maximum 32 characters')
            .trim(),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(401).json({errorMessage: errors.array()[0].msg})
            }
            next()
        }
    ]

    validateConfirmEmail = [
        query('email')
            .notEmpty().withMessage('Invalid Email')
            .normalizeEmail().isEmail().withMessage('Invalid Email'),
        query('emailConfirmationHash')
            .notEmpty().withMessage('Invalid Activation Information')
            .isString().withMessage('Invalid Activation Information'),
        query('appReturnUrl')
            .notEmpty().withMessage('Invalid Activation Information'),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Request data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.render('error/error_404', {
                    pageTitle: '404',
                    errorMessage: 'Invalid Request',
                    homeUrl: 'http://localhost:3000',
                })
            }
            next()
        }
    ]

    validatePostActivateAccount = [
        body('userId')
            .notEmpty().isString().withMessage('Invalid user id'),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(401).json({errorMessage: errors.array()[0].msg})
            }
            next()
        }
    ]

    validatePostDeactivateAccount = this.validatePostActivateAccount

    deleteAccount = [
        body('userId')
            .notEmpty().isString().withMessage('Invalid user id'),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Request data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(401).json({errorMessage: errors.array()[0].msg})
            }
            next()
        }
    ]

}
