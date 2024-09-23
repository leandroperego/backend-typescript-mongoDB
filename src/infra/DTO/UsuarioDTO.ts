import Usuario from "../../entidades/Usuario";

export type CriarAlunoDTO = Omit<Usuario, 'id'>;

export type AtualizarAlunoDTO = Partial<Omit<Usuario, 'senha'>>;

export type ObterDadosUsuarioDTO = Omit<Usuario, 'senha'>;

export type ObterIdUsuarioDTO = Pick<Usuario, 'id'>;