import { Router } from 'express';

import SessaoController from '../controllers/SessaoController';

const router = Router();

router.post('/login', SessaoController.create);
router.post('/logout', SessaoController.delete);

export default router;