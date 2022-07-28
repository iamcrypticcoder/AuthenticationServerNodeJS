import passport from 'passport'
import passportLocal from 'passport-local'
import mongoose, { CallbackError } from 'mongoose'

import { UserModel, UserDocument } from '../models/mongoose/user.model'

const LocalStrategy = passportLocal.Strategy

export const setupLocalStrategy = () => {
    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        console.log(email + ' ' + password)
        UserModel.findOne({email: email}, (err: mongoose.CallbackError, user: UserDocument) => {
            if (err) { return done(err) }
            if (!user) { return done(undefined, false, { message: `Email ${email} not found.` }) }
            console.log('User found: ' + user)
            user.verifyPassword(password, (err, matched) => {
                if (err) return done(err, false)
                if (!matched) return done(undefined, false, { message: `Password doesn't matched` })
                return done(undefined, user)
            })
        })
    }))
}


