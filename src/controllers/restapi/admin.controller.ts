import * as express from "express";

import { UserModel, UserDocument } from "../../models/mongoose/user.model";
import {CallbackError} from "mongoose";

export class AdminController {
    constructor() {
    }

    getUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AdminController.name}: getUser()`)

        const filter: {[key: string]: any} = {}
        if (req.query.email) filter['originalEmail'] = req.query.email
        if (req.query.first_name) filter['firstName'] = req.query.first_name
        if (req.query.last_name) filter['lastName'] = req.query.last_name
        if (req.query.display_name) filter['displayName'] = req.query.display_name
        UserModel.findOne(filter).then(doc => {
            res.status(200).json(doc)
        }).catch(err => {
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })
    }

    getUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${AdminController.name}: getUsers()`)

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
        UserModel.find(filter, projection).limit(limit).sort(sort).then((docs) => {
            console.log(docs)
            res.status(200).json(docs)
        }).catch(err => {
            if (err) {
                console.error(err)
                return res.status(500).json({errorMessage: 'Internal Server Error'})
            }
        })
    }
}
