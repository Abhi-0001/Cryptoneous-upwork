import {Request , Response, NextFunction} from 'express';
import {PrismaClient, Prisma} from '@prisma/client'
import jwt from 'jsonwebtoken';
import {S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';



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
        const {address} =  req.body;
        const isExist = await prisma.user.findUnique({
            where: { address },});
            


        if(isExist) return res.status(404).json({message: 'User already exist. Please Sign In'})
        
        const user = await prisma.user.create({data: {
                address
            }})
        // generate jwt token
        const token = jwt.sign({address}, process.env.JWT_AUTH_TOKEN);
        return res.status(200).json({token, user});
    }catch(err){
            console.log(err);
            return res.status(400).json({message: err.message});
    }
}

export async function getPresignedUrl(req:Request, res: Response): Promise<any> {
    try{
        const address = req.address;
        console.log(address)
        const user = await prisma.user.findUnique({where: {address}});
        console.log(user);
        if(!user) return res.status(400).json({message: "User doesn't exist. \n"});

        const s3Credentials = {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey : process.env.S3_SECRET_KEY
        };

        const s3Client = new S3Client({credentials: s3Credentials, region: 'ca-central-1'})
        
        const s3_config = {
            Bucket: 'abhi-techies',
            Key: `cryptupwork/${address}`,
            Expires: 100 //time to expire in seconds
        }
        const {url, fields} = await createPresignedPost(s3Client, {
            Bucket: 'abhi-techies',
            Key: `cryptupwork/${address}/`,
            Expires: 60*60, //time to expire in 1h
            Conditions: [
                ['content-length-range', 0, 5 * 1024 * 1024]
            ],
            Fields: {
                'Content-type': 'image/png'
            }
        })
        console.log(url, fields)
        return res.status(201).json({message: 'success', presignedURL: url, fields});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: 'internal server error.'})
    }

}