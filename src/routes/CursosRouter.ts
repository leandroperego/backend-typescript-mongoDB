import { Router } from 'express';

import CursosController from '../controllers/CursosController';
import Auth from '../utils/middlewares/AuthenticationMiddleware';

const router = Router();

router.get('/', CursosController.show);
router.post('/:id', Auth.isAuth, CursosController.handleMatriculas);
router.delete('/:id', Auth.isAuth, CursosController.handleMatriculas);

export default router;