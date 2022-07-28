import path from 'path'
import * as express from 'express'
import bcrypt from 'bcrypt'
import ms from 'ms'
import { generateAccessToken, generateRefreshToken } from "../../helpers/jwt_token_generator"
import dayjs from "dayjs";

// Mongoose Models
import {LoginSessionModel} from "../../models/mongoose/login-session.model";
import {ipLookup} from "../../helpers/util.helper";

class RestApiLoginController {
    constructor() {

    }

    postLogin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${RestApiLoginController.name}: postLogin()`)
        const user = req.body.foundUser

        // Email confirmation check
        if (false == user.isEmailConfirmed) {
            return res.status(401).json({errorMessage: 'Email confirmation required'})
        }

        // Client ip lookup check
        let reqIpAddress = req.headers['x-forwarded-for'] as string
        ipLookup(reqIpAddress).then(value => {
            let loginSession = new LoginSessionModel({
                userId: user.id,
                countryName: value.data['country_name'],
                countryCode: value.data['country_code2'],
                device: req['user-agent' as keyof typeof req],
                ip: {
                    address: reqIpAddress,
                    number: value.data['ip_number'],
                    version: value.data['ip_version']
                },
                isp: value.data['isp'],
                loginResult: false
            })

            bcrypt.compare(req.body.password, user.passwordHash).then(async matched => {
                if (!matched) {
                    loginSession.loginResult = false
                    await loginSession.save()
                    return res.status(401).json({errorMessage: 'Incorrect password'})
                }

                generateAccessToken(user, async (err, idToken) => {
                    if (err) {
                        loginSession.loginResult = false
                        await loginSession.save()
                        return res.status(500).json({errorMessage: 'Internal Server Error'})
                    }
                    generateRefreshToken(user, async (err, refreshToken) => {
                        if (err) {
                            loginSession.loginResult = false
                            await loginSession.save()
                            return res.status(500).json({errorMessage: 'Internal Server Error'})
                        }
                        user.lastLoginAt = dayjs()
                        await user.save()
                        loginSession.loginResult = true
                        await loginSession.save()

                        const cookieOption = {
                            expires: new Date(Date.now() + 900000),
                            httpOnly: true,
                            sameSite: true,
                            secure: true
                        }
                        res.cookie('refreshToken', refreshToken, cookieOption)
                        res.status(200).json({
                            idToken: idToken,
                            tokenType: 'Bearer',
                            email: req.body.originalEmail,
                            expiresIn: ms('1d'),
                            localId: user?._id
                        })
                    })
                })
            })
        }).catch(err => {
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })
    }

    getGoogleLoginCallback = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let state: {appReturnUrl: string} = JSON.parse(req.query.state?.toString() || '')
        console.log('appReturnUrl = ' + state.appReturnUrl)
        console.log('req.user = ' + JSON.stringify(req.user))
        const user = (req.user as any)

        generateAccessToken(user, (err, idToken) => {
            if (err) return res.status(500).json({errorMessage: 'Internal Server Error'})
            generateRefreshToken(user, async (err, refreshToken) => {
                if (err) return res.status(500).json({errorMessage: 'Internal Server Error'})
                user.lastLoginAt = dayjs()
                await user.save()
                const cookieOption = {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true,
                    sameSite: true,
                    secure: true
                }
                res.cookie('refreshToken', refreshToken, cookieOption)
                res.redirect(state.appReturnUrl + '?loginSuccess=google')
            })
        })
    }

    getFacebookLoginCallback = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let state: {appReturnUrl: string} = JSON.parse(req.query.state?.toString() || '')
        console.log('appCallbackUrl = ' + state.appReturnUrl)
        res.redirect(state.appReturnUrl)
    }


}

export default RestApiLoginController
