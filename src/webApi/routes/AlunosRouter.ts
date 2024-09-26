import { Router } from 'express';
import { body } from 'express-validator';
import IAlunosController from '../../dominio/interfaces/IAlunosController';
import IAuthentication from '../../dominio/interfaces/IAuthentication';
import { inject, injectable } from 'inversify';

@injectable()
class AlunosRouter {

    constructor(
        @inject('IAlunosController') private alunosController: IAlunosController,
        @inject('IAuthentication') private authentication: IAuthentication
    ) {}

    routes(): Router {
        const router = Router();

        router.post('/',
            [
                body('nome').exists().withMessage('Nome obrigatório'),
                body('email').exists().isEmail().withMessage('Email obrigatório'),
                body('senha').exists().withMessage('Senha obrigatória')
            ]
            ,this.alunosController.store);

        router.put('/:id', this.authentication.isAuth ,this.alunosController.update);

        return router;
    }
}

export default AlunosRouter;