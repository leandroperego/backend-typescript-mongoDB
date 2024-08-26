import { Router } from 'express';
import AlunosController from '../controllers/AlunosController';
import { body } from 'express-validator';

const router = Router();

router.post('/',
    [
        body('nome').exists().withMessage('Nome obrigatório'),
        body('email').exists().isEmail().withMessage('Email obrigatório'),
        body('senha').exists().withMessage('Senha obrigatória')
    ]
    ,AlunosController.store);

export default router;