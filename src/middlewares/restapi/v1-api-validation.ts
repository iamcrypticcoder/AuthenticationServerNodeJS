import express from 'express'
import {  body, cookie, header, param, query, validationResult } from 'express-validator'
import { UserModel, UserDocument } from '../../models/mongoose/user.model'
import { validUploadTypesArray } from "../types";
import {countries, languagesAll} from "countries-list";
import timezones from 'timezones-list'
import currencyCode, {data} from 'currency-codes'

export class V1ApiValidation {
    constructor() {

    }

    uploadRequest = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.params)
            next()
        },

        body('uploadType')
            .trim().notEmpty().isIn(validUploadTypesArray).withMessage('Invalid upload type'),

        body('ownerUserId')
            .notEmpty().withMessage('Invalid user id')
            .custom(async (value, {req}) => {
                const user = await UserModel.findOne({_id: value})
                if (!user) return Promise.reject('User doesn\'t exist !')
                req.body.foundUser = user
                return true
            }),

        body('fileName')
            .trim().notEmpty().withMessage('Invalid file name'),

        body('mimeType')
            .trim().notEmpty().isIn(['image/jpeg', 'image/png']).withMessage('Invalid mime type'),

        body('fileSize')
            .trim().notEmpty().withMessage('Invalid file size')
            .isInt().withMessage('Invalid file size'),

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

    uploadSuccess = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.params)
            next()
        },


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

    getUserOld = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const allowedQueryField = ['email', 'first_name', 'last_name', 'display_name']
            console.log(req.query)
            //req.query.originalEmail = req.query.email
            next()
        },

        query('email')
            .isEmail().withMessage('Invalid email'),

        query('first_name')
            .optional().isString().trim().withMessage('First name'),

        query('last_name')
            .optional().isString().withMessage('Last name'),

        query('display_name')
            .optional().isString().withMessage('Invalid display name'),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(422).json({
                    errorMessage: errors.array()[0].msg
                })
            }
            next()
        }
    ]

    getUser = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.params)
            next()
        }
    ]

    putUser = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.params)
            next()
        },

        param('userId')
            .trim().notEmpty().withMessage('Invalid user id')
            .custom(async (value, {req}) => {
                const user = await UserModel.findOne({_id: value})
                if (!user) return Promise.reject('User doesn\'t exist !')
                req.body.foundUser = user
                return true
            }),

        body('firstName')
            .optional().isString().trim().withMessage('First name'),

        body('lastName')
            .optional().isString().withMessage('Last name'),

        // body('addressLine1')
        //     .optional().isString().withMessage('Invalid address'),
        //
        // body('addressLine2')
        //     .optional().isString().withMessage('Invalid address'),
        //
        // body('town')
        //     .optional().isString().withMessage('Invalid town'),
        //
        // body('state')
        //     .optional().isString().withMessage('Invalid state'),
        //
        // body('postcode')
        //     .optional().isString().withMessage('Invalid postcode'),

        body('contactNumber')
            .optional().isString().withMessage('Invalid contact number'),

        body('country')
            .optional().trim().isIn(Object.keys(countries)).withMessage('Invalid country'),

        body('currency')
            .optional().trim().isIn(currencyCode.data.map(obj => obj.code)).withMessage('Invalid currency'),

        body('language')
            .optional().trim().isIn(Object.keys(languagesAll)).withMessage('Invalid language'),

        body('timezone')
            .optional().trim().isIn(timezones.map(obj => obj.tzCode)).withMessage('Invalid timezone'),

        body('address')
            .optional().isObject().withMessage('Invalid address'),

        // body('displayName')
        //     .optional().isString().withMessage('Invalid display name'),

        body('profilePicture')
            .optional().isString().withMessage('Invalid profile picture'),

        body('coverPicture')
            .optional().isString().withMessage('Invalid cover picture'),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(422).json({errorMessage: errors.array()[0].msg})
            }

            req.body.countryCode = req.body.country
            req.body.currencyCode = req.body.currency
            req.body.languageCode = req.body.language
            req.body.timezoneCode = req.body.timezone
            next()
        }
    ]

    deleteUser = [
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.params)
            next()
        },

        param('userId')
            .trim().notEmpty().withMessage('Invalid user id')
            .custom(async (value, {req}) => {
                const user = await UserModel.findOne({_id: value})
                if (!user) return Promise.reject('User doesn\'t exist !')
                req.body.foundUser = user
                return true
            }),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(422).json({errorMessage: errors.array()[0].msg})
            }
        }
    ]

    getUsers = [
        query('sort_by')
            .trim().notEmpty().isString().isIn(['signup_time', 'email', 'last_login_time']).withMessage('Invalid sort by'),

        query('order_by')
            .trim().notEmpty().isString().isIn(['asc', 'desc']).withMessage('Invalid order by'),

        query('before')
            .optional().trim().isString().withMessage('Invalid before'),

        query('after')
            .optional().trim().isString().withMessage('Invalid after'),

        query('limit')
            .optional().trim().isNumeric().withMessage('Invalid limit')
            .custom(async (value, {req}) => {
                if (value < 0 || value > 100) return Promise.reject('Invalid limit')
                return true
            }),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(422).json({
                    errorMessage: errors.array()[0].msg
                })
            }
            next()
        }
    ]

    getUserProfilePictures = [
        param('userId')
            .trim().notEmpty().isString().withMessage('Invalid user id')
            .custom(async (value, {req}) => {
                const user = await UserModel.findOne({_id: value})
                if (!user) return Promise.reject('User doesn\'t exist !')
                req.body.foundUser = user
                return true
            }),

        query('before')
            .optional().trim().isString().withMessage('Invalid before'),

        query('after')
            .optional().trim().isString().withMessage('Invalid after'),

        query('limit')
            .optional().trim().isNumeric().withMessage('Invalid limit')
            .custom(async (value, {req}) => {
                if (value < 0 || value > 100) return Promise.reject('Invalid limit')
                return true
            }),

        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('Post data validated')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors.array())
                return res.status(422).json({
                    errorMessage: errors.array()[0].msg
                })
            }
            next()
        }
    ]

    getUserCoverPictures = this.getUserProfilePictures
}
