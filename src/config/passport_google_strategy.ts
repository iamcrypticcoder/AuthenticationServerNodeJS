import passport from 'passport'
import passportGoogle from 'passport-google-oauth2'
import mongoose, { CallbackError } from 'mongoose'
import validator from 'validator'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import flatted from 'flatted'

import { UserModel, UserDocument } from '../models/mongoose/user.model'
import { UserProfile, UserProfileDocument } from '../models/mongoose/user_profile'
import { param } from 'express-validator'

const GoogleStrategy = passportGoogle.Strategy

export const setupGoogleStrategy = () => {
    passport.use('restapi-google-login', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID?.toString() || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET?.toString() || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL_REST_API?.toString() || '',
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, params, profile, done) => {
        console.log('============= INSIDE GOOGLE LOGIN STRATEGY START =============')
        console.log('request = ' + JSON.stringify(request.query))
        console.log('state = ' + JSON.stringify(request.query.state))
        let state: {appReturnUrl: string} = JSON.parse(request.query.state?.toString() || '')
        console.log('appReturnUrl = ' + state.appReturnUrl)
        console.log('accessToken = ' + accessToken)
        console.log('refreshToken = ' + refreshToken)
        console.log('params = ' + JSON.stringify(params))
        //console.log('profile = ' + JSON.stringify(profile))
        let {id, sub, email, displayName, profilePhoto} = profile
        const firstName = profile.given_name
        const lastName = profile.family_name

        const foundUser = await UserModel.findOne({email: validator.normalizeEmail(email)})
        // New User Signup
        if (!foundUser) {
            const randomPassword = crypto.randomBytes(32).toString('hex')
            bcrypt.hash(randomPassword, 12).then(async passwordHash => {
                const user = new UserModel({
                    email: validator.normalizeEmail(email),
                    originalEmail: email,
                    passwordHash: passwordHash,
                    firstName: firstName,
                    lastName: lastName,
                    googleIdentity: sub
                })
                await user.save()
                console.log('NEW USER SIGNUP SUCCESSFUL FROM GOOGLE IDENTITY')
                console.log('============= INSIDE GOOGLE LOGIN STRATEGY END =============')
                done(undefined, user)
            })
        } else {
            // Existing User Login
            console.log('GOOGLE IDENTITY ALREADY EXIST')
            foundUser.googleIdentity = sub
            foundUser.save()
            console.log('============= INSIDE GOOGLE LOGIN STRATEGY END =============')
            done(undefined, foundUser)
        }
    }))

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID?.toString() || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET?.toString() || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL?.toString() || '',
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, params, profile, done) => {
        console.log('============= INSIDE GOOGLE LOGIN STRATEGY START =============')
        console.log('request = ' + JSON.stringify(request.query))
        console.log('state = ' + JSON.stringify(request.query.state))
        let state: {callbackUrl: string} = JSON.parse(request.query.state?.toString() || '{}')
        console.log('callbackUrl = ' + state.callbackUrl)
        console.log('accessToken = ' + accessToken)
        console.log('refreshToken = ' + refreshToken)
        console.log('params = ' + JSON.stringify(params))
        //console.log('profile = ' + JSON.stringify(profile))
        let {id, sub, email, displayName, profilePhoto} = profile
        const firstName = profile.given_name
        const middleName = profile.family_name

        const foundUser = await UserModel.findOne({email: validator.normalizeEmail(email)})
        // New User Signup
        if (!foundUser) {
            const randomPassword = crypto.randomBytes(32).toString('hex')
            bcrypt.hash(randomPassword, 12).then(async passwordHash => {
                const user = new UserModel({
                    email: validator.normalizeEmail(email),
                    originalEmail: email,
                    passwordHash: passwordHash,
                    googleIdentity: sub
                })
                user.save()
                const profile = new UserProfile({
                    userId: user._id,
                    firstName: firstName,
                    middleName: middleName,
                })
                profile.save()
                console.log('NEW USER SIGNUP SUCCESSFUL FROM GOOGLE IDENTITY')
                console.log('============= INSIDE GOOGLE LOGIN STRATEGY END =============')
                done(undefined, user)
            })
        } else {
            // Existing User Login
            console.log('GOOGLE IDENTITY ALREADY EXIST')
            foundUser.googleIdentity = sub
            foundUser.save()
            console.log('============= INSIDE GOOGLE LOGIN STRATEGY END =============')
            done(undefined, foundUser)
        }
    }))
}
