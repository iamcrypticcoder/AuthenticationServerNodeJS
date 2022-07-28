import AWS from "aws-sdk";

export const configAWS = () => {
    AWS.config.update({region: 'ap-southeast-1'})
    AWS.config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID?.toString() || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.toString() || ''
    }
    console.log('=========> AWS CONFIG DONE')
}
