class VooSeguro {
    // 1. Declare os atributos privados ANTES do construtor usando a hashtag!
    #codigo;
    #combustivel;

    constructor(codigoPassado) {
        this.#codigo = codigoPassado;
        this.#combustivel = 100; // O tanque começa em 100%
    }

    // 2. Crie o GETTER (A janelinha que só permite LER a informação)
    get lerCombustivel() {
        return `O tanque do voo ${this.#codigo} está em ${this.#combustivel}%`;
    }

    // 3. Crie o SETTER (A porta segura que permite ALTERAR, mas com regras!)
    set abastecer(quantidade) {
        if (quantidade < 0) {
            console.log("Erro de segurança: Não é possível tirar combustível!");
        } else if (this.#combustivel + quantidade > 100) {
            console.log("Erro: O tanque vai transbordar! Limite é 100%.");
        } else {
            this.#combustivel += quantidade;
            console.log(`Abastecimento concluído. Novo nível: ${this.#combustivel}%`);
        }
    }
}
