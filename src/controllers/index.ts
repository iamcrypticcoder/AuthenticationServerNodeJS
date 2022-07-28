import * as express from 'express'

class IndexController {
    constructor() {

    }

    getHomePage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${IndexController.name}: getHomePage`)
        //console.log('isAuthenticated:' + req.oidc.isAuthenticated())
        
        res.render('index', {
            pageTitle: 'NODEJS TEMPLATE PROJECT'
        })
    }
}

export default IndexController