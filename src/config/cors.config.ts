import express from 'express'
import cors from "cors";

const restApiAllowList = [
    'http://localhost:4200',
    'http://107.109.10.144:4200',
    'http://localhost:3000',
    'http://107.109.10.144:4200',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://my-first-angular-app-fb6b6.firebaseapp.com'
]

export const restApiCORSConfig = () : any => {
    return {
        origin: (origin: any, callback: any) => {
            if (restApiAllowList.indexOf(origin) !== -1 || !origin) {
                console.log('CORS origin matched')
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true
    }
}

export const appCORSConfig = () : any => {
    return {
        origin: '*'
    }
}
