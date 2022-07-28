import express from 'express'
import csurf from 'csurf'

const csrfProtection = csurf({ cookie: true })

export const csrfProtected = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    csrfProtection(req, res, next)
}