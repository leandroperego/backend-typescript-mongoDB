import { Request, Response } from "express";
import CustomRequest from "../controllers/CustomRequest";

interface IAlunosController {
    store(req: Request, res: Response):Promise<void>;
    update(req: CustomRequest, res: Response):Promise<void>;
}

export default IAlunosController;