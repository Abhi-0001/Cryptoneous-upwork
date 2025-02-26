import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createTaskInput } from "../types/types";
import { TOTAL_DECIMAL_POINTS } from "./worker.controller";

const prisma = new PrismaClient();

export async function userSignIn(req: Request, res: Response): Promise<any> {
  try {
    const { address } = req.body;

    const isExist = await prisma.user.findUnique({
      where: {
        address,
      },
    });
    if (!isExist)
      return res.status(404).json({ message: "please signup first." });

    // generate jwt token
    const token = jwt.sign(
      { Id: isExist.Id, address },
      process.env.JWT_AUTH_TOKEN,
    );
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(308).json({ message: err.message });
  }
}

export async function userSignUp(req: Request, res: Response): Promise<any> {
  try {
    console.log("reached");
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
    console.log(user);
    // generate jwt token
    const token = jwt.sign(
      { Id: user.Id, address },
      process.env.JWT_AUTH_TOKEN,
    );
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
    const userId = req.userId;

    const s3Credentials = {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    };

    const s3Client = new S3Client({
      credentials: s3Credentials,
      region: process.env.S3_REGION,
    });

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.S3_BUCKET,
      Key: `cryptupwork/${userId}/${Math.random()}/image.png`,
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

    if (!parsedData.success)
      throw new Error("Wrong Input, please provide valid request body");

    // verify the passed signature by the user either payment is succefull or not

    // create task after succefull payment

    const createdTask = await prisma.$transaction(async (tx) => {
      const response = await tx.task.create({
        data: {
          title: parsedData.data.title,
          amount: parsedData.data.amount * TOTAL_DECIMAL_POINTS,
          userId: req.userId,
          signature: parsedData.data.signature,
        },
      });

      const options = await tx.option.createMany({
        data: body.options.map((op: String) => {
          return { image: op, taskId: response.Id };
        }),
      });

      const originalAmount = (response.amount / TOTAL_DECIMAL_POINTS).toFixed(
        4,
      );
      return { ...response, amount: originalAmount, ...options };
    });

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
    const userId = req.userId;

    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      select: {
        title: true,
        options: true,
        amount: true,
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
    const userId = req.userId;

    const task = await prisma.task.findUnique({
      where: {
        Id: Number(taskId),
        userId,
      },
      select: {
        title: true,
        options: true,
        amount: true,
      },
    });

    if (!task)
      return res.status(211).json({ message: "No task exist with this ID." });

    return res.status(201).json({ task });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `Internal server error: ${err.message}` });
  }
}
