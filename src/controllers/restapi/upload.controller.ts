import * as express from "express";
import {generateS3FileName, generateS3ObjectKey, s3Client, s3ClientConstant} from "../../aws/s3.aws";
import dayjs from "dayjs";
import mimeTypes from 'mime-types'
import {ProfilePictureModel} from "../../models/mongoose/profile-picture.model";
import {uploadTypes} from "../../middlewares/types";
import {cloudFrontUrl} from "../../aws/cloudfront.aws";

export class UploadController {
    constructor() {
    }

    uploadRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${UploadController.name}: signedUploadUrl()`)
        const reqUserId = (req.user as any)._id
        const ownerUserId = req.body.ownerUserId
        const fileName = req.body.filename

        // Name Format: [USER_ID]_[UNIX_TIMESTAMP_MS].[FILE_EXTENSION]
        const s3FileName = generateS3FileName(ownerUserId, req.body.mimeType)
        const s3ObjectKey = generateS3ObjectKey(req.body.uploadType, ownerUserId, s3FileName)
        const signedUrl = s3Client.getSignedUrl('putObject', {
            Bucket: process.env.AWS_USER_BUCKET_NAME,
            Key: s3ObjectKey,
            Expires: s3ClientConstant.PRE_SIGNED_URL_EXPIRE_TIME,
            ContentType: req.body.mimeType
        })

        res.status(200).json({
            fileName: s3FileName,
            contentType: req.body.mimeType,
            signedUrl: signedUrl
        })
    }

    uploadSuccess = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${UploadController.name}: uploadSuccess()`)
        const uploadType = req.body.uploadType
        const ownerUserId = req.body.ownerUserId
        const fileName = req.body.fileName

        if (uploadType == uploadTypes.PROFILE_PICTURE) {
            const s3ObjectKey = generateS3ObjectKey(req.body.uploadType, ownerUserId, fileName)
            console.log(s3ObjectKey)
            s3Client.headObject({
                Bucket: (process.env.AWS_USER_BUCKET_NAME as string),
                Key: s3ObjectKey,
            }, async (err, data) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({errorMessage: 'Internal Server Error'})
                }
                console.log(data)
                ProfilePictureModel.findOne({fileName: s3ObjectKey}).then(doc => {
                    if (doc)
                        return res.status(200).json({
                            resourceId: doc._id,
                            fileName: fileName,
                            contentType: doc.contentType,
                            contentLength: doc.contentLength,
                            uploadedFileUrl: cloudFrontUrl(doc.s3ObjectKey)
                        })
                    const pp = new ProfilePictureModel({
                        ownerUserId: ownerUserId,
                        fileName: fileName,
                        s3ObjectKey: s3ObjectKey,
                        contentType: data.ContentType,
                        contentLength: data.ContentLength,
                        createdAt: data.LastModified
                    })
                    pp.save()
                    return res.status(200).json({
                        resourceId: pp._id,
                        fileName: fileName,
                        contentType: pp.contentType,
                        contentLength: pp.contentLength,
                        uploadedFileUrl: cloudFrontUrl(pp.s3ObjectKey)
                    })
                }).catch(err => {
                    console.log(err)
                    return res.status(500).json({errorMessage: 'Internal Server Error'})
                })
            })
        }

        if (req.body.uploadType == uploadTypes.COVER_PICTURE) {

        }

        //
        // s3Client.getObjectAttributes({
        //     Bucket: (process.env.AWS_USER_BUCKET_NAME as string),
        //     Key: `profile_pictures/${req.body.ownerUserId}/${req.body.fileName}`,
        //     ObjectAttributes: ["ETag", "Checksum", "ObjectParts", "StorageClass", "ObjectSize"],
        // },(err, data) => {
        //     if (err) {
        //         return console.log(err)
        //     }
        //     console.log(data)
        // })
        //
        // s3Client.headObject({
        //     Bucket: (process.env.AWS_USER_BUCKET_NAME as string),
        //     Key: `profile_pictures/${req.body.ownerUserId}/${req.body.fileName}`,
        // }, (err, data) => {
        //     if (err) console.log(err, err.stack); // an error occurred
        //     else     console.log(data);           // successful response
        // })
    }
}
