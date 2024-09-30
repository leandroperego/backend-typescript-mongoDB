import { Request, Response } from "express";
import CustomRequest from "./CustomRequest";

interface ISessaoController {
    create(req: CustomRequest, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}

export default ISessaoController;