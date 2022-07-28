import express from "express"
import passport from 'passport'
import AWS from 'aws-sdk'
import cors from 'cors'

import RestApiLoginController from "../../controllers/restapi/login.controller"
import SignUpController from "../../controllers/restapi/signup.controller"

import {restApiCORSConfig} from "../../config/cors.config"
import PasswordController from "../../controllers/restapi/password.controller"
import AccountController from "../../controllers/restapi/account.controller"
import TokenController from "../../controllers/restapi/token.controller";
import {RoleController} from "../../controllers/restapi/role.controller";
import {PermissionController} from "../../controllers/restapi/permission.controller";
import {UserController} from "../../controllers/restapi/user.controller";
import {UploadController} from "../../controllers/restapi/upload.controller";
import {ProfilePictureController} from "../../controllers/restapi/profile-picture.controller";
import {V1ApiAuthorization} from "../../middlewares/restapi/v1-api-authorization";
import {V1ApiValidation} from "../../middlewares/restapi/v1-api-validation";
import {AuthApiValidation} from "../../middlewares/restapi/auth-api-validation";
import {LoginSessionController} from "../../controllers/restapi/login-session.controller";
import {CoverPictureController} from "../../controllers/restapi/cover-picture.controller";

const router = express.Router()
// Controllers
const loginController = new RestApiLoginController()
const signupController = new SignUpController()
const passwordController = new PasswordController()
const accountController = new AccountController()
const tokenController = new TokenController()
const roleController = new RoleController()
const permissionController = new PermissionController()
const userController = new UserController()
const uploadController = new UploadController()
const profilePictureController = new ProfilePictureController()
const coverPictureController = new CoverPictureController()
const loginSessionController = new LoginSessionController()

// Middlewares
const v1ApiAuthorization = new V1ApiAuthorization()
const authApiValidation = new AuthApiValidation()
const v1ApiValidation = new V1ApiValidation()

// API No 1
router.post('/signup',
    cors(restApiCORSConfig()),
    authApiValidation.validatePostSignup,
    signupController.postSignUp)

// API No 2
router.post('/login',
    authApiValidation.validatePostLogin,
    loginController.postLogin)

// API No 3
router.post('/login/google',
    authApiValidation.validatePostLoginGoogle,
    (req:express.Request, res:express.Response, next:express.NextFunction) => {
        passport.authenticate('restapi-google-login', {
            scope: [ 'email', 'profile' ],
            state: JSON.stringify({appReturnUrl: req.body.appReturnUrl})
        })(req, res, next)
    })

// API No 4
router.post('/login/facebook',
    authApiValidation.validatePostLoginFacebook,
    (req:express.Request, res:express.Response, next: express.NextFunction) => {
        passport.authenticate('restapi-facebook-login', {
            scope: ['email', 'public_profile', 'user_gender'],
            state: JSON.stringify({appReturnUrl: req.body.appReturnUrl})
        })(req, res, next)
    })

// API No 5
router.get('/auth/google/callback', 
    passport.authenticate( 'restapi-google-login', {}), 
    loginController.getGoogleLoginCallback)

// API No 6
router.get('/auth/facebook/callback', 
    passport.authenticate( 'restapi-facebook-login', {}), 
    loginController.getFacebookLoginCallback)

// API No 7
router.post('/token',
    passport.authenticate('rest-api-jwt-refresh-token', {session: false}),
    tokenController.token)

// API No 8
router.get('/confirmEmail',
    authApiValidation.validateConfirmEmail,
    accountController.confirmEmail)

// API No 9
router.post('/sendResetPasswordEmail',
    authApiValidation.validatePostSendResetPasswordEmail,
    passwordController.sendResetPasswordEmail)

// API No 10
router.post('/resetPassword',
    authApiValidation.validatePostResetPassword,
    passwordController.resetPassword)

// API No 11
router.post('/changePassword',
    passport.authenticate('rest-api-jwt', {session: false}),
    authApiValidation.validatePostChangePassword,
    passwordController.changePassword)

// API No 12
router.post('/activateAccount',
    passport.authenticate('rest-api-jwt', {session: false}),
    authApiValidation.validatePostActivateAccount,
    v1ApiAuthorization.activateAccount,
    accountController.activateAccount)

// API No 13
router.post('/deactivateAccount',
    passport.authenticate('rest-api-jwt', {session: false}),
    authApiValidation.validatePostDeactivateAccount,
    v1ApiAuthorization.deactivateAccount,
    accountController.deactivateAccount)

// API No 7
// router.get('/user',
//     passport.authenticate('rest-api-jwt', {session: false}),
//     async (req, res, next) => {
//         const userId = (req.user as any)._id.toString()
//         try {
//             const user = await User.findById(userId)
//             const userProfile = await UserProfile.findOne({'userId': userId})
//             res.status(200).json({
//                 id: userId,
//                 email: user?.originalEmail,
//                 firstFirst: userProfile?.firstName,
//                 middleName: userProfile?.middleName,
//                 lastName: userProfile?.lastName
//             })
//         } catch(err) {
//             console.log(err)
//         }
//     })


// API No 14
router.post('/deleteAccount',
    passport.authenticate('rest-api-jwt', {session: false}),
    authApiValidation.deleteAccount,
    v1ApiAuthorization.postDeleteAccount,
    accountController.deleteAccount)

// API No 15
router.get('/profile',
    passport.authenticate('rest-api-jwt', {session: false}),
    accountController.profile)

// API No 16
router.get('/roles',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.getRoles,
    roleController.getRoles)

// API No 17
router.get('/permissions',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.getPermissions,
    permissionController.getPermissions)

// API No 18
router.get('/user/:userId',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.getUser,
    userController.getUser)

// API No 19
router.put('/user/:userId',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.putUser,
    v1ApiValidation.putUser,
    userController.putUser)

// API No 20
router.delete('/user/:userId',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.deleteUser,
    v1ApiValidation.deleteUser,
    userController.deleteUser)

// API No 21
router.get('/user/:userId/profilePictures',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.getUserProfilePictures,
    v1ApiValidation.getUserProfilePictures,
    profilePictureController.getUserProfilePictures)

// API No 22
router.get('/user/:userId/coverPictures',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.getUserCoverPictures,
    v1ApiValidation.getUserCoverPictures,
    coverPictureController.getUserCoverPictures)

// API No 23
router.get('/user/:userId/loginSessions',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.getUserLoginSessions,
    v1ApiValidation.getUserProfilePictures,
    loginSessionController.getUserLoginSessions)

// API No 24
router.get('/users',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.getUsers,
    v1ApiValidation.getUsers,
    userController.getUsers)

// API No 25
router.post('/uploadRequest',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.uploadRequest,
    v1ApiValidation.uploadRequest,
    uploadController.uploadRequest)

// API No 26
router.post('/uploadSuccess',
    passport.authenticate('rest-api-jwt', {session: false}),
    v1ApiAuthorization.uploadSuccess,
    v1ApiValidation.uploadSuccess,
    uploadController.uploadSuccess)

export default router
