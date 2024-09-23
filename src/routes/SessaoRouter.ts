import { Router } from 'express';
import ISessaoController from '../interfaces/ISessaoController';
import { body } from 'express-validator';

class SessaoRouter {

    constructor(
        private sessaoController: ISessaoController
    ) { }

    public routes(): Router {

        const router = Router();

        router.post('/login',
            [
                body('email').exists().isEmail().withMessage('Email obrigatório'),
                body('senha').exists().withMessage('Senha obrigatória')
            ], this.sessaoController.create);

        router.post('/logout', this.sessaoController.delete);

        return router;
    }
}

export default SessaoRouter;