import { Router } from 'express';
import ICursosController from "../interfaces/ICursosController";
import IAuthentication from "../interfaces/IAuthentication";
import { param } from 'express-validator';

class CursosRouter {
        constructor(
                private cursosController: ICursosController,
                private authentication: IAuthentication
        ) { }

        public routes(): Router {
                const router = Router();
                router.get('/', this.cursosController.show);
                router.use([
                        param('id').exists().isNumeric().withMessage('Id obrigatório'),
                        this.authentication.isAuth
                ]);
                router.post('/:id', this.cursosController.handleMatriculas);
                router.delete('/:id', this.cursosController.handleMatriculas);
                return router;
        }
}

export default CursosRouter;