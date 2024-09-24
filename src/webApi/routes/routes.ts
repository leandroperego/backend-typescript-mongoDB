import { Request, Response, Express } from 'express';
import SessaoRouter from './SessaoRouter';
import AlunosRouter from './AlunosRouter';
import CursosRouter from './CursosRouter';
import { ObterIdUsuarioDTO } from '../../infra/DTO/UsuarioDTO';
import CustomRequest from '../../dominio/interfaces/CustomRequest';
import CursosRepository from '../../infra/repository/CursosRepository';
import { validationResult } from 'express-validator';
import CursosController from '../controllers/CursosController';
import AuthenticationMiddleware from '../utils/middlewares/AuthenticationMiddleware';
import AlunosController from '../controllers/AlunosController';
import SessaoController from '../controllers/SessaoController';
import AlunosRepository from '../../infra/repository/AlunosRepository';
import database from '../../infra/config/database';
import SessaoRepository from '../../infra/repository/SessaoRepository';
import AlunosServices from '../../dominio/servicos/AlunosServices';
import CursosServices from '../../dominio/servicos/CursosServices';
import SessaoServices from '../../dominio/servicos/SessaoServices';

// TODO: Mudar o routes para classe
// TODO: Usar Inversify

const alunosRepository = new AlunosRepository(database);
const cursosRepository = new CursosRepository(database);
const sessaoRepository = new SessaoRepository(database);

const alunosServices = new AlunosServices(alunosRepository);
const cursosServices = new CursosServices(cursosRepository);
const sessaoServices = new SessaoServices(alunosServices, sessaoRepository);

const auth = new AuthenticationMiddleware();
const cursosController = new CursosController(cursosServices);
const alunosController = new AlunosController(alunosRepository);
const sessaoController = new SessaoController(sessaoServices);
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