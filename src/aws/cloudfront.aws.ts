import AWS from "aws-sdk";

const cloudfrontAccessKeyId = process.env.AWS_CLOUDFRONT_ACCESS_KEY_ID || ''
const cloudFrontPrivateKey = process.env.AWS_CLOUDFRONT_PRIVATE_KEY || ''

const cloudFrontSigner = new AWS.CloudFront.Signer(cloudfrontAccessKeyId, cloudFrontPrivateKey)

export const cloudFrontUrl = (s3ObjectKey: string) : string => {
    return `${process.env.AWS_CLOUDFRONT_DOMAIN}/${s3ObjectKey}`
}

export const cloudFrontSignedUrl = (url: string, validityInMS: number = 2*24*60*60*1000) => {
    return cloudFrontSigner.getSignedUrl({
        url: url,
        expires: Math.floor((Date.now() + validityInMS)/1000)
    })
}
