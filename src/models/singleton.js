/* 
=========================================================
RELATÓRIO DE AUDITORIA (DESIGN PATTERN - SINGLETON)
Auditores: Luiz Gustavo

1. O que é um "Design Pattern" (Padrão de Projeto) e, especificamente, o que o padrão Singleton garante para a nossa aplicação?
R: Um Design Pattern é uma solução testada, padronizada e reutilizável para resolver problemas comuns de arquitetura de software. Especificamente, o padrão Singleton garante que uma classe tenha apenas UMA única instância (um único objeto) rodando na memória durante toda a execução da aplicação, centralizando o controle e evitando dessincronização de dados.

2. O que a palavra-chave 'static' (estático) faz em uma classe JavaScript? Qual a diferença de uma variável estática para uma variável comum (this)?
R: A palavra-chave 'static' prende uma propriedade diretamente à Classe (ao "molde/fábrica"), e não ao objeto gerado. Enquanto uma variável comum (this) existe individualmente dentro de cada novo objeto criado, a variável 'static' é global à classe. Sem ela, não teríamos como a Classe "lembrar" se já criou um objeto ou não.

3. Como você comprova no código que 'torreSetorNorte' e 'torreSetorSul' são exatamente o mesmo objeto na memória após a correção? (Dica: tente fazer console.log(torreSetorNorte === torreSetorSul)).
R: Fazendo o teste de igualdade estrita (console.log(torreSetorNorte === torreSetorSul)). O retorno no terminal é 'true', provando que as duas variáveis não são objetos diferentes, mas sim referências que apontam exatamente para o mesmo espaço de memória do único objeto instanciado.
=========================================================
*/

// SISTEMA DE COMUNICAÇÃO - ESCRITO PELO DEV JÚNIOR E CORRIGIDO PELOS SENIORS
// Correção: Implementação do Design Pattern Singleton

class TorreDeControle {
  // Variável estática para guardar a única instância
  static instancia = null;

  constructor() {
    // A trava do Singleton: se já existe uma torre, devolva ela mesma!
    if (TorreDeControle.instancia) {
      return TorreDeControle.instancia;
    }

    // Se é a primeira vez, inicializa as propriedades normalmente
    this.pistaOcupada = false;
    this.nomeDaTorre = "Torre Central " + Math.floor(Math.random() * 1000);

    // Salva a própria instância na variável estática da Classe
    TorreDeControle.instancia = this;
  }

  autorizarPouso(codigoVoo) {
    if (this.pistaOcupada) {
      console.log(`❌ [RECUSADO] Pista ocupada! Voo ${codigoVoo} aguarde.`);
    } else {
      this.pistaOcupada = true;
      console.log(
        `✅ [AUTORIZADO] Voo ${codigoVoo} pousando via ${this.nomeDaTorre}.`,
      );
    }
  }
}

// ========================================================
// TESTANDO A CORREÇÃO DO SINGLETON:

// O sistema de comunicação da Zona Norte pede uma torre
let torreSetorNorte = new TorreDeControle();

// O sistema da Zona Sul pede uma torre (o Singleton vai interceptar e devolver a mesma!)
let torreSetorSul = new TorreDeControle();

console.log("--- INICIANDO APROXIMAÇÃO ---");

// O Latam pede pouso para a Torre Norte
torreSetorNorte.autorizarPouso("LATAM-100");


torreSetorSul.autorizarPouso("GOL-200");

console.log("\n--- AUDITORIA DE SISTEMA ---");
// Prova de fogo: As duas torres são exatamente o mesmo objeto?
console.log(
  "Torre Norte e Torre Sul são o mesmo objeto na memória? ->",
  torreSetorNorte === torreSetorSul,
);
