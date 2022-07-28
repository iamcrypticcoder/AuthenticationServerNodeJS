import * as express from "express";


export class PermissionController {
    constructor() {
    }

    getPermissions = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${PermissionController.name}: getPermissions()`)

    }
}
