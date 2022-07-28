import * as express from "express";
import {UserModel, UserDocument} from "../../models/mongoose/user.model";
import {s3Client} from "../../aws/s3.aws";
import axios from "axios";
import * as fs from "fs";
import {ProfilePictureModel} from "../../models/mongoose/profile-picture.model";
import _ from 'lodash'
import {cloudFrontSignedUrl, cloudFrontUrl} from "../../aws/cloudfront.aws";

export class UserController {
    constructor() {
    }

    getUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${UserController.name}: getUser()`)

        const projection = '-passwordHash -email -passwordResetHash -passwordResetHashExpireDate -passwordResetHashLastRequestAt ' +
            '-emailConfirmationHash -emailConfirmationCode -activationHash -activationCode -recoveryHash -recoveryHashExpireDate ' +
            '-isEmailConfirmed -isAccountActive -isAccountDeleted -recoveryCode -recoveryCodeExpireDate -passwordUpdatedAt -__v'
        UserModel.findOne({_id: req.params.userId}, projection).then(doc => {
            if (null == doc) return res.status(400).json({errorMessage: 'Bad Request'})
            let response = doc.toJSON()
            _.unset(response, '_id')
            _.unset(response, 'originalEmail')
            _.set(response, 'id', doc._id)
            _.set(response, 'email', doc.originalEmail)
            if (response.profilePicture) {
                _.set(response, 'profilePictureUrl',
                    cloudFrontSignedUrl(cloudFrontUrl(response.profilePicture.s3ObjectKey)))
            }
            _.unset(response, 'profilePicture')
            return res.status(200).json(response)
        }).catch(err => {
            console.log(err)
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })
    }

    getUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${UserController.name}: getUsers()`)

        const sortBy = req.query.sort_by?.toString() || ''
        const orderBy: string = req.query.order_by?.toString() || ''
        const after = req.query.after?.toString() || ''
        const before = req.query.before?.toString() || ''
        const limit = Number.parseInt(req.query.limit?.toString() || '20')

        const filter: {[key: string]: any} = {}
        const sort: {[key: string]: any} = {}
        if (sortBy == 'signup_time') {
            sort['createdAt'] = orderBy
            if (after.length) filter['createdAt'] = {$gt: after}
            if (before.length) filter['createdAt'] = {$lt: before}
        } else if (sortBy == 'email') {
            sort['originalEmail'] = orderBy
            if (after.length) filter['originalEmail'] = {$gt: after}
            if (before.length) filter['originalEmail'] = {$lt: before}
        } else if (sortBy == 'last_login_time') {
            sort['lastLoginAt'] = orderBy
            if (after.length) filter['lastLoginAt'] = {$gt: after}
            if (before.length) filter['lastLoginAt'] = {$lt: before}
        }

        const projection = '-passwordHash -email -activationHash -activationCode -recoveryHash -recoveryHashExpireDate ' +
            '-recoveryCode -recoveryCodeExpireDate'
        UserModel.find(filter, projection).limit(limit).sort(sort).then(docs => {
            let userList = docs.map(doc => {
                const user = doc.toJSON()
                _.unset(user, '_id')
                _.unset(user, 'originalEmail')
                _.set(user, 'id', doc._id)
                _.set(user, 'email', doc.originalEmail)
                if (user.profilePicture) {
                    _.set(user, 'profilePictureUrl',
                        cloudFrontSignedUrl(cloudFrontUrl(user.profilePicture.s3ObjectKey)))
                }
                _.unset(user, 'profilePicture')
                return user
            })
            res.status(200).json(userList)
        }).catch(err => {
            if (err) {
                console.error(err)
                return res.status(500).json({errorMessage: 'Internal Server Error'})
            }
        })
    }

    putUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${UserController.name}: putUser()`)
        console.log(req.body.foundUser)
        const user = req.body.foundUser

        const filter = {_id: (req.user as any)._id}
        const update : any = {}

        // Set update fields
        const fields = ['firstName', 'middleName', 'lastName', 'displayName', 'contactNumber',
            'countryCode', 'currencyCode', 'languageCode', 'timezoneCode', 'address']
        for (let f of fields) if (req.body.hasOwnProperty(f)) update[f] = req.body[f]

        if (req.body.hasOwnProperty('profilePicture')) {
            const doc = await ProfilePictureModel.findOne({_id: req.body['profilePicture'], ownerUserId: user.id})
            if (null == doc) return res.status(400).json({errorMessage: 'Bad Request'})
            update['profilePicture'] = {
                resourceId: doc._id,
                fileName: doc.fileName,
                s3ObjectKey: doc.s3ObjectKey,
                contentType: doc.contentType,
                contentLength: doc.contentLength
            }
        }
        if (req.body.hasOwnProperty('coverPicture')) {
            const doc = await ProfilePictureModel.findOne({_id: req.body['coverPicture'], ownerUserId: user.id})
            if (null == doc) return res.status(400).json({errorMessage: 'Bad Request'})
            update['coverPicture'] = {
                resourceId: doc._id,
                fileName: doc.fileName,
                s3ObjectKey: doc.s3ObjectKey,
                contentType: doc.contentType,
                contentLength: doc.contentLength
            }
        }

        // Query to DB
        UserModel.updateOne(filter, update).then(doc => {
            console.log(doc)
            res.status(200).json()
        }).catch(err => {
            console.log(err)
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })
    }

    deleteUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${UserController.name}: deleteUser()`)

    }
}
