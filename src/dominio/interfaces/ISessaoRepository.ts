import { ObterDadosLoginDTO } from "../../infra/DTO/SessaoDTO";

interface ISessaoRepository {
    findById(id: number): Promise<ObterDadosLoginDTO | null>
}

export default ISessaoRepository;