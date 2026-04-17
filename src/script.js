class Voo {
    #altitude; // Propriedade privada

    constructor(codigo, origem, destino, horario) {
        this.codigo = codigo;
        this.origem = origem;
        this.destino = destino;
        this.horario = horario;
        this.status = 'No portão de embarque';
        this.#altitude = 0;
    }

    // GETTER: Para ler a altitude
    get altitude() {
        return this.#altitude;
    }

    // SETTER: Para mudar a altitude com segurança
    set altitude(valor) {
        if (this.status === 'Em voo 🛫' || valor === 0) {
            this.#altitude = valor;
        }
    }

    // NOVO MÉTODO: Mudar Rota e Destino
    mudarRota(novaOrigem, novoDestino) {
        this.origem = novaOrigem;
        this.destino = novoDestino;
        
        // Se for o voo principal, atualiza o SPAN 'rota' no HTML
        const elementoRota = document.getElementById('rota');
        if (elementoRota && this.codigo === meuVoo.codigo) {
            elementoRota.innerText = `${this.origem} ➔ ${this.destino}`;
        }
        console.log(`Rota alterada: ${this.origem} para ${this.destino}`);
    }

    atualizarStatus(novoStatus, classeCss) {
        this.status = novoStatus;
        const elementoStatus = document.getElementById('status');
        if (elementoStatus) {
            elementoStatus.innerText = this.status;
            elementoStatus.className = ''; 
            if (classeCss) elementoStatus.classList.add(classeCss);
        }
    }

    decolar() {
        if (this.status !== 'Em voo 🛫') {
            this.atualizarStatus('Em voo 🛫', 'status-voando');
            this.altitude = 10000;
            const imgAviao = document.getElementById('imagem-aviao');
            if (imgAviao) imgAviao.classList.add('voando');
        }
    }

    pousar() {
        if (this.status === 'Em voo 🛫') {
            this.atualizarStatus('Pousado com segurança 🛬', 'status-pousado');
            this.altitude = 0;
            const imgAviao = document.getElementById('imagem-aviao');
            if (imgAviao) imgAviao.classList.remove('voando');
        }
    }
}

// --- SUBCLASSE: JATO EXECUTIVO ---
class JatoExecutivo extends Voo {
    constructor(codigo, origem, destino) {
        super(codigo, origem, destino, 'Imediato');
        this.modoSupersonico = false;
    }

    ativarSupersonico() {
        if (this.status === 'Em voo 🛫') {
            this.modoSupersonico = true;
            this.altitude = 60000;
        } else {
            alert('Decole o jato primeiro!');
        }
    }

    desativarSupersonico() {
        this.modoSupersonico = false;
        this.altitude = 10000;
    }

    pousar() {
        super.pousar();
        this.modoSupersonico = false;
    }
}

// --- SUBCLASSE: VOO CARGUEIRO ---
class VooCarga extends Voo {
    constructor(codigo, origem, destino, capacidadeMaxima) {
        super(codigo, origem, destino, 'Noturno');
        this.capacidadeMaxima = capacidadeMaxima;
        this.cargaAtual = 0;
    }

    embarcarCarga(peso) {
        if (this.cargaAtual + peso <= this.capacidadeMaxima) {
            this.cargaAtual += peso;
            alert(`✅ ${peso}kg carregados!`);
        } else {
            alert("❌ Excesso de peso!");
        }
    }
}

// ==========================================
// INICIALIZAÇÃO DOS OBJETOS
// ==========================================
const meuVoo = new Voo('JS1024', 'São Paulo', 'Tóquio', '14:30');
const meuJato = new JatoExecutivo('JT-001', 'Rio', 'Nova York');
const meuCargueiro = new VooCarga('CG-999', 'Manaus', 'Miami', 50000);

// ==========================================
// FUNÇÕES DE ATUALIZAÇÃO DA TELA (INTERFACE)
// ==========================================

function carregarDadosIniciais() {
    // Painel Principal
    document.getElementById('codigo').innerText = meuVoo.codigo;
    document.getElementById('rota').innerText = `${meuVoo.origem} ➔ ${meuVoo.destino}`;
    document.getElementById('horario').innerText = meuVoo.horario;
    document.getElementById('status').innerText = meuVoo.status;

    // Painel Jato
    document.getElementById('jato-codigo').innerText = meuJato.codigo;
    atualizarPainelJato();

    // Painel Carga
    document.getElementById('carga-codigo').innerText = meuCargueiro.codigo;
    document.getElementById('carga-max').innerText = meuCargueiro.capacidadeMaxima;
    document.getElementById('carga-atual').innerText = meuCargueiro.cargaAtual;
}

function atualizarPainelJato() {
    document.getElementById('jato-altitude').innerText = meuJato.altitude;
    document.getElementById('jato-status-super').innerText = meuJato.modoSupersonico ? 'Ativado 🔥' : 'Desativado';
}

// ==========================================
// EVENTOS DE CLIQUES
// ==========================================

// Painel Principal
document.getElementById('btn-decolar').addEventListener('click', () => meuVoo.decolar());
document.getElementById('btn-pousar').addEventListener('click', () => meuVoo.pousar());

// Painel Jato
document.getElementById('btn-jato-decolar').addEventListener('click', () => {
    meuJato.decolar();
    atualizarPainelJato();
});
document.getElementById('btn-jato-pousar').addEventListener('click', () => {
    meuJato.pousar();
    atualizarPainelJato();
});
document.getElementById('btn-super-on').addEventListener('click', () => {
    meuJato.ativarSupersonico();
    atualizarPainelJato();
});
document.getElementById('btn-super-off').addEventListener('click', () => {
    meuJato.desativarSupersonico();
    atualizarPainelJato();
});

// Painel Carga
document.getElementById('btn-embarcar').addEventListener('click', () => {
    const peso = parseInt(document.getElementById('input-peso').value);
    if (peso > 0) {
        meuCargueiro.embarcarCarga(peso);
        document.getElementById('carga-atual').innerText = meuCargueiro.cargaAtual;
        document.getElementById('input-peso').value = '';
    }
});

// Inicializa tudo ao carregar a página
carregarDadosIniciais();