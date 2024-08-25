import Usuario from "./Usuario";

class Sessao {

    usuarioLogado: Usuario;

    constructor(usuarioLogado: Usuario) {
        this.usuarioLogado = usuarioLogado;
    }
}

export default Sessao;