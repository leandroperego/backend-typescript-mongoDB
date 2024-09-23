import { ObterDadosLoginDTO } from "../DTO/SessaoDTO";

interface ISessaoRepository {
    findById(id: number): Promise<ObterDadosLoginDTO | null>
}

export default ISessaoRepository;