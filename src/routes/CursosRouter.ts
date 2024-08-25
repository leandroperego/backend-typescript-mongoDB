import { Router } from 'express';

import CursosController from '../controllers/CursosController';
import isAuth from '../utils/middlewares/isAuth';

const router = Router();

router.get('/', CursosController.show);
router.post('/:id', isAuth, CursosController.handleMatriculas);

export default router;