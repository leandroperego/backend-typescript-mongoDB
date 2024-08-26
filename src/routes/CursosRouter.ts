import { Router } from 'express';

import CursosController from '../controllers/CursosController';
import Auth from '../utils/middlewares/AuthenticationMiddleware';
import { param } from 'express-validator';

const router = Router();

router.get('/', CursosController.show);
router.use([
        param('id').exists().isNumeric().withMessage('Id obrigatório'),
        Auth.isAuth
]);
router.post('/:id', CursosController.handleMatriculas);
router.delete('/:id', CursosController.handleMatriculas);

export default router;