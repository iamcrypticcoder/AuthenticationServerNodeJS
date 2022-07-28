import * as express from "express";
import {UserModel} from "../../models/mongoose/user.model";
import crypto from "crypto";
import {sendEmailConfirmationEmail} from "../../aws/ses.aws";


class AccountController {
    constructor() {
    }

    profile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AccountController.name}: profile()`)
        //console.log('req.cookies = ' + JSON.stringify(req.cookies))
        const projection = '_id originalEmail username passwordUpdatedAt googleIdentity facebookIdentity role ' +
            'displayName firstName middleName lastName' +
            'isEmailConfirmed isAccountActive isAccountDeleted isEmailConfirmed lastLoginAt createdAt updatedAt'
        UserModel.findOne({_id: (req.user as any)._id}, projection).then((doc) => {
            res.status(200).json(doc)
        }).catch(err => {
            console.log(err)
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })
    }

    sendAccountActivationEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AccountController.name}: sendAccountActivationEmail()`)
        const user = req.body.foundUser

        if (user.isAccountActive) return res.status(400).json({errorMessage: 'Bad Request'})

        user.activationHash = crypto.randomBytes(32).toString('hex')
        await user.save()

        const url = new URL(`${process.env.REST_API_V1_URL?.toString()}/activateAccount`)
        url.search = `email=${req.body.originalEmail}&activationHash=${user.activationHash}&appReturnUrl=http://localhost:4200`
        console.log(`${AccountController.name}: activationLink = ${url.toString()}`)

        // sendAccountActivationEmail({
        //     email: req.body.originalEmail,
        //     userDisplayName: user.displayName,
        //     activationLink: url.toString()
        // })

        return res.status(200).json({email: req.body.originalEmail})
    }

    confirmEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AccountController.name}: confirmEmail()`)
        const user = await UserModel.findOne({email: req.query.email})
        if (!user)
            return res.status(400).json({errorMessage: 'Bad Request'})
        if (user.emailConfirmationHash.length == 0 || user.emailConfirmationHash !== req.query.emailConfirmationHash)
            return res.status(400).json({errorMessage: 'Bad Request'})

        user.isEmailConfirmed = true
        user.emailConfirmationHash = ''
        user.emailConfirmationCode = ''
        user.isAccountActive = true
        user.activationHash = ''
        user.activationCode = ''
        await user.save()
        console.log(`${AccountController.name}: Email confirmed... Redirecting to ${req.query.appReturnUrl}`)
        res.redirect(`${req.query.appReturnUrl}`)
    }

    activateAccount = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AccountController.name}: activateAccount()`)
        const user = await UserModel.findOne({_id: req.body.userId, isAccountActive: false})
        if (!user)
            return res.status(400).json({errorMessage: 'Bad Request'})
        // if (user.activationHash.length == 0 || user.activationHash !== req.query.activationHash)
        //     return res.status(400).json({errorMessage: 'Bad Request'})

        user.isAccountActive = true
        user.activationHash = ''
        user.activationCode = ''
        await user.save()
        console.log(`${AccountController.name}: Account activated...`)
        return res.status(200).json({message: 'Account activated'})
    }

    deactivateAccount = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AccountController.name}: deactivateAccount()`)
        const user = await UserModel.findOne({_id: req.body.userId, isAccountActive: true})
        if (!user)
            return res.status(400).json({errorMessage: 'Bad Request'})

        user.isAccountActive = false
        user.activationHash = ''
        user.activationCode = ''
        await user.save()
        console.log(`${AccountController.name}: Account deactivated...`)
        return res.status(200).json({message: 'Account deactivated'})
    }

    deleteAccount = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AccountController.name}: deleteAccount()`)
        const user = await UserModel.findOne({_id: req.body.userId, isAccountDeleted: false})
        if (!user)
            return res.status(400).json({errorMessage: 'Bad Request'})

        user.isAccountDeleted = true
        await user.save()
        return res.status(200).json()
    }
}

export default AccountController
