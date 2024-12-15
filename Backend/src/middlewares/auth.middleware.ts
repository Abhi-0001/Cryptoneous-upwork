import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


declare global {
    namespace Express{
        interface Request {
            address?: string 
        }
    }
}

export async function authenticate(req:Request, res: Response, next: NextFunction):Promise<any> {
    const token = req.headers['authorization'].split(' ').at(1);
    
    console.log("🚀🚀 token: ", token);
    if(!token) return res.status(404).json({message: 'Unauthorized access. Sign In first.'});
    const isVerified = <{address: string}> jwt.verify(token, process.env.JWT_AUTH_TOKEN);
    if(!isVerified) res.status(404).json({message: 'Unauthorized access.'});
    console.log(isVerified)
    req.address = isVerified.address;
    next();
}