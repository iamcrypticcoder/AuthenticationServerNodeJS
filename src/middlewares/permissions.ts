import express from "express";
import {UserModel, UserDocument} from "../models/mongoose/user.model";

const roles = [
    {
        name: 'USER',
        code: 1001,
        permissions: ['read:user:own', 'write:user:own', 'delete:user:own']
    },
    {
        name: 'MODERATOR',
        code: 1002,
        permissions: ['read:user:any', 'write:user:any']
    },
    {
        name: 'ADMIN',
        code: 1003,
        permissions: ['read:user:any', 'write:user:any', 'delete:user:any',
            'read:role:any', 'write:role:any', 'delete:role:any',
            'read:permission:any', 'write:permission:any', 'delete:permission:any']
    },
]

let permissionMap : { [key:string]:any } = {};
permissionMap['USER'] = ['read:user:own', 'write:user:own', 'delete:user:own']
permissionMap['MODERATOR'] = ['read:user:any', 'write:user:any']
permissionMap['ADMIN'] = ['read:user:any', 'write:user:any', 'delete:user:any',
    'read:role:any', 'write:role:any', 'delete:role:any',
    'read:permission:any', 'write:permission:any', 'delete:permission:any']


export const canGetUserList = (user: UserDocument) : boolean => {
    const ret = permissionMap[user.role].includes('read:user:any')
    console.log('canGetUserList = ' + ret)
    return ret
}

export const checkPermission = (user: UserDocument, requiredPermission: string) : boolean => {
    console.log(user.role)
    const ret = permissionMap[user.role].includes(requiredPermission)
    console.log('checkPermission = ' + ret)
    return ret
}

