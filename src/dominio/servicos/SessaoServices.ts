import { ObterDadosUsuarioDTO } from "../../infra/DTO/UsuarioDTO";
import IAlunosServices from "../interfaces/IAlunosServices";
import ISessaoRepository from "../interfaces/ISessaoRepository";
import ISessaoServices from "../interfaces/ISessaoServices";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class SessaoServices implements ISessaoServices {

    constructor(
        private alunosServices: IAlunosServices,
        private sessaoRepository: ISessaoRepository
    ) { }

    async create(email: string, senha: string): Promise<string> {
        let token: string = '';

        try {
            const usuario: ObterDadosUsuarioDTO | null = await this.alunosServices.findByEmail(email);

            if (!usuario) {
                throw new Error("E-mail e/ou senha inválidos");
            }

            const dadosLogin = await this.sessaoRepository.findById(usuario.id);

            if (!dadosLogin) {
                throw new Error("Dados de login não encontrados");
            }

            const senhaValida = await bcrypt.compareSync(senha, dadosLogin.senha);

            if (!senhaValida) {
                throw new Error("E-mail e/ou senha inválidos");
            }

            const secret = process.env.SECRET;

            if (secret) {
                token = jwt.sign({ id: usuario.id }, secret, {
                    expiresIn: '1d'
                });
            }

            return token;
        } catch (error: any) {
            throw new Error("Erro ao criar sessão: " + error.message);
        }
    }

}

export default SessaoServices;