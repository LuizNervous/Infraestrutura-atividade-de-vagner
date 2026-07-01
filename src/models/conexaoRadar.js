/* =========================================================
RELATÓRIO DE CONECTIVIDADE (Async/Await & UX)
Auditores: Luiz e [Nome do Colega]

1. Por que é impossível conectar um sistema na internet sem lidar com o "Assincronismo" (espera)? O que o "await" faz literalmente com a execução do código?
R: Porque as requisições de rede demoram para viajar pelo mundo e responder. Se rodarmos o sistema de forma síncrona, a tela congela esperando a resposta. O 'await' pausa a execução daquela linha específica, obrigando o JavaScript a esperar a promessa (Promise) ser cumprida antes de avançar.

2. O que acontece com a Experiência do Usuário (UX) se não colocarmos uma mensagem de "Loading..." antes do fetch? 
R: O usuário fica olhando para uma tela estática, preta ou vazia, sem saber se o sistema travou, se o computador quebrou ou se está carregando. Informar o estado de "loading" acalma o usuário e mostra que o sistema está trabalhando.

3. Para que serve o bloco 'finally' em uma requisição de internet? Por que ele é o lugar perfeito para esconder a animação/texto de "Loading"?
R: O 'finally' serve para executar um código que DEVE rodar obrigatoriamente, independentemente se a requisição deu certo ou deu erro. Ele é perfeito para esconder o "Loading", pois o carregamento precisa sumir tanto quando os dados chegam com sucesso quanto quando o sistema falha.
=========================================================
*/

class Voo {
    constructor(codigo, destino) {
        this.codigo = codigo;
        this.destino = destino;
    }
}

class RadarService {
    async buscarVoosGlobais() {
        console.log("Iniciando busca no satélite...");
        
        // Usando uma API pública real que devolve dados de usuários (vamos fingir que são nossos voos!)
        // DICA: Se você quiser testar o erro do CATCH, mude a URL abaixo para algo errado (ex: adicionando um monte de 'xxxx')
        let resposta = await fetch("https://jsonplaceholder.typicode.com/users");
        
        if (!resposta.ok) {
            throw new Error("Erro de resposta do servidor do satélite.");
        }

        let dadosJson = await resposta.json();
        
        // Hidratando os objetos: transformando os dados da API em instâncias da classe Voo
        // Usamos 'username' como código do voo e 'city' do endereço como destino
        let voosRicos = dadosJson.map(dado => new Voo(dado.username, dado.address.city));
        
        return voosRicos;
    }
}

// === SIMULAÇÃO DA INTERFACE (DOM / PAINEL DO AEROPORTO) ===
// Criamos uma função assíncrona principal para poder usar o 'await' na chamada do serviço
async function inicializarPainelRadar() {
    
    // ATENÇÃO: Como no Node.js puro não existe o "document" do navegador, 
    // criamos uma segurança para o seu código rodar tanto no terminal quanto no HTML!
    let painelDOM = document.getElementById("telaPainel");

    try {
        // PASSO 1 (UX): Exibir o estado de carregamento antes de ir para a internet
        if (painelDOM) {
            painelDOM.innerHTML = "Buscando dados no satélite... 📡 Por favor, aguarde.";
        } else {
            console.log("Status do Painel: Buscando dados no satélite... 📡");
        }

        // Criando a instância do radar e esperando as informações reais chegarem
        let radar = new RadarService();
        let listaPronta = await radar.buscarVoosGlobais(); // Aguarda a hidratação

        // PASSO 2 (SUCESSO): Se chegou aqui, deu tudo certo! Renderiza na tela
        if (painelDOM) {
            painelDOM.innerHTML = `<h3>Sucesso! Temos ${listaPronta.length} aeronaves rastreadas:</h3>`;
            listaPronta.forEach(voo => {
                painelDOM.innerHTML += `<p>✈️ Voo: <strong>${voo.codigo}</strong> com destino a <strong>${voo.destino}</strong></p>`;
            });
        } else {
            console.log(`\n=== SUCESSO! RASTREAMOS ${listaPronta.length} VOOS ===`);
            listaPronta.forEach(voo => console.log(`Voo: ${voo.codigo} | Destino: ${voo.destino}`));
        }

    } catch (erro) {
        // PASSO 3 (ERRO): Se a internet cair ou a URL quebrar, o sistema cai aqui sem travar a tela
        console.error("Alerta de Rede:", erro.message);
        
        if (painelDOM) {
            painelDOM.innerHTML = "<div style='color: red; font-weight: bold;'>Falha Crítica de Conexão com o Satélite! ❌ Tente novamente mais tarde.</div>";
        }

    } finally {
        // PASSO 4 (UX - ENCERRAMENTO): O carregamento acabou
        console.log("Conexão finalizada. Estado do Loading: Desativado.");
    }
}

// Executa o painel
// Se estiver no navegador, ele vai esperar a página carregar
if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", inicializarPainelRadar);
} else {
    // Se estiver rodando no terminal com o Node
    inicializarPainelRadar();
}