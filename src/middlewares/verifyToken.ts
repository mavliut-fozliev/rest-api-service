import { Request, Response, NextFunction } from "express";
import { decodeAccessToken, getAccessToken } from "../utils/auth";
import { handleServerError } from "../utils/errorHandling";

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const accessToken = getAccessToken(req);

    const result = await decodeAccessToken(accessToken);
    if (!result.valid) return res.status(403).json({ message: result.error });

    req.params.userId = result.id;
    req.params.deviceId = result.deviceId;
    next();
  } catch (error) {
    return handleServerError(error, res);
  }
};
