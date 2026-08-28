export class PainelView {
    static atualizarVooPrincipal(voo) {
        document.getElementById('codigo').innerText = voo.codigo;
        document.getElementById('rota').innerText = `${voo.origem} ➔ ${voo.destino}`;
        document.getElementById('horario').innerText = voo.horario;
        document.getElementById('status').innerText = voo.status;

        const imgAviao = document.getElementById('imagem-aviao');
        if (imgAviao) {
            if (voo.status === 'Em voo 🛫') {
                imgAviao.classList.add('voando');
            } else {
                imgAviao.classList.remove('voando');
            }
        }
    }

    static atualizarJato(jato) {
        document.getElementById('jato-codigo').innerText = jato.codigo;
        document.getElementById('jato-altitude').innerText = jato.altitude;
        document.getElementById('jato-status-super').innerText = jato.modoSupersonico ? 'Ativado 🔥' : 'Desativado';
    }

    static atualizarCarga(cargueiro) {
        document.getElementById('carga-codigo').innerText = cargueiro.codigo;
        document.getElementById('carga-max').innerText = cargueiro.capacidadeMaxima;
        document.getElementById('carga-atual').innerText = cargueiro.cargaAtual;
    }

    static renderizarLista(frota) {
        const tela = document.getElementById('telaPainel');
        if (!tela) return;
        tela.innerHTML = "";
        frota.forEach(voo => {
            tela.innerHTML += `<div class="card">✈️ ${voo.codigo}: ${voo.origem} ➔ ${voo.destino} (${voo.status})</div>`;
        });
    }

    static exibirMensagem(texto, cor = "black") {
        const aviso = document.getElementById('avisoSistema');
        if (aviso) {
            aviso.innerText = texto;
            aviso.style.color = cor;
        }
    }
}