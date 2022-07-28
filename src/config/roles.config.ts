import {UserRoleModel} from "../models/mongoose/user-role.model";
import {UserPermissionModel} from "../models/mongoose/user-permission.model";

const READ_USER_OWN = { code: 'read:user:own', desc: 'Read personal user data'}
const WRITE_USER_OWN = { code: 'write:user:own', desc: 'Update personal user data'}
const DELETE_USER_OWN = { code: 'delete:user:own', desc: 'Delete own account'}

const READ_USER_ANY = { code: 'read:user:any', desc: 'Read any user data'}
const WRITE_USER_ANY = { code: 'write:user:any', desc: 'Update any user data'}
const DELETE_USER_ANY = { code: 'delete:user:any', desc: 'Delete any account'}

const ACTIVATE_USER_OWN = { code: 'activate:user:own', desc: 'Activate own account'}
const DEACTIVATE_USER_OWN = { code: 'deactivate:user:own', desc: 'Deactivate own account'}

const ACTIVATE_USER_ANY = { code: 'activate:user:any', desc: 'Activate any account'}
const DEACTIVATE_USER_ANY = { code: 'deactivate:user:any', desc: 'Deactivate any account'}

const READ_ROLE_OWN = { code: 'read:role:own', desc: 'Read own account role'}
const READ_ROLE_ANY = { code: 'read:role:any', desc: 'Read any account role'}
const WRITE_ROLE_ANY = { code: 'write:role:any', desc: 'Update role of any user'}
const CREATE_ROLE_ANY = { code: 'create:role:any', desc: 'Create new role' }

const initialPermissionList = [
    READ_USER_OWN, WRITE_USER_OWN, DELETE_USER_OWN,
    READ_USER_ANY, WRITE_USER_ANY, DELETE_USER_ANY,
    ACTIVATE_USER_OWN, DEACTIVATE_USER_OWN,
    ACTIVATE_USER_ANY, DEACTIVATE_USER_ANY,
    READ_ROLE_OWN, READ_ROLE_ANY
]

const initialRoleList = [
    {
        name: 'USER',
        code: 1001,
        permissions: [
            READ_USER_OWN, WRITE_USER_OWN, DELETE_USER_OWN,
            ACTIVATE_USER_OWN, DEACTIVATE_USER_OWN]
    },
    {
        name: 'MODERATOR',
        code: 1002,
        permissions: [
            READ_USER_ANY, WRITE_USER_ANY, DELETE_USER_ANY,
            ACTIVATE_USER_OWN, DEACTIVATE_USER_OWN]
    },
    {
        name: 'ADMIN',
        code: 1003,
        permissions: [
            READ_USER_OWN, WRITE_USER_OWN, DELETE_USER_OWN,
            READ_USER_ANY, WRITE_USER_ANY, DELETE_USER_ANY,
            ACTIVATE_USER_OWN, DEACTIVATE_USER_OWN,
            READ_ROLE_ANY, WRITE_ROLE_ANY]
    },
]

export const rolePermissionMap : { [key:string]:any } = {
    // 'USER': initialRolesAndPermissions[0].permissions,
    // 'MODERATOR': initialRolesAndPermissions[1].permissions,
    // 'ADMIN': initialRolesAndPermissions[2].permissions
}

export const runRoleAndPermissionScript = () : Promise<any> => {
    return UserRoleModel.find({}).then( async docs => {
        if (docs.length >= initialRoleList.length) {
            docs.forEach(doc => rolePermissionMap[doc.name] = doc.permissions)
            console.log(rolePermissionMap)
            return new Promise(resolve => {resolve(true)})
        }
        // Insert permissions into user-permission collection
        for (let p of initialPermissionList) {
            const doc = new UserPermissionModel({
                name: 'dummy',
                code: p.code,
                desc: p.desc
            })
            await doc.save()
        }

        // Insert role into role collection
        for (let r of initialRoleList) {
            const doc = new UserRoleModel({
                name: r.name,
                code: r.code,
                permissions: r.permissions.map(p => p.code)
            })
            rolePermissionMap[r.name] = r.permissions.map(p => p.code)
            await doc.save()
        }
        return new Promise<any>((resolve) => {resolve(true)})
    }).catch(err => {
        return new Promise<any>((resolve, reject) => {reject(err)})
    })
}

// As per this method any role/permission change in DB will take 10 minutes to action
export const runRoleAndPermissionCronJob = () => {
    setInterval(() => {
        console.log('runRoleAndPermissionCronJob() - STARTED')
        const projection = '-createdAt -updatedAt -_id -__v'
        UserRoleModel.find({}, projection).then(docs => {
            docs.forEach(doc => rolePermissionMap[doc.name] = doc.permissions)
        }).catch(err => {
            console.log('runRoleAndPermissionCronJob() - Internal Server Error')
        })
        console.log('runRoleAndPermissionCronJob() - ENDED')
    }, 10*60*1000)
}
