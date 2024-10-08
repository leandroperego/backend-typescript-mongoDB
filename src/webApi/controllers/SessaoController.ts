import { Request, Response } from 'express';
import { CriarSessaoDTO } from '../../infra/DTO/SessaoDTO';
import { validationResult } from 'express-validator';
import ISessaoController from '../../dominio/interfaces/ISessaoController';
import ISessaoServices from '../../dominio/interfaces/ISessaoServices';
import { inject, injectable } from 'inversify';
import CustomRequest from '../../dominio/interfaces/CustomRequest';

@injectable()
class SessaoController implements ISessaoController {

    constructor(
        @inject('ISessaoServices') private sessaoServices: ISessaoServices,
    ) { }

     create = async (req: CustomRequest, res: Response): Promise<void> => {

        const errosValidacao = validationResult(req);

        if (!errosValidacao.isEmpty()) {
            res.status(400).json({
                type: 'error',
                errors: errosValidacao.array()
            });
            return;
        }

        const { email, senha }: CriarSessaoDTO = req.body;

        const token = await this.sessaoServices.create(email, senha);

        res.cookie('x-auth', token);
        res.status(200).json({
            type: 'sucess',
            message: 'Login realizado com sucesso'
        });

    }

    delete = async (req: Request, res: Response): Promise<void> => {
        res.clearCookie('x-auth');
        res.status(200).json({ message: 'Logout success' });
        return;
    }
}

export default SessaoController;