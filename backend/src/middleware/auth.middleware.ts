import { Request, Response, NextFunction } from 'express';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction){
    // req.isAuthenticated() is a method provided by Passport.js
    if(req.isAuthenticated()){
       return next();
    }
    res.status(401).json({ message: 'You must be logged in to perform this action.' });
}