'use strict'
import jwt from "jsonwebtoken"
import APP from '../config/index.js'
import ErrorHandler from "../utils/errorHandler.js"

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return next(new ErrorHandler('No Token Provided', 401));
    } else {
        await jwt.verify(token, APP.purchasersecrateKey(), (err, user) => {
            //console.log(token,user.role,"=> user =>",[6].includes(user.role))
            if (err || !user || ([6].includes(user.role) !== false)) {
                return next(new ErrorHandler('Unauthorized User', 401));
            }
            req.user = user;
            next()
        });
    }

}
export default authenticate;