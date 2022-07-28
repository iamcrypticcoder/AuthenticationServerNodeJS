import express from "express";
import {UserDocument} from "../../models/mongoose/user.model";
import { rolePermissionMap } from "../../config/roles.config"
import { uploadTypes } from "../types";

export class V1ApiAuthorization {
    constructor() {
    }

    uploadRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const ownerUserId = req.body.ownerUserId
        const requestedByUserId = (req.user as UserDocument)._id
        const requestedByUserRole = (req.user as UserDocument).role
        if (req.body.uploadType == uploadTypes.PROFILE_PICTURE) {
            if (ownerUserId == requestedByUserId && rolePermissionMap[requestedByUserRole].includes('updateProfilePicture:user:own')) return next()
            if (rolePermissionMap[requestedByUserRole].includes('updateProfilePicture:user:any')) return next()
            return res.status(401).send('Unauthorized')
        }

        if (req.body.uploadType == uploadTypes.COVER_PICTURE) {
            if (ownerUserId == requestedByUserId && rolePermissionMap[requestedByUserRole].includes('updateCoverPicture:user:own')) return next()
            if (rolePermissionMap[requestedByUserRole].includes('updateCoverPicture:user:any')) return next()
            return res.status(401).send('Unauthorized')
        }
    }

    uploadSuccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const ownerUserId = req.body.ownerUserId
        const requestedByUserId = (req.user as UserDocument)._id
        const requestedByUserRole = (req.user as UserDocument).role
        if (req.body.uploadType == uploadTypes.PROFILE_PICTURE) {
            if (ownerUserId == requestedByUserId && rolePermissionMap[requestedByUserRole].includes('updateProfilePicture:user:own')) return next()
            if (rolePermissionMap[requestedByUserRole].includes('updateProfilePicture:user:any')) return next()
            return res.status(401).send('Unauthorized')
        }
        if (req.body.uploadType == uploadTypes.PROFILE_PICTURE) {
            if (ownerUserId == requestedByUserId && rolePermissionMap[requestedByUserRole].includes('updateCoverPicture:user:own')) return next()
            if (rolePermissionMap[requestedByUserRole].includes('updateCoverPicture:user:any')) return next()
            return res.status(401).send('Unauthorized')
        }
    }

    activateAccount = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userId = req.body.userId
        const requestedByUserId = (req.user as UserDocument)._id
        const userRole = (req.user as UserDocument).role
        if (userId == requestedByUserId && rolePermissionMap[userRole].includes('activate:user:own')) return next()
        if (rolePermissionMap[userRole].includes('activate:user:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    deactivateAccount = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userId = req.body.userId
        const requestedByUserId = (req.user as UserDocument)._id
        const userRole = (req.user as UserDocument).role
        if (userId == requestedByUserId && rolePermissionMap[userRole].includes('deactivate:user:own')) return next()
        if (rolePermissionMap[userRole].includes('deactivate:user:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    sendAccountActivationEmail = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userRole = (req.user as UserDocument).role
        if (rolePermissionMap[userRole].includes('email:accountActivation:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    getUsers = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userRole = (req.user as UserDocument).role
        if (rolePermissionMap[userRole].includes('read:user:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    getUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userId = req.params.userId
        const requestedByUserId = (req.user as UserDocument)._id
        const userRole = (req.user as UserDocument).role
        if (userId == requestedByUserId && rolePermissionMap[userRole].includes('read:user:own')) return next()
        if (rolePermissionMap[userRole].includes('read:user:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    putUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userId = req.params.userId
        const requestedByUserId = (req.user as UserDocument)._id
        const userRole = (req.user as UserDocument).role
        if (userId == requestedByUserId && rolePermissionMap[userRole].includes('write:user:own')) return next()
        if (rolePermissionMap[userRole].includes('write:user:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    deleteUser = this.putUser

    getRoles = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userRole = (req.user as UserDocument).role
        if (rolePermissionMap[userRole].includes('read:role:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    getPermissions = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userRole = (req.user as UserDocument).role
        if (rolePermissionMap[userRole].includes('read:permission:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    postDeleteAccount = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userId = req.body.userId
        const requestedByUserId = (req.user as UserDocument)._id
        console.log(userId + ' ' + requestedByUserId)
        const userRole = (req.user as UserDocument).role
        if (userId == requestedByUserId && rolePermissionMap[userRole].includes('delete:user:own')) return next()
        if (rolePermissionMap[userRole].includes('delete:user:any')) return next()
        return res.status(401).send('Unauthorized')
    }

    getUserProfilePictures = this.getUser
    getUserCoverPictures = this.getUser
    getUserLoginSessions = this.getUser
}
