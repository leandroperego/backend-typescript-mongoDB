import { ObterCursosDTO } from "../DTO/CursosDTO";
import CursosRepository from "../repository/CursosRepository";
import { Response } from "express";
import CustomRequest from "./CustomRequest";
import { ObterIdUsuarioDTO } from "../DTO/UsuarioDTO";

class CursosController {

    async show(req: CustomRequest, res: Response): Promise<void> {

        if (!req.user) {
            const cursos: ObterCursosDTO[] = await CursosRepository.findAll(false);
            res.status(200).json(cursos);
            return;
        }
        
        const { id } = req.user;

        // filtros de busca TODO

        const cursos: ObterCursosDTO[] = await CursosRepository.findAllWithoutRegistration(id);

        res.status(200).json(cursos);
    }

    async handleMatriculas(req: CustomRequest, res: Response): Promise<void> {
        // const id = req.user?.id as string;
        const { id: id_user }: ObterIdUsuarioDTO = req.user as ObterIdUsuarioDTO;
        const { id } = req.params;

        const id_curso = Number(id);

        const cursoExiste: boolean = await CursosRepository.findCursoById(id_curso);

        if (!cursoExiste) {
            res.status(404).json({
                type: 'error',
                mensagem: 'Curso não encontrado.'
            });
            return;
        }

        let result: number | null = null;

        try {
            result = await CursosRepository.handleMatriculas(id_user, id_curso) as number;
        } catch (error) {
            res.status(500).json({
                type: 'error',
                mensagem: 'Erro na matricula.'
            });
        }

        if (result === 1) {
            res.status(201).json({
                type: 'success',
                mensagem: 'Inscrição realizada com sucesso'
            });
            return;
        } else if (result === 0) {
            res.status(201).json({
                type: 'success',
                mensagem: 'Inscrição cancelada com sucesso'
            });
            return;
        } else if (result === 2) {
            res.status(401).json({
                type: 'error',
                mensagem: 'Inscrição não autorizada!'
            });
            return;
        }
    }
}


export default new CursosController();