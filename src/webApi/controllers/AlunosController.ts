import { Request, Response } from 'express';
import { AtualizarAlunoDTO, CriarAlunoDTO, ObterIdUsuarioDTO } from '../../infra/DTO/UsuarioDTO';
import { validationResult } from 'express-validator';
import CustomRequest from '../../dominio/interfaces/CustomRequest';
import IAlunosController from '../../dominio/interfaces/IAlunosController';
import IAlunosServices from '../../dominio/interfaces/IAlunosServices';
import { inject, injectable } from 'inversify';

@injectable()
class AlunosController implements IAlunosController {

    constructor(
        @inject('IAlunosServices') private alunosServices: IAlunosServices
    ) { }

     store = async(req: Request, res: Response): Promise<void> => {

        const errosValidacao = validationResult(req);

        if (!errosValidacao.isEmpty()) {
            res.status(400).json({
                type: 'error',
                error: errosValidacao.array()
            });
            return;
        }

        const { nome, email, senha }: CriarAlunoDTO = req.body;

        const result = await this.alunosServices.create({ nome, email, senha });
        // result retorna a senha que foi criada sem codificacao. Retirar o retorno da senha criada

        res.status(201).json({
            type: 'success',
            message: 'Aluno criado com sucesso.',
            data: result
        });

    }

     update = async(req: CustomRequest, res: Response): Promise<void> => {

        const { id: id_rota } = req.params;
        const { id: id_user }: ObterIdUsuarioDTO = req.user as ObterIdUsuarioDTO;

        if (id_user !== id_rota) {
            res.status(403).json({
                type: 'error',
                mensagem: 'Não autorizado'
            });
            return;
        }
        const aluno: AtualizarAlunoDTO = req.body;

        const resultUpdate = await this.alunosServices.update(id_user, aluno);

        res.status(200).json({
            type: 'success',
            message: 'Aluno atualizado com sucesso.',
            data: resultUpdate
        });
    }
}

export default AlunosController;