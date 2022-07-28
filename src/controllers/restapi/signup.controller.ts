import * as express from 'express'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import { generateRefreshToken, generateAccessToken } from "../../helpers/jwt_token_generator"

import { UserModel, UserDocument } from '../../models/mongoose/user.model'
import {sendEmailConfirmationEmail} from "../../aws/ses.aws";
import crypto from "crypto";

class SignUpController {
    constructor() {

    }

    postSignUp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${SignUpController.name}: postSignUp()`)

        try {
            let isExist = await UserModel.findOne({email: req.body.email})
            if (isExist) return res.status(422).json({errorMessage: 'User already exist with this email'})

            bcrypt.hash(req.body.password, 12).then(async passwordHash => {
                const user = new UserModel({
                    email: req.body.email,
                    originalEmail: req.body.originalEmail,
                    passwordHash: passwordHash,
                    displayName: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
                    firstName: req.body.firstName,
                    middleName: req.body.middleName,
                    lastName: req.body.lastName,
                    countryCode: req.body.countryCode,
                    currencyCode: req.body.currencyCode,
                    languageCode: req.body.languageCode,
                    emailConfirmationHash: crypto.randomBytes(32).toString('hex')
                })
                await user.save()
                console.log(`${SignUpController.name}: Signup Successful`)
                console.log('Signup Successful')

                generateAccessToken(user, (err, idToken) => {
                    generateRefreshToken(user, (err, refreshToken) => {
                        const url = new URL(`${process.env.REST_API_V1_URL?.toString()}/confirmEmail`)
                        url.search = `email=${req.body.originalEmail}&emailConfirmationHash=${user.emailConfirmationHash}&appReturnUrl=http://localhost:4200`
                        console.log(`${SignUpController.name}: Email Confirmation Link = ${url.toString()}`)

                        sendEmailConfirmationEmail({
                            email: req.body.originalEmail,
                            userDisplayName: user.displayName,
                            activationLink: url.toString()
                        })
                        res.status(200).json({
                            idToken: idToken,
                            email: req.body.originalEmail,
                            refreshToken: refreshToken,
                            expiresIn: 3600*3600,
                            localId: user?._id
                        })
                    })
                })
            })
        } catch(err) {
            console.error(err)
            return res.status(500).json({errorMessage: 'Internal server error'})
        }
    }
}

export default SignUpController
