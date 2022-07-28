import express from 'express'
import {  body, cookie, header, param, query, validationResult } from 'express-validator'

import { UserModel, UserDocument } from '../models/mongoose/user.model'

export const validatePostLogin = [
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.body.originalEmail = req.body.email    
        next()
    },

    body('email')
    .normalizeEmail().isEmail().withMessage('Invalid Email')
    .custom(async (value, { req }) => {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) return Promise.reject('User doesn\'t exist !')
        return true
    }),

    body('password')
        .notEmpty().withMessage('Password should not be empty')
        .isLength({min: 8, max: 32}).withMessage('Password length should be of minimum 8 characters and maximum 32 characters')
        .trim(),

    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('Post data validated')
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).render('auth/login', {
                path: 'auth/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg
            })
        }
        next()
    }
]

export const validatePostSignup = [
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.body.originalEmail = req.body.email    
        next()
    },

    body('email')
        .notEmpty().withMessage('Invalid Email')
        .normalizeEmail().isEmail().withMessage('Invalid Email'),

    body('password')
        .notEmpty().withMessage('Password should not be empty')
        .isLength({min: 8, max: 32}).withMessage('Password length should be of minimum 8 characters and maximum 32 characters')
        .trim(),
        
    body('confirmPassword')
        .notEmpty().withMessage('Confirm password should not be empty')
        .isLength({min: 8, max: 32}).withMessage('Password length should be of minimum 8 characters and maximum 32 characters')
        .custom((value, { req }) => {
            if (value !== req.body.password) 
                return Promise.reject('Confirm password should be matched with password')
            return true
        })
        .trim(),

    body('gender')
        .isIn(['Male', 'Female', 'Others'])
        .withMessage('Invalid gender')
        .trim(),

    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('Post data validated')
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).render('auth/signup', {
                path: 'auth/signup',
                pageTitle: 'Sign Up',
                errorMessage: errors.array()[0].msg
            })
        }
        next()
    }
]

export const validatePostResetPassword = [
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.body.originalEmail = req.body.email    
        next()
    },

    body('email')
    .normalizeEmail().isEmail().withMessage('Invalid Email')
    .custom(async (value, { req }) => {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) return Promise.reject('User doesn\'t exist !')
        req.body.foundUser = user
        return true
    }),

    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('Post data validated')
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).render('auth/reset_password', {
                path: 'auth/reset_password',
                pageTitle: 'Reset password',
                errorMessage: errors.array()[0].msg
            })
        }
        next()
    }
]

export const validateGetResetPasswordConfirm = [
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.query.originalEmail = req.query.email    
        next()
    },

    query('email')
    .normalizeEmail().isEmail().withMessage('Invalid Email')
    .custom(async (value, { req }) => {
        const user = await UserModel.findOne({email: req.query?.email})
        if (!user) return Promise.reject('User doesn\'t exist !')
        req.body.foundUser = user
        return true
    }),

    query('token')
    .trim().notEmpty().withMessage('Invalid Request')
    .custom(async (value, { req }) => {
        if (value !== req.body.foundUser.recoveryHash) return Promise.reject('Invalid Request')
        return true
    }),

    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).render('auth/reset_password_confirm', {
                path: 'auth/reset_password_confirm',
                pageTitle: 'Reset password',
                errorMessage: errors.array()[0].msg
            })
        }
        next()
    }
]

export const validatePostResetPasswordConfirm = [
    
]