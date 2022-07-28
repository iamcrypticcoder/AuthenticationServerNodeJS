import * as express from "express";
import {LoginSessionModel} from "../../models/mongoose/login-session.model";
import _ from "lodash";


export class LoginSessionController {
    constructor() {
    }

    getUserLoginSessions = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${LoginSessionController.name}: getUserLoginSessions()`)

        const userId = req.params.userId
        const after = req.query.after as string
        const before = req.query.before as string
        const limit = req.query.limit as number || 20

        const filter: {[key: string]: any} = {}
        const sort: {[key: string]: any} = {}
        sort['createdAt'] = 'desc'
        if (after?.length) filter['createdAt'] = {$gt: after}
        if (before?.length) filter['createdAt'] = {$lt: before}

        filter.userId = userId
        LoginSessionModel.find(filter, {}).limit(limit).then(docs => {
            const response = docs.map(doc => {
                const session = doc.toJSON()
                _.unset(session, '_id')
                _.unset(session, 'createdAt')
                _.unset(session, 'updatedAt')
                _.unset(session, '__v')
                _.set(session, 'id', doc._id)
                return session
            })
            res.status(200).json(response)
        }).catch(err => {
            console.error(err)
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })

    }
}
