import {model, Model, Schema} from "mongoose";
import {IProfilePicture, ProfilePictureDocument} from "./profile-picture.model";


export interface ICoverPicture {
    _id: string,
    ownerUserId: string,
    fileName: string,
    s3ObjectKey: string,
    contentType: string,
    contentLength: number,
    createdAt: Date
}

export interface CoverPictureDocument extends IProfilePicture {
    sampleMethod: () => Promise<void>
}

//type CoverPictureModel = Model<ICoverPicture, {}, CoverPictureDocument>

const schema = new Schema<ICoverPicture, Model<ICoverPicture, {}, CoverPictureDocument>, CoverPictureModel>({
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

export const CoverPictureModel = model<ICoverPicture, Model<ICoverPicture, {}, CoverPictureDocument>>(
    'CoverPictureModel', schema, 'cover_pictures')