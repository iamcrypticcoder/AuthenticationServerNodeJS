import {Document, Model, model, Schema, Error, MongooseError, Types} from 'mongoose'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'

export interface IUser {
    _id: string,
    email: string,
    originalEmail: string,
    username: string,
    passwordHash: string,
    passwordUpdatedAt: Date,
    googleIdentity: string,
    facebookIdentity: string,
    role: string,
    gender: string,
    displayName: string,
    firstName: string,
    middleName: string,
    lastName: string,
    profilePicture: {
        resourceId: string,
        fileName: string,
        s3ObjectKey: string,
        contentType: string,
        contentLength: number
    },
    coverPicture: {
        resourceId: string,
        fileName: string,
        s3ObjectKey: string,
        contentType: string,
        contentLength: number
    },
    countryCode: string,
    currencyCode: string,
    languageCode: string,
    timezoneCode: string,
    address: {
        line1: string,
        line2: string,
        town: string,
        state: string,
        postCode: string,
        country: string
    }
    isEmailConfirmed: boolean,
    isAccountActive: boolean,
    isAccountDeleted: boolean,
    emailConfirmationHash: string,
    emailConfirmationCode: string,
    activationHash: string,
    activationCode: string,
    passwordResetHash: string,
    passwordResetHashExpireDate: Date,
    passwordResetHashLastRequestAt: Date,
    recoveryCode: string,
    recoveryCodeExpireDate: Date,
    lastLoginAt: Date,
}

export interface UserDocument extends IUser {
    setPassword: (password: string) => Promise<void>
    checkPassword: (password: string) => Promise<boolean>
    getUserDisplayName() : string
    verifyPassword(password: string, callback: (err: any, matched: boolean) => void) : void
}

//type UserModel = Model<IUser, {}, UserDocument>

const schema = new Schema<IUser, Model<IUser, {}, UserDocument>, UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    originalEmail: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        default: ''
    },
    passwordHash: {
        type: String,
    },
    passwordUpdatedAt: {
        type: Date,
        default: dayjs()
    },
    googleIdentity: {
        type: String,
        default: ''
    },
    facebookIdentity: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'MODERATOR'],
        default: 'USER'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        default: 'Others'
    },
    displayName: String,
    firstName: String,
    middleName: String,
    lastName: String,
    profilePicture: {
        resourceId: String,
        fileName: String,
        s3ObjectKey: String,
        contentType: String,
        contentLength: Number
    },
    coverPicture: {
        resourceId: String,
        fileName: String,
        s3ObjectKey: String,
        contentType: String,
        contentLength: Number
    },
    countryCode: {
        type: String,
        required: true
    },
    currencyCode: {
        type: String,
        required: true
    },
    languageCode: {
        type: String,
        required: true
    },
    timezoneCode: {
        type: String,
        required: false
    },
    address: {
        line1: String,
        line2: String,
        town: String,
        state: String,
        postCode: String,
        country: String
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false
    },
    isAccountActive: {
        type: Boolean,
        default: false
    },
    isAccountDeleted: {
        type: Boolean,
        default: false
    },
    emailConfirmationHash: {
        type: String,
        default: ''
    },
    emailConfirmationCode: {
        type: String,
        default: ''
    },
    activationHash: {
        type: String,
        default: ''
    },
    activationCode: {
        type: String,
        default: ''
    },
    passwordResetHash: {
        type: String,
        default: ''
    },
    passwordResetHashExpireDate: {
        type: Date,
        default: dayjs()
    },
    passwordResetHashLastRequestAt: {
        type: Date,
        default: dayjs()
    },
    recoveryCode: {
        type: String,
        default: ''
    },
    recoveryCodeExpireDate: {
        type: Date,
        default: dayjs()
    },
    lastLoginAt: {
        type: Date
    }
}, {
    timestamps: true
})

// schema.methods.setPassword = async function (password: string) {
//     const hash = await bcrypt.hash(password, 10);
//     this.hashedPassword = hash;
// };

// schema.method('fullName', function() {
//     console.log('fullName')
    
//     return this.email
// })

schema.methods.verifyPassword = function(password, callback) {
    console.log('Comparing password')
    bcrypt.compare(password, this.passwordHash, (err, matched) => {
        callback(err, matched)
    })
}

schema.statics.getProfile = function (id: string, callback) {
    const projection = '_id originalEmail username firstName middleName lastName googleIdentity facebookIdentity' +
        '-isAccountActive -isAccountDeleted -isEmailConfirmed role lastLoginAt createdAt updatedAt'
    UserModel.findOne({_id: id}, projection).then((docs) => {
        callback(null, docs)
    }).catch(err => {
        callback(err)
    })
}

schema.statics.sampleMethod = function() {
    console.log('Inside sampleMethod')
}

export const UserModel = model<IUser, Model<IUser, {}, UserDocument>>('UserModel', schema, 'users')
