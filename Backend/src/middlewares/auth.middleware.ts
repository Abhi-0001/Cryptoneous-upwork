import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const token = req.headers["authorization"].split(" ").at(1);

  if (!token)
    return res
      .status(404)
      .json({ message: "Unauthorized access. Sign In first." });
  const isVerified = <{ address: string }>(
    jwt.verify(token, process.env.JWT_AUTH_TOKEN)
  );
  if (!isVerified) res.status(404).json({ message: "Unauthorized access." });

  req.address = isVerified.address;
  next();
}
