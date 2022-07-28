import {Document, Model, model, Schema, Error, MongooseError, Types} from 'mongoose'

export interface IPermission {
    _id: string,
    name: string,
    code: string,
    desc: string
}

export interface PermissionDocument extends IPermission {
    getPermissionName(): string
}

type PermissionModel = Model<IPermission, {}, PermissionDocument>

const schema = new Schema<IPermission, PermissionModel, PermissionDocument>({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const UserPermissionModel = model<IPermission, PermissionModel>('UserPermissionModel', schema, 'user_permissions')

/**
 Example permissions:
 verb - read, write, delete, create, export
 subject - user, post, products
 users - own, any

 write:user:any
 write:user:own
 create:post:own
 */
