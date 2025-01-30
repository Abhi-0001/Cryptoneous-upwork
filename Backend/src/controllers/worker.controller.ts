import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import {Request, Response} from 'express';
import { createSubmissionInput } from '../types/types';
import { getNextTask } from '../db/getters';

const prisma = new PrismaClient();

export const TOTAL_SUBMISSION = 100;
export const TOTAL_DECIMAL_POINTS = 1000_1000

export function wrapTask(task){
  return {...task, amount: task.amount * TOTAL_DECIMAL_POINTS}
}

export async function workerSignIn(req: Request, res: Response): Promise<any> {
  try {
    const { address } = req.body;

    const isExist = await prisma.worker.findUnique({
      where: {
        address: address,
      },
    });

    if (!isExist)
      return res.status(404).json({ message: "please signup first." });

    // generate jwt token
    const token = jwt.sign({Id: isExist.Id, address }, process.env.JWT_AUTH_TOKEN_WORKER);
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(308).json({ message: err.message });
  }
}

export async function workerSignUp(req: Request, res: Response): Promise<any> {
  try {
    const { address } = req.body;
    const isExist = await prisma.worker.findUnique({
      where: { address },
    });

    if (isExist)
      return res
        .status(404)
        .json({ message: "User already exist. Please Sign In" });

    const worker = await prisma.worker.create({
      data: {
        address,
        locked_amount: 0,
        pending_amount: 0,
      },
    });
    // generate jwt token
    const token = jwt.sign({Id: worker.Id, address }, process.env.JWT_AUTH_TOKEN_WORKER);
    return res.status(200).json({ token, worker });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export async function nextTask(req:Request, res: Response): Promise<any> {
  try{
    const workerId = req.workerId;
    const task = await getNextTask(workerId);

    if(!task) return res.status(404).json({message: "No more task right now. Please check after sometime"})
    return res.status(201).json({task: wrapTask(task)});
  }catch(e){
      console.log(e.message);
      return res.status(500).json({message: e.message});
  }
}

export async function submitTask(req:Request, res: Response):Promise<any> {
  try{
    const body  = req.body;
    const workerId = req.workerId;
    const parsedBody = createSubmissionInput.safeParse(body);

    if(!parsedBody.success) return res.status(500).json({message: 'Task is no more exist'})
    const taskToSubmit = await prisma.task.findFirst({where: {Id: Number(parsedBody.data.taskId)}})
  
    if(!taskToSubmit) return res.status(400).json({message: `Task does not exist with Id: ${parsedBody.data.taskId}`})
    const amount = (Number(taskToSubmit.amount) / TOTAL_SUBMISSION);

    const isAlreadySubmitted = await prisma.submission.findFirst({where: {
      taskId: Number(parsedBody.data.taskId),
      workerId: Number(parsedBody.data.selection)
    }})

    if(isAlreadySubmitted) return res.status(404).json({message: `you have already submitted this task.`})

    const doesOptionExist = await prisma.option.findFirst({where: {Id: Number(parsedBody.data.selection), taskId: Number(parsedBody.data.taskId)}})

    if(!doesOptionExist) return res.status(400).json({message: "Please select valid option"}) ;
    const submission = await prisma.$transaction(async tx => {
     
      const submission = await tx.submission.create({data: {
        taskId: Number(parsedBody.data.taskId),
        optionId: Number(parsedBody.data.selection),
        workerId,
      }})

      await tx.worker.update({
        where: {Id: workerId},
        data: {
          pending_amount: {
            increment: amount
          }
        }
      })
      return submission;
    })

    if(!submission) return res.status(500).json({message: `Task couldn't be submitted.`})
    
    const nextTask = await getNextTask(workerId);
    return res.status(200).json({message: "Task submitted succesfully." , nextTask});
  }catch(e){
    console.log(e.message)
    return res.status(500).json(`Error: ${e.message}`)
  }
}

export async function getWorkerProfile(req:Request, res: Response):Promise<any> {
  try{
    const workerId = req.workerId;
    const worker = await prisma.worker.findFirst({where: {
      Id: workerId
    }})

    const pendingAmount = worker.pending_amount/TOTAL_DECIMAL_POINTS;
    const lockedAmount = worker.locked_amount/TOTAL_DECIMAL_POINTS;
    const profile = {...worker, pending_amount: pendingAmount, locked_amount:lockedAmount}
    return res.status(200).json({profile})
  }catch(e){
    console.log(e);
    return res.status(500).json({message: e.message})
  }
}

export async function submitPayout(req:Request, res: Response): Promise<any> {
    const userId = req.userId;
    const workerId = req.workerId;

    if(userId){

    }else{
      const worker = await prisma.worker.findFirst({where: {Id: workerId}})

      const txnId = "0x23432";
      const amount = worker.pending_amount;
      const pendingAmount = worker.pending_amount/TOTAL_DECIMAL_POINTS;
      const lockedAmount = worker.locked_amount/TOTAL_DECIMAL_POINTS;

      if(amount <= 0) 
        return res.status(300).json({message: "No funds to withdraw.",
                                  pending_amount: pendingAmount, 
                                  locked_amount: lockedAmount })  

      const payout = await prisma.$transaction(async tx => {
        await tx.worker.update({
          where: {Id: workerId},
          data: {
            pending_amount: {
              decrement: amount
            },
            locked_amount: {
              increment: amount
            }
          }
        })
        const payoutStatus = await tx.payouts.create({
          data: {
            workerId,
            amount,
            signature: txnId,
            status: "Processing"
          }
        })
        return payoutStatus;
      })
      if(!payout) return res.status(500).json({message: "Internal server error. Retry after sometime"})
      // send to amount to solana blockchain.
      return res.status(201).json({message: "Processing your payout", amount: pendingAmount})
    }
}