import {Document, Model, model, Schema, Error, MongooseError, Types} from 'mongoose'

export interface IRole {
    _id: string,
    name: string,
    code: Number,
    permissions: string[]
}

export interface RoleDocument extends IRole {
    getRoleName() : string
}

type RoleModel = Model<IRole, {}, RoleDocument>

const schema = new Schema<IRole, RoleModel, RoleDocument>({
    name: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
    },
    permissions: {
        type: Array,
        required: true
    }
}, {
    timestamps: true
})

export const UserRoleModel = model<IRole, RoleModel>('UserRoleModel', schema, 'user_roles')
