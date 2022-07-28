import {Document, Model, model, Schema, Error, MongooseError, Types} from 'mongoose'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import {ObjectId} from "mongodb";


export interface IProfilePicture {
    _id: string,
    ownerUserId: string,
    fileName: string,
    s3ObjectKey: string,
    contentType: string,
    contentLength: number,
    createdAt: Date
}

export interface ProfilePictureDocument extends IProfilePicture {
    sampleMethod: () => Promise<void>
}

//type ProfilePictureModel = Model<IProfilePicture, {}, ProfilePictureDocument>

const schema = new Schema<IProfilePicture, Model<IProfilePicture, {}, ProfilePictureDocument>, ProfilePictureDocument>({
    ownerUserId: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        unique: true,
        required: true
    },
    s3ObjectKey: {
        type: String,
        unique: true,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    contentLength: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

export const ProfilePictureModel = model<IProfilePicture, Model<IProfilePicture, {}, ProfilePictureDocument>>(
    'ProfilePictureModel', schema, 'profile_pictures')
