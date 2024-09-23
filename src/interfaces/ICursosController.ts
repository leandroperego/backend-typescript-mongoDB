import { Response } from "express";
import CustomRequest from "../controllers/CustomRequest";

interface ICursosController {
    show(req: CustomRequest, res: Response): Promise<void>;
    handleMatriculas(req: CustomRequest, res: Response): Promise<void>;
}

export default ICursosController;