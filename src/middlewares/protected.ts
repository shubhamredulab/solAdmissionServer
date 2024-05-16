import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import keycloak from './keycloak';
import ApiError from '../utils/api-error';
import logger from '../utils/winston';
import UserServices from '../services/UserServices';
import User from '../entity/User';
/**
 * Middleware for role-based access control (RBAC) using Keycloak.
 * Checks if user has proper keycloak token
 * If yes decodes the token
 * Get the userId attribute and roles from the token
 * From the userId it fetches the userDetails
 * Requires the user to have at least one of the specified roles.
 * If the user does not have the required roles, returns a 403 Forbidden response.
 * If an error occurs during protection or role checking, passes the error to the next error-handling middleware.
 *
 * @param roles - Array of roles required for access
 */
const Protected = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Protect the route using Keycloak middleware
        await new Promise<void>((resolve, reject) => {
            keycloak.protect()(req, res, (err) => {
                if (err) {
                    reject(err); // Reject the promise with the error
                } else {
                    resolve(); // Resolve the promise if protection succeeds
                }
            });
        });
        // Extract the bearer token from the request headers
        const token = req.headers.authorization?.substring(7);
        if (!token) return next(ApiError.forbidden());
        const userInfo = jwt.decode(token) as JwtPayload;
        const keycloakClientId = process.env.KEYCLOAK_CLIENTID;
        if (!keycloakClientId) throw Error('Environment: KEYCLOAK_CLIENTID is not defined');
        const userId = userInfo.sub;
console.log(userInfo)
        // Fetch UserDetails from our database
        const user = await UserServices.findBykeycloakUserId(userId as string);
        console.log(user)
        // // Adding it in req.user
        if (user) {
            req.user = user as User;
            return next();
        }
        return next(ApiError.forbidden()); // User does not have the required roles
    } catch (error) {
        logger.error(error);
        return next(error); // Pass the error to the next error-handling middleware
    }
};
export default Protected;