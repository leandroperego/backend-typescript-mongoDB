import { Request, Response } from 'express';
import { AtualizarAlunoDTO, CriarAlunoDTO, ObterDadosUsuarioDTO, ObterIdUsuarioDTO } from '../DTO/UsuarioDTO';
import AlunosRepository from '../repository/AlunosRepository';
import { validationResult } from 'express-validator';
import CustomRequest from './CustomRequest';

class AlunosController {

    async store(req: Request, res: Response): Promise<void> {

        const errosValidacao = validationResult(req);

        const { nome, email, senha }: CriarAlunoDTO = req.body;

        if (!errosValidacao.isEmpty()) {
            res.status(400).json({
                type: 'error',
                error: errosValidacao.array()
            });
            return;
        }

        if (await emailExist(email)) {
            res.status(400).json({
                type: 'error',
                message: 'Não é possivel cadastrar esse e-mail. Email já está em uso.'
            });
            return;
        }

        const result = await AlunosRepository.create({ nome, email, senha });

        if (!result) {
            res.status(400).json({
                type: 'error',
                message: 'Erro ao criar aluno.'
            });
            return;
        } else {
            res.status(201).json({
                type: 'success',
                message: 'Aluno criado com sucesso.',
                data: result
            });
            return;
        }

    }

    async update(req: CustomRequest, res: Response): Promise<void> {

        const { id: id_rota } = req.params;
        const { id: id_user }: ObterIdUsuarioDTO = req.user as ObterIdUsuarioDTO;

        if (id_user !== Number(id_rota)) {
            res.status(403).json({ 
                type: 'error', 
                mensagem: 'Não autorizado' 
            });
            return;
        }
        const aluno: AtualizarAlunoDTO = req.body;

        const result = await AlunosRepository.findById(Number(id_user));

        if (!result) {
            res.status(404).json({
                type: 'error',
                message: 'Aluno não encontrado.'
            });
            return;
        }

        const resultUpdate = await AlunosRepository.update(Number(id_user), { ...result, ...aluno});

        if (!resultUpdate) {
            res.status(400).json({
                type: 'error',
                message: 'Erro ao atualizar aluno.'
            });
            return;
        } else {
            res.status(200).json({
                type: 'success',
                message: 'Aluno atualizado com sucesso.',
                data: resultUpdate
            });
            return;
        }

    }
}

async function emailExist(email: string) {
    const result: ObterDadosUsuarioDTO = await AlunosRepository.findByEmail(email);
    return result;
}


export default new AlunosController();