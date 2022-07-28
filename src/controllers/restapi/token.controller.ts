import * as express from "express";
import {generateAccessToken, generateRefreshToken} from "../../helpers/jwt_token_generator";
import dayjs from "dayjs";
import ms from "ms";


export default class TokenController {
    constructor() {

    }

    token = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(`${TokenController.name}: token()`)
        const user = (req.user as any)
        generateAccessToken(user, (err, idToken) => {
            if (err) return res.status(500).json({errorMessage: 'Internal Server Error'})
            generateRefreshToken(user, async (err, refreshToken) => {
                if (err) return res.status(500).json({errorMessage: 'Internal Server Error'})
                const cookieOption = {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true,
                    sameSite: true,
                    secure: true
                }
                //res.cookie('idToken', idToken, cookieOption)
                res.cookie('refreshToken', refreshToken, cookieOption)
                //res.cookie('localId', user?._id, cookieOption)
                //res.cookie('email', user?.originalEmail, cookieOption)
                res.status(200).json({
                    idToken: idToken,
                    tokenType: 'Bearer',
                    email: user.originalEmail,
                    expiresIn: ms('1d'),
                    localId: user._id
                })
            })
        })
    }
}
