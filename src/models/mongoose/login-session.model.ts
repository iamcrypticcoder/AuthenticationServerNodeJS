import {model, Model, Schema} from "mongoose";
import dayjs from "dayjs";


export interface ILoginSession {
    _id: string
    userId: string
    countryName: string
    countryCode: string
    device: string
    ip: {
        address: string
        number: number
        version: number
    },
    isp: string,
    loginTime: Date
    loginResult: boolean
    createdAt: Date
}

export interface LoginSessionDocument extends ILoginSession {
    sampleMethod: () => Promise<void>
}

const schema = new Schema<ILoginSession, Model<ILoginSession, {}, LoginSessionDocument>, LoginSessionDocument>({
    userId: {
        type: String,
        required: true
    },
    countryName: {
        type: String
    },
    countryCode: {
        type: String
    },
    device: {
        type: String
    },
    ip: {
        address: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true
        },
        version: {
            type: Number,
            required: true,
            enum: [4, 6]
        }
    },
    isp: String,
    loginTime: {
        type: Date,
        required: true,
        default: dayjs()
    },
    loginResult: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
})

schema.index({createdAt: 1},{expireAfterSeconds: 3600*24*2});

export const LoginSessionModel = model<ILoginSession, Model<ILoginSession, {}, LoginSessionDocument>>(
    'LoginSessionModel', schema, 'login_sessions'
)