import mongoose, {CallbackError} from 'mongoose'
import { createExpressApp } from './app'
import {UserRoleModel} from "./models/mongoose/user-role.model";
import { UserPermissionModel } from './models/mongoose/user-permission.model';
import {runRoleAndPermissionCronJob, runRoleAndPermissionScript} from "./config/roles.config";
import NodeCache from "node-cache";
import {configAWS} from "./aws/config.aws";
import {connectMongoDB} from "./config/mongodb.config";
import {fakerTest, generateFakeUsers} from "./fakedata/fakedata";

// const createInitialRoleAndPermission = () => {
//     const permissions = [
//         {name: 'Read Own User', code: 'read:user:own'},
//         {name: 'Read Any User', code: 'read:user:any'},
//
//         {name: 'Write Own User', code: 'write:user:own'},
//         {name: 'Write Any User', code: 'write:user:any'},
//
//         {name: 'Delete Own User', code: 'delete:user:own'},
//         {name: 'Delete Any User', code: 'delete:user:any'},
//
//         {name: 'Read Any Role', code: 'read:role:any'},
//         {name: 'Write Any Role', code: 'write:role:any'},
//         {name: 'Delete Any Role', code: 'delete:role:any'},
//
//         {name: 'Read Any Permission', code: 'read:permission:any'},
//         {name: 'Write Any Permission', code: 'write:permission:any'},
//         {name: 'Delete Any Permission', code: 'delete:permission:any'},
//     ]
//
//     Role.deleteMany({}, (error: CallbackError) => {
//         console.log('All roles deleted')
//         initialRolesAndPermissions.forEach(async r => {
//             const role = new Role({
//                 name: r.name,
//                 code: r.code,
//                 permissions: r.permissions
//             })
//             await role.save()
//             console.log('Initial Role and Permission Added')
//         })
//     })
//     Permission.deleteMany({}, (error: CallbackError) => {
//         //console.log('all permission deleted')
//
//     })
// }

const nodeCacheTest = () => {
    const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120})
    myCache.set('key1', 'value1', 10)
    myCache.set('key2', 'value2', 20)
    setInterval(() => {
        console.log(myCache.get('key1'))
        console.log(myCache.get('key2'))
    }, 5*1000)
}

const launchServer = () => {
    // Activate below if you inside a network which requires certificate to communicate
    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    connectMongoDB().then(async () => {
        configAWS()
        await runRoleAndPermissionScript().then(res => {
            console.log('=========> INITIAL ROLE AND PERMISSION SCRIPT FINISHED')
        })
        runRoleAndPermissionCronJob()
        //await generateFakeUsers()

        const port = parseInt(process.env.PORT?.toString() || '3000')
        const app = await createExpressApp()
        app.listen(port)
        console.log(`=========> SERVER LAUNCHED AT PORT : ${port}`)
    })
}

launchServer()
