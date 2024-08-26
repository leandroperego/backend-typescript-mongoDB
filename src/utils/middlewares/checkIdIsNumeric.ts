//TODO: TRANSFORMAR EM CLASSE PARA SEGUIR ORIENTACAO A OBJETO
import { Request, Response, NextFunction } from "express";

export default function checkIdIsNumeric(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
        // Se `id` não for numérico, passe para a próxima rota
        return next('route');
    }
    // Se `id` for numérico, continue com a rota atual
    next();
}