/* 
=========================================================
RELATÓRIO DE AUDITORIA (SERIALIZAÇÃO E RE-HIDRATAÇÃO)
Auditores: Luiz

1. Por que o formato JSON (JSON.stringify) não consegue salvar "métodos" (funções) de uma classe, salvando apenas os "atributos" (dados textuais)?
R: Por causa que ele foi feito para transportar informações leves, e para isso transforma tudo em string, com isso ignorando todas as funções relacionados a ele.

2. O que o JavaScript perde na memória quando converte um Objeto para JSON? (Explique o que é o Prototype).
R:  Perde suas funções que eram ligadas a ele, virando depois do .parse um POJO (Object Literal). Prototype é como se fosse um manual de instrução, é nele que fica guardado que é uma classe Voo e as funções que ficam nele.
3. Defina o que é "Re-hidratar um Objeto". Como nós consertamos o código do Júnior aplicando essa técnica?
R: Pegar os dados puros e colocar todas as funções do objeto denovo. Consertamos colocando um "let vooHidratado = new Voo(vooRecuperado.codigo, vooRecuperado.origem);" com esse código conseguimos voltar a funcionar a função 'decolar()'.
=========================================================
*/

class Voo {
  constructor(codigo, origem) {
    this.codigo = codigo;
    this.origem = origem;
    this.status = "No Solo";
  }

  decolar() {
    this.status = "Em Voo";
    console.log(`🛫 O voo ${this.codigo} acabou de decolar de ${this.origem}!`);
  }
}

console.log("=== SALVANDO O VOO NO DISCO ===");
// 1. O Júnior criou um Voo Rico (com métodos) e salvou no disco (Stringify)
let vooOriginal = new Voo("G3-777", "Curitiba");
console.log("Teste antes de salvar:");
vooOriginal.decolar(); // Aqui funciona perfeitamente!

// Salvando...
localStorage.setItem("meuLogbook", JSON.stringify(vooOriginal));
console.log("Voo salvo com sucesso no LocalStorage!");

console.log("\n=== LENDO O VOO NO DIA SEGUINTE ===");
// 2. No dia seguinte, ele leu do disco (Parse)
let dadosDoDisco = localStorage.getItem("meuLogbook");
let vooRecuperado = JSON.parse(dadosDoDisco);
let vooHidratado = new Voo(vooRecuperado.codigo, vooRecuperado.origem);
vooHidratado.status = vooRecuperado.status;
console.log("Dados recuperados do disco:", vooRecuperado);
console.log("Código recuperado:", vooRecuperado.codigo); // Os atributos estão aí...

// 3. O DESASTRE ACONTECE AQUI!
console.log("Tentando decolar o voo recuperado...");
vooHidratado.decolar();

