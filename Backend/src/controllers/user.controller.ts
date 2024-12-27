import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createTaskInput } from "../types/types";

const prisma = new PrismaClient();

export async function userSignIn(req: Request, res: Response): Promise<any> {
  try {
    const { address } = req.body;

    const isExist = await prisma.user.findUnique({
      where: {
        address: address,
      },
    });
    if (!isExist)
      return res.status(404).json({ message: "please signup first." });

    // generate jwt token
    const token = jwt.sign({ address }, process.env.JWT_AUTH_TOKEN);
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(308).json({ message: err.message });
  }
}

export async function userSignUp(req: Request, res: Response): Promise<any> {
  try {
    const { address } = req.body;
    const isExist = await prisma.user.findUnique({
      where: { address },
    });

    if (isExist)
      return res
        .status(404)
        .json({ message: "User already exist. Please Sign In" });

    const user = await prisma.user.create({
      data: {
        address,
      },
    });
    // generate jwt token
    const token = jwt.sign({ address }, process.env.JWT_AUTH_TOKEN);
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export async function getPresignedUrl(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const address = req.address;
    const user = await prisma.user.findUnique({ where: { address } });
    if (!user)
      return res.status(400).json({ message: "User doesn't exist. \n" });
    const s3Credentials = {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    };

    const s3Client = new S3Client({
      credentials: s3Credentials,
      region: "ca-central-1",
    });

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: "abhi-techies",
      Key: `cryptupwork/${user.Id}/${Math.random()}/image.png`,
      Expires: 60 * 60, //time to expire in 1h
      Conditions: [["content-length-range", 0, 5 * 1024 * 1024]],
      Fields: {
        "Content-type": "image/png",
      },
    });
    return res
      .status(201)
      .json({ message: "success", presignedURL: url, fields });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error." });
  }
}

export async function createTask(req: Request, res: Response): Promise<any> {
  try {
    const body = req.body;

    const parsedData = createTaskInput.safeParse(body);
    console.log(parsedData);
    if (!parsedData.success)
      throw new Error("Wrong Input, please provide valid request body");

    // verify the passed signature by the user either payment is succefull or not

    // create task after succefull payment
    const { Id } = await prisma.user.findUnique({
      where: { address: req.address },
    });
    const createdTask = await prisma.$transaction(async (tx) => {
      const response = await tx.task.create({
        data: {
          title: parsedData.data.title,
          amount: parsedData.data.amount,
          userId: Id,
          signature: parsedData.data.signature,
        },
      });

      const options = await tx.option.createMany({
        data: body.options.map((op: String) => {
          return { image: op, taskId: response.Id };
        }),
      });
    });
    console.log(createTask);
    return res.status(201).json({ task: createdTask });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function getUserAllTasks(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const address = req.address;
    const user = await prisma.user.findUnique({ where: { address } });

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.Id,
      },
    });

    return res.status(201).json({ tasks });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `Internal server error: ${err.message}` });
  }
}

export async function getUserTask(req: Request, res: Response): Promise<any> {
  try {
    const taskId = req.params.id;
    const address = req.address;
    const { Id: userId } = await prisma.user.findUnique({ where: { address } });

    const task = await prisma.task.findFirst({
      where: {
        Id: Number(taskId),
        userId: userId,
      },
    });

    const taskOptions = await prisma.option.findMany({
      where: {
        taskId: task.Id,
      },
    });

    if (!task)
      return res.status(211).json({ message: "No task exist with this ID." });

    return res.status(201).json({ task: { ...task, options: taskOptions } });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `Internal server error: ${err.message}` });
  }
}
