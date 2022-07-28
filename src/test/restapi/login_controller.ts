import { describe } from "mocha";
import mongoose from "mongoose";
import { UserModel } from "../../models/mongoose/user.model";
import RestApiLoginController from "../../controllers/restapi/login.controller"
import { expect } from "chai";
import sinon from 'sinon'
import { doesNotMatch } from "assert";
import supertest from 'supertest'
import { createExpressApp, connectMongoDB } from '../../app'
import express from 'express'
import http from 'http'

let app : express.Express
let server : http.Server

describe('REST API Login Controller', () => {
    var loginController : RestApiLoginController

    before((done) => {
        connectMongoDB(err => {
            createExpressApp().then(expressApp => {
                app = expressApp
                server = app.listen(4000)
                done()
            })
        })
        // const MONGODB_URI = process.env.MONGODB_TEST_URI?.toString() || ''
        // mongoose.connect(MONGODB_URI, {}, (err) => {
        //     if (err) {
        //         console.error('Error connecting to Mongo DB !')
        //     }
        //     console.log('CONNECTED TO MONGO DB')
        //     loginController = new RestApiLoginController()
        // })
    })

    beforeEach((done) => {
        done()
    })

    afterEach((done) => {
        done()
    })

    it('should return http = 422 and errorMessage = "User doesn\'t exist"', (done) => {
        // const fn = async () => {
        //     const num1 = 10
        //     const num2 = 20
        //     expect(num1 + num2).to.equal(30)
        //     done()
        // }
        // fn()

        supertest(server)
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
                expect(res.body.errorMessage).to.be.equal('User doesn\'t exist !')
                //expect(res.body).to.be.equal({ errorMessage: 'User doesn\'t exist !' })
                done()
            }).catch(err =>  {
                done(err)
            })
    })



    after((done) => {
        mongoose.disconnect(() => {
            server.close((err) => {
                done()
            })
        })
    })
})
