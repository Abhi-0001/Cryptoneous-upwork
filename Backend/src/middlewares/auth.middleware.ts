import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


declare global {
    namespace Express{
        interface Request {
            address?: string 
        }
    }
}

export async function authenticate(req:Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'].split(' ')[1];
    
    console.log("🚀🚀 token: ", token);
    const isVerified = <{address: string}> jwt.verify(token, process.env.JWT_AUTH_TOKEN);
    if(!isVerified) res.status(404).json({message: 'Unauthorized access.'});

    req.address = isVerified.address;
    next();
}