import passport from 'passport'
import passportFacebook from 'passport-facebook'
import mongoose, { CallbackError } from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import validator from 'validator'
import axios from 'axios'

import { UserModel, UserDocument } from '../models/mongoose/user.model'
import { UserProfile, UserProfileDocument } from '../models/mongoose/user_profile'
import { response } from 'express'

const FacebookStrategy = passportFacebook.Strategy

const FB_GRAPH_API_ME = process.env.FB_GRAPH_API_ME?.toString() || ''

export const setupFacebookStrategy = () => {
    passport.use('restapi-facebook-login', new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID?.toString() || '',
        clientSecret: process.env.FACEBOOK_APP_SECRET?.toString() || '',
        callbackURL: process.env.FACEBOOK_CALLBACK_URL_REST_API?.toString() || '',
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        console.log('============= INSIDE FACEBOOK LOGIN STRATEGY START =============')
        console.log('request = ' + JSON.stringify(request.query))
        console.log('state = ' + JSON.stringify(request.query.state))
        let state: {appCallbackUrl: string} = JSON.parse(request.query.state?.toString() || '')
        console.log('callbackUrl = ' + state.appCallbackUrl)
        console.log('accessToken = ' + accessToken)
        console.log('refreshToken = ' + refreshToken)
        console.log('profile = ' + profile)

        axios.get(FB_GRAPH_API_ME, {
            params: {
                fields: 'id,name,first_name,last_name,gender,email',
                access_token: accessToken
            }
        }).then(async response => {
            const info = response.data
            // If email not available signup won't proceed further
            if (info.email === undefined) {
                return done(undefined, false, { message: "Email not found from facebook profile" })
            }

            const foundUser = await UserModel.findOne({email: validator.normalizeEmail(info.email)})
            if (!foundUser) {
                // New User Signup
                const randomPassword = crypto.randomBytes(32).toString('hex')
                bcrypt.hash(randomPassword, 12).then(async passwordHash => {
                    const user = new UserModel({
                        email: validator.normalizeEmail(info.email),
                        originalEmail: info.email,
                        passwordHash: passwordHash,
                        facebookIdentity: info.id
                    })
                    user.save()
                    const profile = new UserProfile({
                        userId: user._id,
                        displayName: info.name,
                        firstName: info.first_name,
                        lastName: info.last_name,
                        gender: info.gender.charAt(0).toUpperCase() + info.gender.slice(1)
                    })
                    profile.save()
                    console.log('NEW USER SIGNUP SUCCESSFUL FROM FACEBOOK IDENTITY')
                    console.log('============= INSIDE FACEBOOK LOGIN STRATEGY END =============')
                    console.log('Here 100')
                    done(undefined, user)
                })
            } else {
                // Existing User Login
                console.log('FACEBOOK IDENTITY ALREADY EXIST')
                foundUser.facebookIdentity = info.id
                foundUser.save()
                console.log('============= INSIDE FACEBOOK LOGIN STRATEGY END =============')
                done(undefined, foundUser)
            }
        }).catch(err => {
            done(err, null)
        })


        // Get user basic info to
        // axios.get('https://graph.facebook.com/v14.0/me', {
        //     params: {
        //         fields: 'id,name,first_name,last_name,gender,email',
        //         access_token: accessToken
        //     }
        // }).then(response => {
        //     console.log(response.data)
        // }).catch(err => {

        // })

        // curl -i -X GET \
        // "https://graph.facebook.com/v14.0/me?fields=id%2Cname%2Cemail%2Cfirst_name%2Cgender%2Clanguages%2Cphotos%7Bimages%7D&access_token=EAAHC6bciG7MBABzbA29S5kJaRbE68SSC11282tOP81T7zSzJfc1ldQVjZB2b2Hoeq27gMjJcPJKwOZA1iEqtBV8ugyVpz1x31cy1S9ghEkqMjXsYqDwDpnceUeZC67Aw49Tl7hFxrkzu7AP8D1NgPhvWVbZBVwy5dV8rIr3EN2ngZAQ3nbbSXartLD6BNRvO3rvr0HYVk6SQV4sgV70hHjedEjpDJ151ZCWbZCoJm9fCaB7psqtdFkj"
        // // let { id, displayName } = profile
    }))

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID?.toString() || '',
        clientSecret: process.env.FACEBOOK_APP_SECRET?.toString() || '',
        callbackURL: process.env.FACEBOOK_CALLBACK_URL?.toString() || '',
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        console.log('============= INSIDE FACEBOOK LOGIN STRATEGY START =============')
        console.log('request = ' + request)
        console.log('accessToken = ' + accessToken)
        console.log('refreshToken = ' + refreshToken)
        console.log('profile = ' + profile)

        axios.get(FB_GRAPH_API_ME, {
            params: {
                fields: 'id,name,first_name,last_name,gender,email',
                access_token: accessToken
            }
        }).then(async response => {
            const info = response.data
            // If email not available signup won't proceed further
            if (info.email === undefined) {
                return done(undefined, false, { message: "Email not found from facebook profile" })
            }

            const foundUser = await UserModel.findOne({email: validator.normalizeEmail(info.email)})
            if (!foundUser) {
                // New User Signup
                const randomPassword = crypto.randomBytes(32).toString('hex')
                bcrypt.hash(randomPassword, 12).then(async passwordHash => {
                    const user = new UserModel({
                        email: validator.normalizeEmail(info.email),
                        originalEmail: info.email,
                        passwordHash: passwordHash,
                        facebookIdentity: info.id
                    })
                    user.save()
                    const profile = new UserProfile({
                        userId: user._id,
                        displayName: info.name,
                        firstName: info.first_name,
                        lastName: info.last_name,
                        gender: info.gender.charAt(0).toUpperCase() + info.gender.slice(1)
                    })
                    profile.save()
                    console.log('NEW USER SIGNUP SUCCESSFUL FROM FACEBOOK IDENTITY')
                    console.log('============= INSIDE FACEBOOK LOGIN STRATEGY END =============')
                    console.log('Here 100')
                    done(undefined, user)
                })
            } else {
                // Existing User Login
                console.log('FACEBOOK IDENTITY ALREADY EXIST')
                foundUser.facebookIdentity = info.id
                foundUser.save()
                console.log('============= INSIDE FACEBOOK LOGIN STRATEGY END =============')
                done(undefined, foundUser)
            }
        }).catch(err => {
            done(err, null)
        })


        // Get user basic info to
        // axios.get('https://graph.facebook.com/v14.0/me', {
        //     params: {
        //         fields: 'id,name,first_name,last_name,gender,email',
        //         access_token: accessToken
        //     }
        // }).then(response => {
        //     console.log(response.data)
        // }).catch(err => {

        // })

        // curl -i -X GET \
        // "https://graph.facebook.com/v14.0/me?fields=id%2Cname%2Cemail%2Cfirst_name%2Cgender%2Clanguages%2Cphotos%7Bimages%7D&access_token=EAAHC6bciG7MBABzbA29S5kJaRbE68SSC11282tOP81T7zSzJfc1ldQVjZB2b2Hoeq27gMjJcPJKwOZA1iEqtBV8ugyVpz1x31cy1S9ghEkqMjXsYqDwDpnceUeZC67Aw49Tl7hFxrkzu7AP8D1NgPhvWVbZBVwy5dV8rIr3EN2ngZAQ3nbbSXartLD6BNRvO3rvr0HYVk6SQV4sgV70hHjedEjpDJ151ZCWbZCoJm9fCaB7psqtdFkj"
        // // let { id, displayName } = profile
    }))
}
