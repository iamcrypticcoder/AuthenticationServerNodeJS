import http from 'http'
import supertest from 'supertest'
import express from 'express'
import { assert } from 'chai'
import { createExpressApp } from '../../../app'
import mongoose from 'mongoose'
import { UserModel, UserDocument } from '../../../models/mongoose/user.model'
import { UserProfile } from "../../../models/mongoose/user_profile"
import {connectMongoDB} from "../../../config/mongodb.config";

let app : express.Express
let server : http.Server

beforeAll((done) => {
    connectMongoDB().then(value => {
        createExpressApp().then(expressApp => {
            app = expressApp
            server = app.listen(4000)
            done()
        })
    }).catch(err => {

    })
})

afterAll((done) => {
    mongoose.disconnect().then(err => {
        console.log('Mongoose disconnected')
        server.close()
        done()
    })
})

beforeEach((done) => {
    UserModel
    .deleteMany({})
    .then(() => {
        return UserProfile.deleteMany({})
    }).then(() => {
        done()
    }).catch(err => {
        done()
    })
})

describe('POST /signup', () => {
    test('Should Signup Successful', (done) => {
        supertest(app)
        .post('/api/v1/signup')
        .set('Accept', 'application/json')
        .send({
            email: 'user@gmail.com',
            password: '12345678',
            confirmPassword: '12345678',
            gender: 'Male'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
            console.log(res.body)
            expect(res.body).toMatchObject({ message: 'Signup successful' })
            done()
        }).catch(err =>  {
            done(err)
        })
    })
})


