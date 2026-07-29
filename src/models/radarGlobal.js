/* 
=========================================================
DOCUMENTAÇÃO DE DEPLOY E ARQUITETURA - AV1
Auditores: Luiz 

1. Como você usou o Polimorfismo na função iniciarRadar() para exibir informações diferentes sem precisar usar um monte de IFs na hora de escrever no HTML?
R: Na hora de mapear os dados da API, nós checamos o "tipo" do voo e instanciamos a classe filha correta ('new VooComercial' ou 'new VooCarga'). Como ambas as classes possuem o método 'gerarRelatorio()' sobrescrito com comportamentos diferentes, na hora de criar o HTML basta chamar 'voo.gerarRelatorio()'. O próprio objeto já sabe como deve se apresentar (Polimorfismo), o que elimina a necessidade de fazer IFs dentro da estrutura do HTML.

2. O que a IA explicou sobre o perigo de expor API Keys no código Front-end? O que são Variáveis de Ambiente?
R: O código JavaScript do Front-End (que roda no navegador do usuário) é totalmente público; qualquer um pode abri-lo apertando F12. Se uma API Key for deixada ali, hackers podem roubá-la e usá-la para fazer requisições ilícitas, estourando os custos do servidor. As "Variáveis de Ambiente" (.env) são cofres seguros que ficam escondidos no servidor da hospedagem (como na Vercel), garantindo que as senhas nunca cheguem visíveis à tela do usuário.
=========================================================
*/

// 1. AS CLASSES (Mãe e Filhas)
class Voo {
    constructor(codigo) { this.codigo = codigo; }
    gerarRelatorio() { return `Voo genérico ${this.codigo}`; }
}
    
class VooComercial extends Voo {
    constructor(codigo, passageiros) {
        super(codigo);
        this.passageiros = passageiros;
    }
    // Sobrescrita do Método
    gerarRelatorio() { return `✈️ Comercial [${this.codigo}] - ${this.passageiros} vidas a bordo.`; }
}

class VooCarga extends Voo {
    constructor(codigo, cargaToneladas) {
        super(codigo);
        this.cargaToneladas = cargaToneladas;
    }
    // Sobrescrita do Método
    gerarRelatorio() { return `📦 Cargueiro [${this.codigo}] - ${this.cargaToneladas}T de carga.`; }
}

// 2. A FALHA DE SEGURANÇA CORRIGIDA
// A API_KEY foi removida permanentemente do código público!

// 3. A SIMULAÇÃO DE DADOS DA INTERNET
const dadosDaAPI = [
      { id: "G3-100", tipo: "comercial", qtd: 150 },
    { id: "AZ-999", tipo: "carga", qtd: 80 },
    { id: "G3-100", tipo: "comercial", qtd: 150 },
    { id: "AZ-999", tipo: "carga", qtd: 80 },
    { id: "G3-100", tipo: "comercial", qtd: 150 },
    { id: "AZ-999", tipo: "carga", qtd: 80 },
    { id: "LA-200", tipo: "comercial", qtd: 200 }
];

// 4. A ARQUITETURA CORRIGIDA (Factory e Polimorfismo)
async function iniciarRadar() {
    console.log("Conectando ao satélite global de forma segura... 🛰️"); 
    
    let painel = document.getElementById("telaPainel");
    
    // Proteção para não quebrar se rodarmos apenas no terminal
    if (painel) {
        painel.innerHTML = "";
    } else {
        console.log("\n=== PAINEL DE RELATÓRIOS DO TERMINAL ===");
    }

    // MAPEAMENTO INTELIGENTE: Instanciando a classe correta com base no JSON
    let voosProcessados = dadosDaAPI.map(dado => {
        if (dado.tipo === "comercial") {
            return new VooComercial(dado.id, dado.qtd);
        } else if (dado.tipo === "carga") {
            return new VooCarga(dado.id, dado.qtd);
        } else {
            return new Voo(dado.id);
        }
    });

    // POLIMORFISMO NA PRÁTICA: Cada voo sabe como gerar seu próprio relatório
    voosProcessados.forEach(voo => {
        if (painel) {
            let div = document.createElement("div");
            // Não importa qual Voo seja, o método a ser chamado é exatamente o mesmo!
            div.innerHTML = `<h3>${voo.gerarRelatorio()}</h3>`;
            painel.appendChild(div);
        } else {
            // Imprime no terminal se estiver rodando via Node.js
            console.log(voo.gerarRelatorio());
        }
    });
}

// Inicializador Inteligente: Executa no navegador ou no terminal
if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", iniciarRadar);
} else {
    iniciarRadar();
}