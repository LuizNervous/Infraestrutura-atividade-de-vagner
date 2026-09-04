/* 
=========================================================
RELATÓRIO DE AUDITORIA DE CLEAN CODE E SOLID
Auditores: [Nome do Aluno A] e [Nome do Aluno B]

1. O que significa a sigla SRP (Single Responsibility Principle) e por que aplicamos ela hoje?
R: Significa Princípio da Responsabilidade Única. Aplicamos o SRP para separar as regras de dados (Voo.js), a persistência em disco (StorageService.js) e a interface visual (PainelView.js), garantindo um código modular e fácil de manter.

2. Se amanhã o Diretor do Aeroporto pedir para trocar a interface de "Cards" por uma "Tabela de Excel" no HTML, qual NOME DE ARQUIVO exato precisaremos alterar? Por que essa separação evita que a gente estrague o Banco de Dados sem querer?
R: Alteraremos apenas o 'PainelView.js'. Como o 'StorageService.js' está isolado, alterações visuais não afetam a lógica do LocalStorage, prevenindo a corrupção do banco de dados.

3. Para o código funcionar separado em 4 arquivos, tivemos que usar 'export' e 'import'. O que isso tem a ver com a "Modularização (ES6 Modules)"?
R: Os ES6 Modules permitem organizar a aplicação em arquivos independentes que compartilham classes e funções com 'export' e 'import' sem poluir o escopo global.
=========================================================
*/
import Voo from './models/Voo.js';
import JatoExecutivo from './models/Voorapido.js';
import VooCarga from './models/VooCarga.js';
import { StorageService } from './StorageService.js';
import { PainelView } from './PainelView.js';
import AgenteIoTService from './AgenteIoTService.js'; // 1. IMPORT DO AGENTE IOT

// Inicialização dos Objetos
const meuVoo = new Voo('JS1024', 'São Paulo', 'Tóquio', '14:30');
const meuJato = new JatoExecutivo('JT-001', 'Rio', 'Nova York');
const meuCargueiro = new VooCarga('CG-999', 'Manaus', 'Miami', 50000);

document.addEventListener('DOMContentLoaded', () => {
    // Renderização Inicial
    PainelView.atualizarVooPrincipal(meuVoo);
    PainelView.atualizarJato(meuJato);
    PainelView.atualizarCarga(meuCargueiro);
    
    // Pega a frota do storage
    let frotaGlobal = StorageService.obterFrota();
    if (frotaGlobal.length === 0) {
        // Se o banco estiver vazio, coloca o meuVoo como padrão para o robô monitorar
        frotaGlobal.push(meuVoo);
    }
    PainelView.renderizarLista(frotaGlobal);

    // 2. INSTANCIAÇÃO E ATIVAÇÃO DO AGENTE IOT
    const agenteRobo = new AgenteIoTService(frotaGlobal, () => {
        PainelView.renderizarLista(frotaGlobal);
        PainelView.atualizarVooPrincipal(meuVoo);
    });

    // LIGA O ROBÔ ASSÍNCRONO
    agenteRobo.iniciarMonitoramentoCorreto();

    // Eventos - Registro de Novo Voo
    document.getElementById('btn-registrar')?.addEventListener('click', () => {
        const origem = document.getElementById('input-origem').value;
        const destino = document.getElementById('input-destino').value;

        try {
            const novoVoo = new Voo("NEW-777", origem, destino, "12:00");
            meuVoo.mudarRota(novoVoo.origem, novoVoo.destino);
            
            StorageService.salvarVoo(meuVoo);
            PainelView.atualizarVooPrincipal(meuVoo);
            PainelView.renderizarLista(StorageService.obterFrota());
            PainelView.exibirMensagem("Voo registrado e salvo com sucesso!", "green");

            document.getElementById('input-origem').value = "";
            document.getElementById('input-destino').value = "";
        } catch (erro) {
            PainelView.exibirMensagem(erro.message, "red");
        }
    });

    // Eventos - Voo Principal
    document.getElementById('btn-decolar')?.addEventListener('click', () => {
        meuVoo.decolar();
        PainelView.atualizarVooPrincipal(meuVoo);
    });

    document.getElementById('btn-pousar')?.addEventListener('click', () => {
        meuVoo.pousar();
        PainelView.atualizarVooPrincipal(meuVoo);
    });

    // Eventos - Jato
    document.getElementById('btn-jato-decolar')?.addEventListener('click', () => {
        meuJato.decolar();
        PainelView.atualizarJato(meuJato);
    });
    document.getElementById('btn-jato-pousar')?.addEventListener('click', () => {
        meuJato.pousar();
        PainelView.atualizarJato(meuJato);
    });
    document.getElementById('btn-super-on')?.addEventListener('click', () => {
        meuJato.ativarSupersonico();
        PainelView.atualizarJato(meuJato);
    });
    document.getElementById('btn-super-off')?.addEventListener('click', () => {
        meuJato.desativarSupersonico();
        PainelView.atualizarJato(meuJato);
    });

    // Eventos - Carga
    document.getElementById('btn-embarcar')?.addEventListener('click', () => {
        const inputPeso = document.getElementById('input-peso');
        const peso = parseInt(inputPeso.value);

        try {
            if (peso > 0) {
                meuCargueiro.embarcarCarga(peso);
                PainelView.atualizarCarga(meuCargueiro);
                inputPeso.value = '';
                PainelView.exibirMensagem("Carga embarcada com sucesso!", "green");
            }
        } catch (erro) {
            PainelView.exibirMensagem(erro.message, "red");
        }
    });
});