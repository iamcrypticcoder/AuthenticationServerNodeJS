import * as express from "express";
import {UserModel} from "../../models/mongoose/user.model";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken} from "../../helpers/jwt_token_generator";
import {UserProfile} from "../../models/mongoose/user_profile";
import crypto from "crypto";
import dayjs from "dayjs";
import { sendResetPasswordEmail } from "../../aws/ses.aws";

class PasswordController {
    constructor() {

    }

    sendResetPasswordEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${PasswordController.name}: sendResetPasswordEmail()`)
        const user = req.body.foundUser

        // If request comes within 5 minutes of last request
        if (dayjs().subtract(5, 'minute').isBefore(user.passwordResetHashLastRequestAt)) {
            console.log('5 minutes not elapsed')
            return res.status(400).json({errorMessage: 'Bad Request'})
        }

        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err)
                return res.status(500).json({errorMessage: 'Internal server error'})
            }

            const token = buffer.toString('hex')
            user.passwordResetHash = token
            user.passwordResetHashExpireDate = dayjs().add(1, 'hour')
            user.passwordResetHashLastRequestAt = dayjs()
            user.save()

            const url = new URL(req.body.appPasswordResetUrl)
            url.search = `email=${req.body.originalEmail}&recoveryHash=${user.passwordResetHash}`
            console.log(`${PasswordController.name}: Password Reset Link = ${url.toString()}`)

            sendResetPasswordEmail({
                email: req.body.originalEmail,
                userDisplayName: user.displayName,
                passwordResetLink: url.toString()
            })
            return res.status(200).json({email: req.body.originalEmail})
        })
    }

    resetPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${PasswordController.name}: resetPassword()`)
        const user = req.body.foundUser

        if (dayjs().isAfter(dayjs(user.passwordResetHashExpireDate)))
            return res.status(400).json({errorMessage: 'Bad Request'})
        if (user.recoveryHash == '' || req.body.recoveryHash != user.passwordResetHash)
            return res.status(400).json({errorMessage: 'Bad Request'})

        bcrypt.hash(req.body.newPassword, 12).then(async passwordHash => {
            user.passwordHash = passwordHash
            user.passwordResetHash = ''
            user.passwordResetHashExpireDate = dayjs()
            user.save()
            return res.status(200).json({email: req.body.originalEmail})
        }).catch(err => {
            return res.status(500).json({errorMessage: 'Bad Request'})
        })
    }

    changePassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${PasswordController.name}: changePassword()`)
        const userId = (req.user as any)._id.toString()
        const user = await UserModel.findById(userId)
        if (!user) return res.status(400).json({errorMessage: 'Bad Request'})

        bcrypt.hash(req.body.newPassword, 12).then(async passwordHash => {
            user.passwordHash = passwordHash
            await user.save()
            generateAccessToken(user || '', (err, idToken) => {
                if (err) return res.status(500).json({errorMessage: 'Internal Server Error'})
                generateRefreshToken(user || '', (err, refreshToken) => {
                    if (err) return res.status(500).json({errorMessage: 'Internal Server Error'})
                    return res.status(200).json({
                        email: req.body.originalEmail,
                        idToken: idToken,
                        refreshToken: refreshToken,
                        expiresIn: 3600*3600,
                        localId: userId
                    })
                })
            })
        }).catch(err => {
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })
    }
}

export default PasswordController
