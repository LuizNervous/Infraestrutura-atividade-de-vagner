import Voo from './models/Voo.js';

export class StorageService {
    static obterFrota() {
        let dadosBrutos = JSON.parse(localStorage.getItem("frota")) || [];
        return dadosBrutos.map(dado => {
            let voo = new Voo(dado.codigo, dado.origem, dado.destino, dado.horario);
            voo.status = dado.status;
            return voo;
        });
    }

    static salvarVoo(voo) {
        let frota = StorageService.obterFrota();
        frota.push(voo);
        localStorage.setItem("frota", JSON.stringify(frota));
    }
}