
interface ISessaoServices {
    create(email: string, senha: string): Promise<string>;
}

export default ISessaoServices;