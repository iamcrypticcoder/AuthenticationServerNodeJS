import {Document, Model, model, Schema, Error, MongooseError, Types} from 'mongoose'

export interface IUserProfile {
    userId: Types.ObjectId,
    displayName: string,
    firstName: string,
    middleName: string,
    lastName: string,
    gender: string,
    profileImage: string,
    coverImage: string,
    birthDate: string,
    birthCity: string,
    birthCountry: string,
    currentCity: string,
    currentCountry: string,
    aboutMe: string
}

export interface UserProfileDocument extends IUserProfile {
    instanceMethod() : string
    getDisplayName() : string
}

type UserProfileModel = Model<IUserProfile, {}, UserProfileDocument>

const schema = new Schema<IUserProfile, UserProfileModel, UserProfileDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    displayName: String,
    firstName: String,
    middleName: String,
    lastName: String,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        default: 'Others'
    },
    profileImage: {
        mimeType: String,
        fileName: String,
        fileSize: String
    },
    coverImage: {
        mimeType: String,
        fileName: String,
        fileSize: String
    },
    birthDate: Date,
    birthCity: String,
    birthCountry: String,
    currentCity: String,
    currentCountry: String,
    aboutMe: String
})

schema.methods.instanceMethod = function() {
    return 'instance method sample'
}

schema.methods.getDisplayName = function() {
    if (!this.displayName) return `${this.firstName} ${this.middleName} ${this.lastName}`
    return this.displayName
}
export const UserProfile = model<IUserProfile, UserProfileModel>('UserProfile', schema)
