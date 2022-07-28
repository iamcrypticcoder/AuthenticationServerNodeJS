import fs from 'fs'
import path from 'path'

import passport from 'passport'
import passportJwt, { ExtractJwt } from 'passport-jwt'
import mongoose, { CallbackError } from 'mongoose'
import jwksRsa from 'jwks-rsa'
import { UserModel, UserDocument } from '../models/mongoose/user.model'
import express from "express";

const JwtStrategy = passportJwt.Strategy

//const RSA_PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../../', 'public-key.pem'))

export const setupJwtStrategy = () => {
    const cookieExtractor = function(req: express.Request) {
        var token = null;
        if (req && req.cookies) token = req.cookies['refreshToken'];
        console.log('cookieExtractor = ' + token)
        return token;
    };
    passport.use('rest-api-jwt-refresh-token', new JwtStrategy({
        jwtFromRequest: cookieExtractor,
        //secretOrKey: RSA_PUBLIC_KEY,
        issuer: 'localhost:3000',
        audience: 'localhost:4200',
        algorithms: ['RS256'],
        ignoreExpiration: false,
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
            cache: true, // Default Value
            cacheMaxEntries: 5, // Default value
            cacheMaxAge: 600000, // Defaults to 10m
            jwksUri: `${process.env.BASE_URL}/.well-known/jwks.json`
        })
    }, async (payload, done) => {
        console.log(payload)
        try {
            const user = await UserModel.findById(payload.sub)
            if (user) {
                return done(null, user)
            }
            else return done(null, false)
        } catch(err) {
            console.log(err)
            return done(err, false)
        }
    }))

    passport.use('rest-api-jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        //secretOrKey: RSA_PUBLIC_KEY,
        issuer: 'localhost:3000',
        audience: 'localhost:4200',
        algorithms: ['RS256'],
        ignoreExpiration: false,
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
            cache: true, // Default Value
            cacheMaxEntries: 5, // Default value
            cacheMaxAge: 600000, // Defaults to 10m
            jwksUri: `${process.env.BASE_URL}/.well-known/jwks.json`
        })
    }, async (payload, done) => {
        console.log(payload)
        try {
            const user = await UserModel.findById(payload.sub)
            if (user) {
                return done(null, user)
            }
            else return done(null, false)
        } catch(err) {
            console.log(err)
            return done(err, false)
        }
    }))



    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        //secretOrKey: RSA_PUBLIC_KEY,
        issuer: 'localhost:3000',
        audience: 'localhost:3000/api/v1',
        algorithms: ['RS256'],
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
            cache: true, // Default Value
            cacheMaxEntries: 5, // Default value
            cacheMaxAge: 600000, // Defaults to 10m
            jwksUri: 'http://localhost:3000/.well-known/jwks.json'
        })
    }, async (payload, done) => {
        console.log(payload)
        
        try {
            const user = await UserModel.findById(payload.sub)
            if (user) {
                return done(null, user)
            }
            else return done(null, false)
        } catch(err) {
            console.log(err)
            return done(err, false)
        }
    }))
}


