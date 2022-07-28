import http from 'http'
import supertest from 'supertest'
import express from 'express'
import { assert } from 'chai'
import { createExpressApp } from '../../../app'
import mongoose from 'mongoose'
import { connectMongoDB } from '../../../config/mongodb.config'

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

describe('POST /login', () => {    
    test('should return http = 401 and errorMessage = "User doesn\'t exist"', (done) => {
        supertest(app)
        .post('/api/v1/login')
        .set('Accept', 'application/json')
        .send({
            email: 'user@gmai.com',
            password: '12345678'
        })
        .expect('Content-Type', /json/)
        .expect(422)
        .then(res => {
            console.log(res.body)
            expect(res.body).toMatchObject({ errorMessage: 'User doesn\'t exist !' })
            done()
        }).catch(err =>  {
            done(err)
        })
    })
})


