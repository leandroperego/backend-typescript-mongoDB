import { Router } from 'express';
import AlunosController from '../controllers/AlunosController';
import { body, param } from 'express-validator';
import Auth from '../utils/middlewares/AuthenticationMiddleware';

const router = Router();

router.post('/',
    [
        body('nome').exists().withMessage('Nome obrigatório'),
        body('email').exists().isEmail().withMessage('Email obrigatório'),
        body('senha').exists().withMessage('Senha obrigatória')
    ]
    ,AlunosController.store);

router.put('/:id', Auth.isAuth ,AlunosController.update);

export default router;