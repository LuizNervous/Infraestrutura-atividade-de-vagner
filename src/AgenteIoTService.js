/* 
=========================================================
RELATÓRIO DE AUDITORIA DE TEMPO REAL (EVENT LOOP E IOT)
Auditores: [Nome do Aluno A] e [Nome do Aluno B]

1. Por que um laço infinito comum (while true) congela a aba do navegador, impedindo o usuário de clicar em qualquer botão?
R: O JavaScript é 'Single Thread' (possui apenas uma única thread de execução) e executa o código de forma síncrona na 'Call Stack' (Pilha de Chamadas). Um laço 'while(true)' ocupa a Call Stack perpetuamente, impedindo que o Event Loop processe eventos de clique, renderização de tela ou qualquer outra tarefa do navegador, travando totalmente a interface do usuário.

2. Como o 'Event Loop' e o 'setInterval' trabalham juntos para executar a nossa varredura de voos a cada 5 segundos sem travar a tela principal?
R: A função 'setInterval' delega a contagem do tempo para as 'Web APIs' do navegador (fora da thread principal do JS). Enquanto o tempo corre (5 segundos), a Call Stack fica livre para o usuário clicar e navegar. Quando o tempo expira, a Web API envia a função de callback para a 'Task Queue'. O Event Loop então verifica se a Call Stack está vazia e executa o callback de forma não-bloqueante.

3. Pensando em um sistema do mundo real (IoT), qual o perigo de deixar um setInterval rodando para sempre se fecharmos o painel do aeroporto? (Dica: pesquise sobre clearInterval e Memory Leak).
R: Deixar um setInterval rodando sem desativá-lo causa 'Memory Leak' (vazamento de memória) e desperdício de CPU. O robô continuará rodando em segundo plano tentando acessar objetos da memória que não existem mais na tela. Para evitar isso, devemos guardar o ID do temporizador e chamar o 'clearInterval(timerId)' quando a tela ou componente for destruído.
=========================================================
*/

export default class AgenteIoTService {
    constructor(frota, funcaoRenderizar) {
        this.frota = frota;
        this.renderizar = funcaoRenderizar; // Função de renderização da View
        this.timerId = null; // ID do timer para permitir o clearInterval
    }

    // O JÚNIOR TENTOU FAZER O SISTEMA RODAR SOZINHO ASSIM (INCORRETO):
    iniciarMonitoramentoIncorreto() {
        console.log("Iniciando monitoramento incorreto...");
        console.log("O código acima travou a 'Call Stack' (Pilha de Chamadas).");
    }

    // O JEITO CERTO (Assincronismo Temporal via Web API / Event Loop)
    iniciarMonitoramentoCorreto() {
        console.log("🤖 [Agente IoT] Robô de monitoramento iniciado com sucesso!");

        // Registra o intervalo assíncrono de 5000ms (5 segundos)
        this.timerId = setInterval(() => {
            console.log("⏱️ [Agente IoT] Executando varredura automatizada nos voos...");

            this.frota.forEach(voo => {
                // Se o voo não tiver a propriedade tempoParaDecolagem, criamos um valor aleatório entre 1 e 3 ciclos
                if (voo.tempoParaDecolagem === undefined) {
                    voo.tempoParaDecolagem = Math.floor(Math.random() * 3) + 1;
                }

                if (voo.tempoParaDecolagem > 0) {
                    voo.tempoParaDecolagem -= 1;
                    console.log(`⏳ Voo ${voo.codigo}: faltam ${voo.tempoParaDecolagem * 5}s para decolagem.`);
                } else if (voo.status !== "Em voo 🛫") {
                    voo.decolar(); // Usa o método da classe Voo
                    console.log(`✈️ [Agente IoT] Voo ${voo.codigo} DECOLOU AUTOMATICAMENTE!`);
                }
            });

            // Atualiza a interface gráfica (View) sem bloquear o usuário
            if (typeof this.renderizar === 'function') {
                this.renderizar();
            }
        }, 5000);
    }

    // Boa prática de Engenharia: Desligar o agente quando necessário
    pararMonitoramento() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
            console.log("🛑 [Agente IoT] Robô de monitoramento desligado.");
        }
    }
}