import { faker } from '@faker-js/faker'
import {UserModel} from "../models/mongoose/user.model";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import axios from "axios";
import {generateS3FileName, generateS3ObjectKey, uploadToS3} from "../aws/s3.aws";
import {fromBuffer} from "file-type";
import {ProfilePictureModel} from "../models/mongoose/profile-picture.model";

const FAKE_USER_COUNT = 10

export const fakerTest = async () => {
    console.log(faker.image.avatar())
    console.log(faker.image.avatar())
    console.log(faker.image.avatar())
}

const uploadProfilePictureToS3 = async (url: string, ownerUserId: string) : Promise<any> => {
    return axios.get(url, {
        responseType: 'arraybuffer'
    }).then(async response => {
        const buffer = Buffer.from(response.data, 'base64');
        const contentType = (await fromBuffer(buffer))?.mime || ''
        const s3FileName = generateS3FileName(ownerUserId, contentType)
        let s3ObjectKey = generateS3ObjectKey('PROFILE_PICTURE', ownerUserId, s3FileName)
        await uploadToS3(contentType, s3ObjectKey, buffer)
        return new Promise((resolve) => {
            resolve({
                contentType: contentType,
                contentLength: response.data.length,
                s3FileName: s3FileName,
                s3ObjectKey: s3ObjectKey
            })
        })
    }).catch(err => {
        return new Promise((resolve, reject) => {
            reject(err)
        })
    })
}

const generateAdminUser = async () => {
    const email = 'user@gmail.com'

    const user = new UserModel({
        email: 'user@gmail.com',
        originalEmail: 'user@gmail.com',
        username: faker.internet.userName(),
        passwordHash: bcrypt.hashSync('12345678', 12),
        passwordUpdatedAt: dayjs(),
        role: 'ADMIN',
        gender: faker.name.gender(true),
        displayName: `User Display Name`,
        firstName: 'First',
        middleName: 'Middle',
        lastName: 'Last',
        countryCode: 'BD',
        currencyCode: 'BDT',
        languageCode: 'en',
        isEmailConfirmed: true,
        isAccountActive: true,
        isAccountDeleted: false,
        emailConfirmationHash: '',
        emailConfirmationCode: '',
        activationHash: '',
        activationCode: '',
        passwordResetHash: '',
        passwordResetHashExpireDate: dayjs(),
        passwordResetHashLastRequestAt: dayjs(),
        recoveryCode: '',
        recoveryCodeExpireDate: dayjs(),
        lastLoginAt: dayjs(),
    })
    await user.save()

    const res = await uploadProfilePictureToS3(faker.image.avatar(), user._id)
    const pp = new ProfilePictureModel({
        contentType: res.contentType,
        contentLength: res.contentLength,
        fileName: res.s3FileName,
        s3ObjectKey: res.s3ObjectKey,
        ownerUserId: user._id,
        createdAt: dayjs()
    })
    await pp.save()
    user.profilePicture = {
        resourceId: pp._id,
        contentType: res.contentType,
        contentLength: res.contentLength,
        fileName: res.s3FileName,
        s3ObjectKey: res.s3ObjectKey,
    }
    await user.save()
    console.log('FAKE DATE - Added User - ' + email)
}

export const generateFakeUsers = async () => {
    await UserModel.deleteMany()
    await ProfilePictureModel.deleteMany()

    generateAdminUser()

    for (let i = 0; i < FAKE_USER_COUNT; i++) {
        const email = faker.internet.email()
        const passwordHash = bcrypt.hashSync('12345678', 12)
        const firstName = faker.name.firstName()
        const middleName = ''
        const lastName = faker.name.lastName()
        const profilePictureUrl = faker.image.avatar()
        //console.log(faker.name.gender(true))

        const user = new UserModel({
            email: email.normalize(),
            originalEmail: email,
            username: faker.internet.userName(),
            passwordHash: passwordHash,
            passwordUpdatedAt: dayjs(),
            role: 'USER',
            gender: faker.name.gender(true),
            displayName: `${firstName} ${middleName} ${lastName}`,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            countryCode: 'BD',
            currencyCode: 'BDT',
            languageCode: 'en',
            isEmailConfirmed: true,
            isAccountActive: true,
            isAccountDeleted: false,
            emailConfirmationHash: '',
            emailConfirmationCode: '',
            activationHash: '',
            activationCode: '',
            passwordResetHash: '',
            passwordResetHashExpireDate: dayjs(),
            passwordResetHashLastRequestAt: dayjs(),
            recoveryCode: '',
            recoveryCodeExpireDate: dayjs(),
            lastLoginAt: dayjs(),
        })
        await user.save()

        const res = await uploadProfilePictureToS3(profilePictureUrl, user._id)
        const pp = new ProfilePictureModel({
            contentType: res.contentType,
            contentLength: res.contentLength,
            fileName: res.s3FileName,
            s3ObjectKey: res.s3ObjectKey,
            ownerUserId: user._id,
            createdAt: dayjs()
        })
        await pp.save()
        user.profilePicture = {
            resourceId: pp._id,
            contentType: res.contentType,
            contentLength: res.contentLength,
            fileName: res.s3FileName,
            s3ObjectKey: res.s3ObjectKey,
        }
        await user.save()
        console.log('FAKE DATE - Added User - ' + email)
    }


}
