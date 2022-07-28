import { Router } from "express"
import AuthController from "../controllers/auth"
import {  body, check } from 'express-validator'
import passport from 'passport'
import passportLocal from 'passport-local'

// Import Middlewares
import { isAuthenticated, isUnauthenticated } from "../middlewares/is_authenticated"
import { 
    validatePostLogin, 
    validatePostSignup, 
    validatePostResetPassword, 
    validateGetResetPasswordConfirm } from '../middlewares/auth_validation'

const router = Router()
const authController = new AuthController()

router.get('/login', isUnauthenticated, authController.getLogin)

router.post('/login', validatePostLogin, passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureMessage: true
}))

router.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }))

router.get('/auth/google/callback', passport.authenticate( 'google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}))

router.get('/auth/facebook', passport.authenticate('facebook', { 
    scope: ['email', 'public_profile', 'user_gender'] 
}))

router.get('/auth/facebook/callback', passport.authenticate( 'facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}))

router.get('/signup', isUnauthenticated, authController.getSignUp)

router.post('/signup', isUnauthenticated, validatePostSignup, 
    authController.postSignup)

router.post('/logout', authController.postLogout)

router.get('/reset_password', isUnauthenticated, authController.getResetPassword)

router.post('/reset_password', 
    validatePostResetPassword,
    authController.postResetPassword)

router.get('/reset_password_confirm', validateGetResetPasswordConfirm, authController.getResetPasswordConfirm)

router.post('/reset_password_confirm', authController.postResetPasswordConfirm)

//router.post('/login', validatePostLogin, authController.postLogin)

// router.post('/login',
//     (req, res, next) => {
//         console.log('Request received')
//         passport.authenticate('local', function (err, user) {
//             console.log('Authenticated')
//             req.logIn(user, function (err) { // <-- Log user in
//                return res.redirect('/'); 
//             });
//         })
//     },

//     // passport.authenticate('local', function (err, user) {
//     //     req.logIn(user, function (err) { // <-- Log user in
//     //        return res.redirect('/'); 
//     //     });
//     // }),

//     (req, res, next) => {
//         console.log('Authentication passed')
//         res.redirect('/')
//     })

export default router