import { Router } from 'express';
import ICursosController from "../../dominio/interfaces/ICursosController";
import IAuthentication from "../../dominio/interfaces/IAuthentication";
import { param } from 'express-validator';
import { inject, injectable } from 'inversify';

@injectable()
class CursosRouter {
        constructor(
                @inject('ICursosController') private cursosController: ICursosController,
                @inject('IAuthentication') private authentication: IAuthentication
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