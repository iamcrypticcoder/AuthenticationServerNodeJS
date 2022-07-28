import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import ms from 'ms'

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../..', 'private-key.pem'))
const RSA_PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../..', 'public-key.pem'))

/**
 * JWT Basics:
 * https://medium.com/dataseries/public-claims-and-how-to-validate-a-jwt-1d6c81823826
 * “iss” (Issuer) Claim
 * "sub" (Subject) Claim
 * "aud" (Audience) Claim
 * "exp" (Expiration Time) Claim
 * "nbf" (Not Before) Claim
 * "iat" (Issued At) Claim
 * "jti" (JWT ID) Claim
 * @param uid
 * @param cb
 */
export const generateAccessToken = (user: any, cb: jwt.SignCallback) => {
    jwt.sign({
        iat: ms('0s'),   // expressed in seconds
        role: user.role
    }, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '1d',   // expressed in seconds or a string describing a time span zeit/ms . Eg: 60, “2 days”, “10h”, “7d”
        notBefore: '0s',   // expressed in seconds or a string describing a time span zeit/ms . Eg: 60, “2 days”, “10h”, “7d”
        subject: user._id.toString(),
        issuer: 'localhost:3000',
        audience: ['localhost:3000', 'localhost:4200'],
        header: {
            alg: 'RS256',
            kid: '12345'
        }
    }, (err, token) => {
        cb(err, token)
    })
}

export const generateRefreshToken = (user: any, cb: jwt.SignCallback) => {
    jwt.sign({
        iat: ms('0s'),   // expressed in seconds
        role: user.role
    }, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '2d',   // expressed in seconds or a string describing a time span zeit/ms . Eg: 60, “2 days”, “10h”, “7d”
        notBefore: '0s',   // expressed in seconds or a string describing a time span zeit/ms . Eg: 60, “2 days”, “10h”, “7d”
        subject: user._id.toString(),
        issuer: 'localhost:3000',
        audience: ['localhost:3000', 'localhost:4200'],
        header: {
            alg: 'RS256',
            kid: '12345'
        }
    }, (err, token) => {
        cb(err, token)
    })
}
