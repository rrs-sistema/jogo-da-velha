class Jogador {
    constructor(nome, ponto) {
        this.nome = nome;
        this.ponto = ponto;
    }
    joga() {
        return `${this.nome} jogou`;
    }
    passa() {
        return `${this.nome} passou`;
    }
}