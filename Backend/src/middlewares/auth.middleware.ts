import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function userAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const token = req.headers["authorization"].split(" ").at(1);


  if (!token)
    return res
      .status(404)
      .json({ message: "Unauthorized access. Sign In first." });

    
  const isVerified = <{ address: string, Id: number }>(
    jwt.verify(token, process.env.JWT_AUTH_TOKEN)
  );
  console.log(isVerified);
  if (!isVerified) res.status(404).json({ message: "Unauthorized access." });

  req.userId = isVerified.Id;
  next();
}


export async function workerAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const token = req.headers["authorization"].split(" ").at(1);

  if (!token)
    return res
      .status(404)
      .json({ message: "Unauthorized access. Sign In first." });
  const isVerified = <{ address: string, Id: number }>(
    jwt.verify(token, process.env.JWT_AUTH_TOKEN_WORKER)
  );
  if (!isVerified) res.status(404).json({ message: "Unauthorized access." });

  req.workerId = isVerified.Id;
  next();
}
