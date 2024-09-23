import { Request, Response } from "express";

interface ISessaoController {
    create(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}

export default ISessaoController;