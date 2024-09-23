import CustomRequest from "../controllers/CustomRequest";
import { Response, NextFunction } from "express";

interface IAuthentication {
    isAuth(req: CustomRequest, res: Response, next: NextFunction): void
}

export default IAuthentication;