class Jogador {
    constructor(nome, simbolo) {
        this.nome = nome;
        this.simbolo = simbolo;
    }
}

class Self {
    constructor(robo, simbolo, texto, bottonLabel, jogador1, jogador2, nomeJogadorAtual) {
        this.robo = robo;
        this.simbolo = simbolo;
        this.texto = texto;
        this.bottonLabel = bottonLabel;
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        this.nomeJogadorAtual = nomeJogadorAtual;
    }
}

const JogoVelha = () => {
    let total = 0;
    let venceu = false;
    let podeJogar = false;
    let quadro;
    let jogadas = [];

    const mensagens = [
        'Aperte jogar para iniciar',
        'Agora é sua vez',
        'Venceu o jogo',
        'Jogo empatado'
    ]

    const self = new Self(true, '', mensagens[0], 'Jogar', null, null, null);


    const checkMatching = (val1, val2, val3) => {
        if (jogadas[val1] === jogadas[val2] && jogadas[val2] === jogadas[val3]) {
            return jogadas[val1];
        }
    }

    const clickedBox = (elemento) => {
        let winner = false;

        if (elemento) {
            total++;
            const id = elemento.getAttribute('data-id');
            if (!podeJogar || jogadas[id]) {// Verifica se o jogador pode jogar ou se a celular já foi preenchida
                return false;
            }
            elemento.innerText = self.simbolo;
            jogadas[id] = self.simbolo;


            // Verifica todas as opções do jogador ganhar a partida
            winner = (checkMatching(1, 2, 3) || checkMatching(4, 5, 6) || checkMatching(7, 8, 9) ||
                checkMatching(1, 4, 7) || checkMatching(2, 5, 8) || checkMatching(3, 6, 9) ||
                checkMatching(1, 5, 9) || checkMatching(3, 5, 7));

            if (winner) {
                total = 0;
                venceu = true;
                self.simbolo = winner;
                self.texto = mensagens[2];
                podeJogar = false;
                const mensagem = document.getElementById('mensagem');
                mensagem.className = "efeitoVenceu";
            } else {
                if (self.simbolo === 'x') {
                    self.simbolo = 'o';
                    self.nomeJogadorAtual = self.jogador2.nome + ' - ';
                } else {
                    self.simbolo = 'x';
                    self.nomeJogadorAtual = self.jogador1.nome + ' - ';
                }
            }
        }

        if (!venceu && total > 8) {
            const mensagem = document.getElementById('mensagem');
            self.nomeJogadorAtual = '';
            self.texto = mensagens[3];
            self.simbolo = '';
            mensagem.className = "efeitoVenceu";
            return false;
        }

        return true;
    }

    self.init = (elemento) => {
        quadro = elemento;
        elemento.addEventListener('click', (e) => {
            switch (e.target.tagName) {
                case 'SPAN':
                    if (clickedBox(e.target)) {
                        if (self.robo && !venceu) {
                            elemento.style.pointerEvents = 'none';
                            setTimeout(() => {
                                const emptyTitles = elemento.querySelectorAll('span:empty');
                                const cell = emptyTitles[Math.floor(Math.random() * emptyTitles.length)];
                                clickedBox(cell);
                                elemento.style.pointerEvents = '';
                            }, 500);
                        }
                    }
                    break;
                case 'BUTTON':
                    play();
                    break;
            };
        });
    }

    const play = () => {

        let jogador1 = new Jogador('Kamilly', 'x');
        let jogador2 = new Jogador(self.robo ? 'Máquina' : 'Roberto', 'o');

        total = 0;
        podeJogar = true;
        venceu = false;
        self.jogador1 = jogador1;
        self.jogador2 = jogador2;
        self.simbolo = jogador1.simbolo;
        self.nomeJogadorAtual = jogador1.nome + ' - ';
        self.texto = mensagens[1];
        jogadas = [];
        const cells = quadro.querySelectorAll('span');
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
        }
        const mensagem = document.getElementById('mensagem');
        mensagem.className = 'none';
        self.bottonLabel = 'Reiniciar';
    }


    const template = `
        <div>
            <h1>Jogo da velha</h1>
            <p class="checkbox">
                Jogar contra a máquina <input type="checkbox" checked @bind="self.robo">
            </p>
            <div>
                <div class="gui">
                    <span id="mensagem">{{self.nomeJogadorAtual}} {{self.texto}}</span>
                </div>
                <div class="quadro" @ready="self.init(this)">
                    <section class="board__column">
                        <span class="board__cell" data-id="1"></span>
                        <span class="board__cell" data-id="2"></span>
                        <span class="board__cell" data-id="3"></span>
                    </section>
                    <section class="board__column">
                        <span class="board__cell" data-id="4"></span>
                        <span class="board__cell" data-id="5"></span>
                        <span class="board__cell" data-id="6"></span>
                    </section>
                    <section class="board__column">
                        <span class="board__cell" data-id="7"></span>
                        <span class="board__cell" data-id="8"></span>
                        <span class="board__cell" data-id="9"></span>
                    </section>
                    <button class="btn">{{self.bottonLabel}}</button>
                </div>
            </div>
        </div>
    `;

    return lemonade.element(template, self);
}
