import { Request, Response } from 'express';
import { CriarAlunoDTO, ObterDadosUsuarioDTO } from '../DTO/UsuarioDTO';
import AlunosRepository from '../repository/AlunosRepository';
import { validationResult } from 'express-validator';

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

}

async function emailExist(email: string) {
    const result: ObterDadosUsuarioDTO = await AlunosRepository.findByEmail(email);
    return result;
}


export default new AlunosController();