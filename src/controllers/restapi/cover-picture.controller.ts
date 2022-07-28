import * as express from "express";
import {cloudFrontSignedUrl, cloudFrontUrl} from "../../aws/cloudfront.aws";
import {CoverPictureModel} from "../../models/mongoose/cover-picture.model";


export class CoverPictureController {
    constructor() {
    }

    getUserCoverPictures = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${CoverPictureController.name}: getUserCoverPictures()`)

        const ownerUserId = req.params.userId
        const sortBy = req.query.sort_by as string
        const orderBy = req.query.order_by as string
        const after = req.query.after as string
        const before = req.query.before as string
        const limit = req.query.limit as number || 20

        const filter: {[key: string]: any} = {}
        const sort: {[key: string]: any} = {}

        if (sortBy == 'upload_time') {
            sort['createdAt'] = orderBy
            if (after?.length) filter['createdAt'] = {$gt: after}
            if (before?.length) filter['createdAt'] = {$lt: before}
        }

        filter.ownerUserId = ownerUserId
        const projection = '_id fileName s3ObjectKey contentType contentLength createdAt'
        CoverPictureModel.find(filter, projection).limit(limit).sort(sort).then(docs => {
            console.log(docs)
            let resArray = []
            for (let doc of docs) {
                resArray.push({
                    id: doc._id,
                    fileName: doc.fileName,
                    contentType: doc.contentType,
                    contentLength: doc.contentLength,
                    createdAt: doc.createdAt,
                    url: cloudFrontSignedUrl(cloudFrontUrl(doc.s3ObjectKey))
                })
            }
            res.status(200).json(resArray)
        }).catch(err => {
            console.error(err)
            return res.status(500).json({errorMessage: 'Internal Server Error'})
        })
    }
}