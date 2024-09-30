import { ObterCursosDTO } from "../../infra/DTO/CursosDTO";
import { Response } from "express";
import CustomRequest from "../../dominio/interfaces/CustomRequest";
import { ObterIdUsuarioDTO } from "../../infra/DTO/UsuarioDTO";
import ICursosController from "../../dominio/interfaces/ICursosController";
import ICursosServices from "../../dominio/interfaces/ICursosServices";
import { inject, injectable } from "inversify";

@injectable()
class CursosController implements ICursosController {

    constructor(
        @inject('ICursosServices') private cursosServices: ICursosServices
    ) { }

    show = async (req: CustomRequest, res: Response): Promise<void> => {
        const cursos: ObterCursosDTO[] = await this.cursosServices.findAll(req.user);

        res.status(200).json(cursos);
    }

    handleMatriculas = async (req: CustomRequest, res: Response): Promise<void> => {
        const { id: id_user } = req.user as ObterIdUsuarioDTO;
        const { id } = req.params;

        const id_curso = id;


        const result: number = await this.cursosServices.handleMatriculas(id_user, id_curso, req) as number;

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
            // TODO: Ao realizar o cancelar cursos 2 vezes, está enviando essa mensagem abaixo. Corrigir!
            res.status(401).json({
                type: 'error',
                mensagem: 'Inscrição não autorizada!'
            });
            return;
        }
    }
}


export default CursosController;