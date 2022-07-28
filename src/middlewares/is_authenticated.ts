import express from 'express'
import { expressjwt, Request as JWTRequest } from "express-jwt"
import { JwksClient } from 'jwks-rsa'

export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) { return next() }
    res.redirect("/login")
}

export const isUnauthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isUnauthenticated()) { return next() }
    res.redirect("/")
}



















// const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const client = new JwksClient({
//         cache: true, // Default Value
//         cacheMaxEntries: 5, // Default value
//         cacheMaxAge: 600000, // Defaults to 10m
//         jwksUri: 'https://sandrino.auth0.com/.well-known/jwks.json'
//     })
//     const kid = 'RkI5MjI5OUY5ODc1N0Q4QzM0OUYzNkVGMTJDOUEzQkFCOTU3NjE2Rg'
//     const key = await client.getSigningKey(kid)
//     const signingKey = key.getPublicKey()
// }

// const isAuthenticated = expressjwt({
//     secret: new jwksRsa.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksUri: "https://angularuniv-security-course.auth0.com/.well-known/jwks.json"
//     }),
//     algorithms: ['RS256']
// });
