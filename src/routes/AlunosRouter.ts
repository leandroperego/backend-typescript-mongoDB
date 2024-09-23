import { Router } from 'express';
import { body } from 'express-validator';
import IAlunosController from '../interfaces/IAlunosController';
import IAuthentication from '../interfaces/IAuthentication';

class AlunosRouter {

    constructor(
        private alunosController: IAlunosController,
        private authentication: IAuthentication
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