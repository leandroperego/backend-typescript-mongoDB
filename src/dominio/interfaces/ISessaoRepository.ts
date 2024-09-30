import { ObterDadosLoginDTO } from "../../infra/DTO/SessaoDTO";

interface ISessaoRepository {
    findByUserId(id: string): Promise<ObterDadosLoginDTO | null>
}

export default ISessaoRepository;