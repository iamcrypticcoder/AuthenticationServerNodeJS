import * as express from "express";
import {UserRoleModel} from "../../models/mongoose/user-role.model";


export class RoleController {
    constructor() {
    }

    getRoles = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${RoleController.name}: getRoles()`)
        const projection = '-createdAt -updatedAt -_id -__v'
        UserRoleModel.find({}, projection).then(docs => {
            return res.status(200).json(docs)
        }).catch(err => {
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })
    }
}
