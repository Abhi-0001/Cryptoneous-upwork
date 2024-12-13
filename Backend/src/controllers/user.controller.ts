import {Request , Response, NextFunction} from 'express';
import {PrismaClient, Prisma} from '@prisma/client'
import jwt from 'jsonwebtoken';
import {S3Client } from '@aws-sdk/client-s3'

const AWS_CREDENTIALS = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
}

const prisma = new PrismaClient();


export async function userSignIn(req: Request, res: Response): Promise<any> {
    try{
        const { address } = req.body;
        
        console.log(address)
        const isExist = await prisma.user.findUnique({where: {
            address: address,
        }, });
        if(!isExist) return res.status(404).json({ message: 'please signup first.'})
        
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
            


        if(isExist) return res.status(404).json({message: 'User already exist. Please Sign In'})
        
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

export async function getPresignedUrl(req:Request, res: Response): Promise<any> {
    try{
        const address = req.address;
        const { preFor } = req.body ;
        const user = await prisma.user.findUnique({where: {address}});
        console.log(user);
        if(!user) return res.status(400).json({message: "User doesn't exist. \n"});
        const credentials = {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey : process.env.S3_SECRET_KEY
        };

        const s3 = new S3Client({credentials: {
            accessKeyId:  process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        }})
        
        const s3_config = {
            Bucket: 'abhi-techies',
            Key: `cryptupwork/${address}`,
            Expires: 100 //time to expire in seconds
        }
        const presignedURL = s3.send()
        return res.status(201).json({message: 'success', presignedURL});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: 'internal server error.'})
    }

}