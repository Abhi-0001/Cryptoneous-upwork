import {Request , Response, NextFunction} from 'express';
import {PrismaClient, Prisma} from '@prisma/client'
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


export async function userSignIn(req: Request, res: Response): Promise<any> {
    try{
        const { address } = req.body;
        
        console.log(address)
        const isExist = await prisma.user.findUnique({where: {
            address: address,
        }, });
        if(!isExist) return res.status(404).json({message: 'please signup first.'})
        
        // generate jwt token
        const token = jwt.sign({address}, process.env.JWT_AUTH_TOKEN);
        
        
        return res.status(200).json({token});
    }catch(err){
        console.log(err);
        return res.status(308).json({message: err.message});
    }
}


export async function userSignUp(req :Request, res: Response):Promise<any> {
    try{
        const {address: userAddress} =  req.body;
        const isExist = await prisma.user.findUnique({
            where: { address: userAddress },});
        console.log("isExist: ", isExist);
        // if(isExist) return res.status(404).json({message: 'User already exist. Please Sign In'})
        
        const user = await prisma.user.create({data: {
                address: userAddress
            }})
        // generate jwt token
        const token = jwt.sign({userAddress}, process.env.JWT_AUTH_TOKEN);
        return res.status(200).json({token, user});
    }catch(err){
            console.log(err);
            return res.status(400).json({message: err.message});
    }
}