import { Router } from 'express';

import SessaoController from '../controllers/SessaoController';
import { body } from 'express-validator';

const router = Router();

router.post('/login', 
    [
        body('email').exists().isEmail().withMessage('Email obrigatório'),
        body('senha').exists().withMessage('Senha obrigatória')
    ]
, SessaoController.create);
router.post('/logout', SessaoController.delete);

export default router;