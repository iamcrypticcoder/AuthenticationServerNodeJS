import mongoose from "mongoose";

export const connectMongoDB = () => {
    const MONGODB_URI = process.env.MONGODB_URI || ''
    console.log(`=========> CONNECTING TO MongoDB... URI = ${MONGODB_URI}`)
    return mongoose.connect(MONGODB_URI, {}).then(value => {
        console.log('=========> CONNECTED TO MONGO DB')
        return new Promise((resolve, reject) => {
            resolve(value)
        })
    }).catch(err => {
        console.error('Error connecting to Mongo DB !')
        return new Promise((resolve, reject) => {
            reject(err)
        })
    })
}
