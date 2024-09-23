import { Request, Response, Express } from 'express';
import SessaoRouter from './SessaoRouter';
import AlunosRouter from './AlunosRouter';
import CursosRouter from './CursosRouter';
import { ObterIdUsuarioDTO } from '../DTO/UsuarioDTO';
import CustomRequest from '../controllers/CustomRequest';
import CursosRepository from '../repository/CursosRepository';
import { validationResult } from 'express-validator';
import CursosController from '../controllers/CursosController';
import AuthenticationMiddleware from '../utils/middlewares/AuthenticationMiddleware';
import AlunosController from '../controllers/AlunosController';
import SessaoController from '../controllers/SessaoController';
import AlunosRepository from '../repository/AlunosRepository';
import database from '../config/database';
import SessaoRepository from '../repository/SessaoRepository';

const alunosRepository = new AlunosRepository(database);
const cursosRepository = new CursosRepository(database);
const sessaoRepository = new SessaoRepository(database);

const auth = new AuthenticationMiddleware();
const cursosController = new CursosController(cursosRepository);
const alunosController = new AlunosController(alunosRepository);
const sessaoController = new SessaoController(sessaoRepository,alunosRepository);
const cursosRouters = new CursosRouter(cursosController, auth);
const alunosRouters = new AlunosRouter(alunosController,auth);
const sessaoRouters = new SessaoRouter(sessaoController);

const routes = (app: Express) => {
    app.use('/', sessaoRouters.routes());
    app.use('/usuarios', alunosRouters.routes());
    app.use('/cursos', cursosRouters.routes());
    app.get('/:id', auth.isAuth, async (req: CustomRequest, res: Response) => {

        const errosValidacao = validationResult(req);

        if (!errosValidacao.isEmpty()) {
            res.status(400).json({
                type: 'error',
                errors: errosValidacao.array()
            });
            return;
        }

        const { id: id_user }: ObterIdUsuarioDTO = req.user as ObterIdUsuarioDTO;
        const { id: id_rota } = req.params;

        if (id_user !== Number(id_rota)) {
            res.status(403).json({ 
                type: 'error', 
                mensagem: 'Não autorizado' 
            });
            return;
        }
       const cursos = await cursosRepository.findAllRegistration(id_user);

        res.status(200).json(cursos);
    });
    app.get('/:any', (req: Request, res: Response) => res.status(404).send('404 - Not Found'));
}

export default routes;