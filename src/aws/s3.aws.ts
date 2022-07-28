import AWS from 'aws-sdk'
import {uploadTypes} from "../middlewares/types";
import dayjs from "dayjs";
import mimeTypes from 'mime-types'
import {log} from "util";

export const s3Client = new AWS.S3({
    region: process.env.AWS_DEFAULT_REGION,
    signatureVersion: 'v4'
})

export const s3ClientConstant = {
    PRE_SIGNED_URL_EXPIRE_TIME: 60*5       // 5 Minutes
}

export const generateS3FileName = (ownerUserId: string, contentType: string) : string => {
    return `${ownerUserId}_${dayjs().valueOf()}.${mimeTypes.extension(contentType)}`
}

export const generateS3ObjectKey = (uploadType: string, ownerUserId: string, s3FileName: string) : string => {
    switch (uploadType) {
        case uploadTypes.PROFILE_PICTURE: return `profile_pictures/${ownerUserId}/${s3FileName}`
        case uploadTypes.COVER_PICTURE: return `cover_picture/${ownerUserId}/${s3FileName}`
    }
    return ''
}

export const uploadToS3 = async (contentType: string, key: string, data: any) => {
    s3Client.upload({
        Body : data,
        Bucket : process.env.AWS_USER_BUCKET_NAME || '',
        Key: key,
        ContentType : contentType
    }, (err: any, data: any) => {
        if (err) return console.log(err)
        //console.log(data)
    })
}


// export const generateObjectKey = (uploadType: string, fileName: string) : string | null => {
//     switch (uploadType) {
//         case uploadTypes.PROFILE_PICTURE: return `profile_pictures/${fileName}`
//         case uploadTypes.COVER_PICTURE: return `cover_picture/${fileName}`
//     }
//     return null
// }
