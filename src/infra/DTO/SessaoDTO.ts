import Usuario from "../../entidades/Usuario";

export type ObterDadosLoginDTO = Pick<Usuario, "email" | "senha">;

export type CriarSessaoDTO = Pick<Usuario, 'email' | 'senha'>;