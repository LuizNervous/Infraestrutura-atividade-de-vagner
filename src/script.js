class Voo {
    constructor(codigo, origem, destino, horario) {
        this.codigo = codigo;
        this.origem = origem;
        this.destino = destino;
        this.horario = horario;
        this.status = 'No portão de embarque'; 
        this.altitude = 0; // Adicionei a altitude aqui para evitar erros de herança
    }

    atualizarStatus(novoStatus, classeCss) {
        this.status = novoStatus; 
        const elementoStatus = document.getElementById('status');
        
        // Verifica se o elemento existe (pois o painel do Jato/Carga não usa o mesmo id 'status')
        if (elementoStatus) {
            elementoStatus.innerText = this.status;
            elementoStatus.className = ''; 
            if (classeCss) {
                elementoStatus.classList.add(classeCss);
            }
        }
    }

    decolar() {
        if (this.status !== 'Em voo 🛫') {
            this.atualizarStatus('Em voo 🛫', 'status-voando');
            this.altitude = 10000; // Define altitude padrão de voo
            
            const imgAviao = document.getElementById('imagem-aviao');
            if(imgAviao) imgAviao.classList.add('voando');
        } else {
            alert('O avião já está no ar!');
        }
    }

    pousar() {
        if (this.status === 'Em voo 🛫') {
            this.atualizarStatus('Pousado com segurança 🛬', 'status-pousado');
            this.altitude = 0;
            
            const imgAviao = document.getElementById('imagem-aviao');
            if(imgAviao) imgAviao.classList.remove('voando');
        } else {
            alert('O avião precisa estar voando para pousar!');
        }
    }
}   

// --- VOO PADRÃO ---
const meuVoo = new Voo('JS1024', 'São Paulo', 'Tóquio', '14:30');

document.getElementById('codigo').innerText = meuVoo.codigo;
document.getElementById('rota').innerText = `${meuVoo.origem} ➔ ${meuVoo.destino}`;
document.getElementById('horario').innerText = meuVoo.horario;
document.getElementById('status').innerText = meuVoo.status;

document.getElementById('btn-decolar').addEventListener('click', () => { meuVoo.decolar(); });
document.getElementById('btn-pousar').addEventListener('click', () => { meuVoo.pousar(); });

// --- SUBCLASSE: JATO EXECUTIVO ---
class JatoExecutivo extends Voo {
    constructor(codigo, origem, destino) {
        super(codigo, origem, destino); 
        this.modoSupersonico = false; 
    }

    ativarSupersonico() {
        if (this.status === 'Em voo 🛫') {
            this.modoSupersonico = true;
            this.altitude = 60000; 
            return true;
        } else {
            alert('O jato precisa decolar antes de ativar o modo supersônico!');
            return false;
        }
    }

    desativarSupersonico() {
        this.modoSupersonico = false;
        this.altitude = 10000; 
    }

    // --- NOVO MÉTODO COM POLIMORFISMO ---
    pousar() {
        // Chama o pousar original da classe mãe (muda status e imagem)
        super.pousar(); 
        
        // Comportamento exclusivo do Jato ao pousar
        this.modoSupersonico = false; // Desliga o supersônico por segurança
        this.altitude = 0; // Zera a altitude
    }
}

// --- LÓGICA DO JATO EXECUTIVO ---
const meuJato = new JatoExecutivo('JT-001', 'Rio de Janeiro', 'Nova York');
document.getElementById('jato-codigo').innerText = meuJato.codigo;
// Localize onde você colocou os outros eventos do Jato e adicione este:

document.getElementById('btn-jato-pousar').addEventListener('click', () => {
    meuJato.pousar(); // Vai usar o método que acabamos de sobrescrever
    atualizarTelaJato(); // Atualiza a altitude e o texto na tela
});

function atualizarTelaJato() {
    document.getElementById('jato-altitude').innerText = meuJato.altitude;
    document.getElementById('jato-status-super').innerText = meuJato.modoSupersonico ? 'Ativado 🔥' : 'Desativado';
}

document.getElementById('btn-jato-decolar').addEventListener('click', () => {
    meuJato.decolar(); 
    atualizarTelaJato();
});

document.getElementById('btn-super-on').addEventListener('click', () => {
    meuJato.ativarSupersonico();
    atualizarTelaJato();
});

document.getElementById('btn-super-off').addEventListener('click', () => {
    meuJato.desativarSupersonico();
    atualizarTelaJato();
});

// --- SUBCLASSE: VOO CARGUEIRO ---
class VooCarga extends Voo {
    constructor(codigo, origem, destino, capacidadeMaxima) {
        super(codigo, origem, destino); 
        this.capacidadeMaxima = capacidadeMaxima;
        this.cargaAtual = 0;
    }

    embarcarCarga(peso) {
        if (this.cargaAtual + peso <= this.capacidadeMaxima) {
            this.cargaAtual += peso;
            alert(`✅ ${peso}kg embarcados com sucesso!`);
        } else {
            let espacoLivre = this.capacidadeMaxima - this.cargaAtual;
            alert(`❌ Erro! A capacidade máxima foi excedida. Espaço livre: ${espacoLivre}kg.`);
        }
    }
}

// --- LÓGICA DO VOO CARGUEIRO ---
const meuCargueiro = new VooCarga('CG-999', 'Manaus', 'Miami', 50000);

document.getElementById('carga-codigo').innerText = meuCargueiro.codigo;
document.getElementById('carga-max').innerText = meuCargueiro.capacidadeMaxima;

document.getElementById('btn-embarcar').addEventListener('click', () => {
    let pesoDigitado = parseInt(document.getElementById('input-peso').value);
    
    if (pesoDigitado > 0) {
        meuCargueiro.embarcarCarga(pesoDigitado); 
        document.getElementById('carga-atual').innerText = meuCargueiro.cargaAtual; 
        document.getElementById('input-peso').value = ''; // Limpa o input após embarcar
    } else {
        alert("Digite um peso válido!");
    }
});